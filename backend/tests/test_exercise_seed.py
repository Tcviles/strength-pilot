from pathlib import Path
import sys
import unittest
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

from common.domain.exercise_seed import build_seed_exercises  # noqa: E402


class ExerciseSeedTests(unittest.TestCase):
    def test_seed_contains_clean_pec_fly_and_related_alternatives(self):
        exercises = {exercise.exercise_id: exercise for exercise in build_seed_exercises()}

        self.assertIn('pec_fly', exercises)
        self.assertIn('pec_deck', exercises)
        self.assertIn('pec_fly_machine', exercises)
        self.assertEqual(exercises['pec_fly'].name, 'Pec Fly')
        self.assertEqual(exercises['pec_fly'].primary_muscles, ['chest'])
        self.assertIn('pec_deck', exercises['pec_fly'].alternatives)

    def test_every_seeded_exercise_has_tips(self):
        exercises = build_seed_exercises()

        missing = [exercise.exercise_id for exercise in exercises if len(exercise.tips) < 2]
        self.assertEqual(missing, [])


if __name__ == '__main__':
    unittest.main()
