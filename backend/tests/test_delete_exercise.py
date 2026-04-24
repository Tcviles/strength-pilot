from pathlib import Path
import json
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import patch


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

import exercise.delete_exercise as delete_exercise  # noqa: E402


def build_event(exercise_id='pec_fly'):
    return {
        'pathParameters': {
            'exerciseId': exercise_id,
        },
    }


class DeleteExerciseHandlerTests(unittest.TestCase):
    def test_returns_not_found_when_record_is_missing(self):
        with patch.object(delete_exercise.exercise_library, 'delete_exercise', return_value=False):
            response = delete_exercise.lambda_handler(build_event(), None)

        self.assertEqual(response['statusCode'], 404)
        self.assertIn('Exercise not found', response['body'])

    def test_deletes_existing_exercise(self):
        with patch.object(delete_exercise.exercise_library, 'delete_exercise', return_value=True):
            response = delete_exercise.lambda_handler(build_event('pec_fly'), None)

        self.assertEqual(response['statusCode'], 200)
        self.assertEqual(json.loads(response['body'])['message'], 'Exercise deleted.')


if __name__ == '__main__':
    unittest.main()
