from pathlib import Path
import sys
import unittest
from unittest.mock import patch
from types import SimpleNamespace


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend/layers/common/python'))
sys.path.insert(0, str(ROOT / 'backend/src'))


class _FakeBoto3Table:
    def get_item(self, **kwargs):
        return {}

    def put_item(self, **kwargs):
        return {}

    def query(self, **kwargs):
        return {}

    def scan(self, **kwargs):
        return {'Items': []}

    def update_item(self, **kwargs):
        return {}

    def delete_item(self, **kwargs):
        return {}


class _FakeBoto3Resource:
    def Table(self, _name):
        return _FakeBoto3Table()


sys.modules.setdefault(
    'boto3',
    SimpleNamespace(
        client=lambda *_args, **_kwargs: SimpleNamespace(get_paginator=lambda *_a, **_k: object()),
        resource=lambda *_args, **_kwargs: _FakeBoto3Resource(),
    ),
)

from common.domain.canonical_exercises import CanonicalExercise  # noqa: E402
from common.services.exercise_library import ExerciseLibraryService  # noqa: E402


class FakeDynamo:
    def __init__(self):
        self.items = []
        self.deleted_keys = []
        self.put_calls = []

    def put_item(self, item):
        self.put_calls.append(item)
        exercise_id = item['exerciseId']
        self.items = [existing for existing in self.items if existing['exerciseId'] != exercise_id]
        self.items.append(item)
        return {'ResponseMetadata': {'HTTPStatusCode': 200}}

    def get_item(self, key):
        exercise_id = key['exerciseId']
        return next((item for item in self.items if item['exerciseId'] == exercise_id), None)

    def delete_item(self, key):
        exercise_id = key['exerciseId']
        self.deleted_keys.append(key)
        self.items = [item for item in self.items if item['exerciseId'] != exercise_id]
        return {'ResponseMetadata': {'HTTPStatusCode': 200}}

    def scan_all(self):
        return list(self.items)


class ExerciseLibraryServiceTests(unittest.TestCase):
    def test_dynamo_records_overlay_legacy_records_by_id(self):
        service = ExerciseLibraryService(table_name='test-exercises')

        legacy = [
            CanonicalExercise.from_record({
                'exerciseId': 'machine_chest_press',
                'name': 'Machine Chest Press',
                'primaryMuscles': ['chest'],
                'equipment': ['machine'],
            }),
            CanonicalExercise.from_record({
                'exerciseId': 'lat_pulldown',
                'name': 'Lat Pulldown',
                'primaryMuscles': ['lats'],
                'equipment': ['cable'],
            }),
        ]
        dynamo = [
            CanonicalExercise.from_record({
                'exerciseId': 'machine_chest_press',
                'name': 'Selectorized Chest Press',
                'primaryMuscles': ['chest'],
                'equipment': ['machine'],
                'attachments': ['neutral_grip'],
            }),
        ]

        with patch.object(service, '_fallback_exercises', return_value=legacy), patch.object(
            service,
            '_load_from_dynamo',
            return_value=dynamo,
        ):
            exercises = service.list_exercises(force_refresh=True)

        by_id = {exercise.exercise_id: exercise for exercise in exercises}
        self.assertEqual(by_id['machine_chest_press'].name, 'Selectorized Chest Press')
        self.assertEqual(by_id['machine_chest_press'].attachments, ['neutral_grip'])
        self.assertIn('lat_pulldown', by_id)

    def test_upsert_exercise_validates_and_clears_cache(self):
        service = ExerciseLibraryService(table_name='test-exercises')
        service.dynamo = FakeDynamo()
        service._cache['test-exercises:merged'] = {'loadedAt': 0, 'exercises': []}
        service._cache['test-exercises:dynamo'] = {'loadedAt': 0, 'exercises': []}

        saved = service.upsert_exercise({
            'exerciseId': 'rope_pushdown',
            'name': 'Rope Pushdown',
            'primaryMuscles': ['triceps'],
            'equipment': ['cable'],
            'attachments': ['rope'],
        })

        self.assertEqual(saved.exercise_id, 'rope_pushdown')
        self.assertEqual(service.dynamo.items[0]['attachments'], ['rope'])
        self.assertNotIn('test-exercises:merged', service._cache)
        self.assertNotIn('test-exercises:dynamo', service._cache)

    def test_delete_exercise_removes_dynamo_record_and_clears_cache(self):
        service = ExerciseLibraryService(table_name='test-exercises')
        service.dynamo = FakeDynamo()
        service.dynamo.items = [
            {
                'exerciseId': 'pec_fly',
                'name': 'Pec Fly',
                'primaryMuscles': ['chest'],
                'equipment': ['machine'],
                'alternatives': [],
            },
            {
                'exerciseId': 'pec_deck',
                'name': 'Pec Deck',
                'primaryMuscles': ['chest'],
                'equipment': ['machine'],
                'alternatives': ['pec_fly', 'db_fly'],
            },
        ]
        service._cache['test-exercises:merged'] = {'loadedAt': 0, 'exercises': []}
        service._cache['test-exercises:dynamo'] = {'loadedAt': 0, 'exercises': []}

        deleted = service.delete_exercise('pec_fly')

        self.assertTrue(deleted)
        self.assertEqual(service.dynamo.deleted_keys, [{'exerciseId': 'pec_fly'}])
        self.assertEqual(
            service.dynamo.put_calls[0]['alternatives'],
            ['db_fly'],
        )
        self.assertEqual(
            service.dynamo.items,
            [{
                'exerciseId': 'pec_deck',
                'name': 'Pec Deck',
                'familyId': 'pec_deck',
                'familyName': 'Pec Deck',
                'variantLabel': '',
                'aliases': [],
                'primaryMuscles': ['chest'],
                'secondaryMuscles': [],
                'compound': False,
                'pattern': 'isolation',
                'equipment': ['machine'],
                'fatigue': 'medium',
                'minLevel': 'beginner',
                'placement': 'mid',
                'alternatives': ['db_fly'],
                'attachments': [],
                'formCues': [],
                'tips': [],
                'strategyTags': ['isolation', 'accessory'],
            }],
        )
        self.assertNotIn('test-exercises:merged', service._cache)
        self.assertNotIn('test-exercises:dynamo', service._cache)

    def test_get_exercise_can_read_dynamo_only(self):
        service = ExerciseLibraryService(table_name='test-exercises')
        service.dynamo = FakeDynamo()
        service.dynamo.items = [{
            'exerciseId': 'pec_fly',
            'name': 'Pec Fly',
            'primaryMuscles': ['chest'],
            'equipment': ['machine'],
        }]

        exercise = service.get_exercise('pec_fly', dynamo_only=True)

        self.assertIsNotNone(exercise)
        self.assertEqual(exercise.exercise_id, 'pec_fly')


if __name__ == '__main__':
    unittest.main()
