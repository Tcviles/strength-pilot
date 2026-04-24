import os
import time
from typing import Dict, List, Optional

from common.domain.canonical_exercises import CanonicalExercise
from common.domain.exercise_seed import build_seed_exercises
from common.services.dynamo import DynamoConnection
from common.utils.logger import setup_logger

logger = setup_logger('exercise-library')


class ExerciseLibraryService:
    _cache: Dict[str, Dict[str, object]] = {}

    def __init__(self, table_name: Optional[str] = None, cache_ttl_seconds: int = 300):
        self.table_name = table_name or os.getenv('EXERCISES_TABLE')
        self.cache_ttl_seconds = cache_ttl_seconds
        self.dynamo = DynamoConnection(self.table_name) if self.table_name else None

    def list_exercises(self, force_refresh: bool = False, dynamo_only: bool = False) -> List[CanonicalExercise]:
        cache_key = f"{self.table_name or '__fallback__'}:{'dynamo' if dynamo_only else 'merged'}"
        cached = self._cache.get(cache_key)
        now = time.time()

        if (
            not force_refresh
            and cached
            and now - cached['loadedAt'] < self.cache_ttl_seconds
        ):
            return cached['exercises']  # type: ignore[return-value]

        exercises = self._load_from_dynamo() if dynamo_only else self._load_from_sources()

        exercises = sorted(exercises, key=lambda exercise: exercise.name)
        self._cache[cache_key] = {
            'loadedAt': now,
            'exercises': exercises,
            'source': 'dynamo' if dynamo_only else 'legacy-plus-dynamo',
        }
        return exercises

    def get_exercise(self, exercise_id: str, dynamo_only: bool = False) -> Optional[CanonicalExercise]:
        if dynamo_only and self.dynamo:
            item = self.dynamo.get_item({'exerciseId': exercise_id})
            return CanonicalExercise.from_record(item) if item else None
        return self.get_exercise_map().get(exercise_id)

    def get_exercise_map(self, dynamo_only: bool = False) -> Dict[str, CanonicalExercise]:
        return {
            exercise.exercise_id: exercise
            for exercise in self.list_exercises(dynamo_only=dynamo_only)
        }

    def upsert_exercise(self, record: dict) -> CanonicalExercise:
        if not self.dynamo:
            raise ValueError('EXERCISES_TABLE is not configured')

        canonical = CanonicalExercise.from_record(record)
        self.dynamo.put_item(canonical.to_record())

        cache_prefix = self.table_name or '__fallback__'
        self._clear_cache(cache_prefix)
        return canonical

    def delete_exercise(self, exercise_id: str) -> bool:
        if not self.dynamo:
            raise ValueError('EXERCISES_TABLE is not configured')

        existing = self.dynamo.get_item({'exerciseId': exercise_id})
        if not existing:
            return False

        for item in self.dynamo.scan_all():
            alternatives = list(item.get('alternatives') or [])
            if exercise_id not in alternatives:
                continue

            updated_alternatives = [alternative for alternative in alternatives if alternative != exercise_id]
            item['alternatives'] = updated_alternatives
            canonical = CanonicalExercise.from_record(item)
            self.dynamo.put_item(canonical.to_record())

        self.dynamo.delete_item({'exerciseId': exercise_id})

        cache_prefix = self.table_name or '__fallback__'
        self._clear_cache(cache_prefix)
        return True

    def _clear_cache(self, cache_prefix: str) -> None:
        for key in list(self._cache.keys()):
            if key.startswith(cache_prefix):
                self._cache.pop(key, None)

    def _load_from_sources(self) -> List[CanonicalExercise]:
        legacy_by_id = {
            exercise.exercise_id: exercise
            for exercise in self._fallback_exercises()
        }
        dynamo_by_id = {
            exercise.exercise_id: exercise
            for exercise in self._load_from_dynamo()
        }
        return list({**legacy_by_id, **dynamo_by_id}.values())

    def _load_from_dynamo(self) -> List[CanonicalExercise]:
        if not self.dynamo:
            return []

        try:
            items = self.dynamo.scan_all()
            return [CanonicalExercise.from_record(item) for item in items]
        except Exception as exc:
            logger.warning(f'Unable to load exercises from DynamoDB, falling back to legacy exercises: {exc}')
            return []

    @staticmethod
    def _fallback_exercises() -> List[CanonicalExercise]:
        return build_seed_exercises()
