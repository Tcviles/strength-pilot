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

import exercise.add_exercise as add_exercise  # noqa: E402


def build_event(body=None, email='owner@example.com'):
    return {
        'body': json.dumps(body or {}),
        'requestContext': {
            'authorizer': {
                'jwt': {
                    'claims': {
                        'email': email,
                    },
                },
            },
        },
    }


class AddExerciseHandlerTests(unittest.TestCase):
    def test_allows_guest_requests_during_beta_mode(self):
        with patch.object(add_exercise, '_call_openai', return_value={
            'name': 'Pec Deck',
            'aliases': ['pec deck'],
            'primaryMuscles': ['chest'],
            'secondaryMuscles': ['front_delts'],
            'compound': False,
            'pattern': 'isolation',
            'equipment': ['machine'],
            'fatigue': 'medium',
            'minLevel': 'beginner',
            'placement': 'mid',
            'alternatives': ['cable_fly'],
            'attachments': [],
            'formCues': ['Control the stretch'],
            'tips': ['Squeeze at the peak'],
            'strategyTags': ['isolation', 'accessory'],
        }):
            with patch.object(add_exercise.exercise_library, 'upsert_exercise', side_effect=lambda record: add_exercise.CanonicalExercise.from_record(record)):
                event = build_event({'name': 'Pec Deck', 'equipment': 'machine'}, email='')
                response = add_exercise.lambda_handler(event, None)

        self.assertEqual(response['statusCode'], 201)

    def test_rejects_signed_in_non_admin_when_admin_list_is_set(self):
        event = build_event({'name': 'Pec Deck', 'equipment': 'machine'}, email='')
        with patch.dict('os.environ', {'EXERCISE_ADMIN_EMAILS': 'owner@example.com'}, clear=False):
            event = build_event({'name': 'Pec Deck', 'equipment': 'machine'}, email='not-owner@example.com')

            response = add_exercise.lambda_handler(event, None)

        self.assertEqual(response['statusCode'], 401)

    def test_rejects_invalid_equipment(self):
        event = build_event({'name': 'Pec Deck', 'equipment': 'spaceship'})

        response = add_exercise.lambda_handler(event, None)

        self.assertEqual(response['statusCode'], 400)
        self.assertIn('Invalid equipment type', response['body'])

    @patch.dict('os.environ', {'EXERCISE_ADMIN_EMAILS': 'owner@example.com'}, clear=False)
    @patch.object(add_exercise, '_call_openai')
    def test_add_exercise_upserts_canonical_record_with_attachment(self, mock_call_openai):
        mock_call_openai.return_value = {
            'name': 'Neutral Grip Pulldown',
            'aliases': ['neutral grip pulldown'],
            'primaryMuscles': ['lats'],
            'secondaryMuscles': ['biceps'],
            'compound': True,
            'pattern': 'vertical_pull',
            'equipment': ['cable'],
            'fatigue': 'medium',
            'minLevel': 'beginner',
            'placement': 'mid',
            'alternatives': ['lat_pulldown'],
            'attachments': ['neutral_grip'],
            'formCues': ['Drive elbows down'],
            'tips': ['Stay tall'],
            'strategyTags': ['compound', 'accessory'],
        }

        captured = []

        def fake_upsert(record):
            captured.append(record)
            return add_exercise.CanonicalExercise.from_record(record)

        event = build_event({
            'name': 'Neutral Grip Pulldown',
            'equipment': 'cable',
            'attachment': 'neutral_grip',
        })

        with patch.object(add_exercise.exercise_library, 'upsert_exercise', side_effect=fake_upsert):
            response = add_exercise.lambda_handler(event, None)

        created_record = captured[0]
        self.assertEqual(response['statusCode'], 201)
        self.assertEqual(created_record['exerciseId'], 'neutral_grip_pulldown')
        self.assertEqual(created_record['attachments'], ['neutral_grip'])
        self.assertEqual(created_record['equipment'][0], 'cable')

    def test_normalizes_generated_record_for_display_name_and_common_muscles(self):
        normalized = add_exercise._normalize_generated_record(
            {
                'name': 'pec_fly',
                'aliases': ['chest_fly'],
                'primaryMuscles': ['pectoralis_major'],
                'secondaryMuscles': ['anterior_deltoid', 'triceps_brachii'],
                'compound': False,
                'pattern': 'isolation',
                'equipment': ['machine'],
                'fatigue': 'medium',
                'minLevel': 'beginner',
                'placement': 'mid',
                'alternatives': [],
                'attachments': [],
                'formCues': ['squeeze your shoulder blades together'],
                'tips': ['start with a light weight to master form'],
                'strategyTags': ['isolation_exercise'],
            },
            requested_name='Pec Fly',
            selected_equipment='machine',
            notes='pec deck / chest fly machine',
        )

        self.assertEqual(normalized['name'], 'Pec Fly')
        self.assertEqual(normalized['primaryMuscles'], ['chest'])
        self.assertEqual(normalized['secondaryMuscles'], ['front_delts', 'triceps'])
        self.assertEqual(normalized['tips'], ['Start with a light weight to master form.'])
        self.assertEqual(normalized['attachments'], [])


if __name__ == '__main__':
    unittest.main()
