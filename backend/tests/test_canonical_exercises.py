from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend/layers/common/python'))
sys.path.insert(0, str(ROOT / 'backend/src'))

from common.domain.canonical_exercises import build_canonical_exercise  # noqa: E402


class CanonicalExerciseTests(unittest.TestCase):
    def test_build_canonical_exercise_applies_sensible_defaults(self):
        exercise = build_canonical_exercise({
            'exerciseId': 'test_move',
        })

        self.assertEqual(exercise.exercise_id, 'test_move')
        self.assertEqual(exercise.name, 'Test Move')
        self.assertEqual(exercise.primary_muscles, ['general'])
        self.assertEqual(exercise.equipment, ['machine'])
        self.assertEqual(exercise.attachments, [])
        self.assertEqual(exercise.strategy_tags, ['isolation', 'accessory'])

    def test_build_canonical_exercise_normalizes_lists_and_tags(self):
        exercise = build_canonical_exercise({
            'exerciseId': 'neutral_grip_pulldown',
            'name': 'Neutral Grip Pulldown',
            'aliases': ['Neutral Grip Pulldown', 'MAG Pulldown'],
            'primaryMuscles': ['Lats'],
            'secondaryMuscles': ['Biceps', 'Rear Delts'],
            'compound': True,
            'pattern': 'vertical_pull',
            'equipment': ['Cable', 'Machine'],
            'fatigue': 'Medium',
            'minLevel': 'Intermediate',
            'placement': 'Mid',
            'alternatives': ['lat_pulldown'],
            'attachments': ['Neutral Grip', 'MAG Grip'],
            'formCues': ['Pull elbows to your pockets'],
            'tips': ['Stay tall and avoid rocking'],
            'strategyTags': ['Compound', 'Accessory'],
        })

        self.assertEqual(exercise.primary_muscles, ['lats'])
        self.assertEqual(exercise.secondary_muscles, ['biceps', 'rear delts'])
        self.assertEqual(exercise.equipment, ['cable', 'machine'])
        self.assertEqual(exercise.attachments, ['neutral_grip', 'mag_grip'])
        self.assertEqual(exercise.strategy_tags, ['compound', 'accessory'])

    def test_to_record_uses_canonical_api_shape(self):
        exercise = build_canonical_exercise({
            'exerciseId': 'rope_pushdown',
            'name': 'Rope Pushdown',
            'primaryMuscles': ['triceps'],
            'equipment': ['cable'],
            'attachments': ['rope'],
        })

        record = exercise.to_record()

        self.assertEqual(record['exerciseId'], 'rope_pushdown')
        self.assertEqual(record['name'], 'Rope Pushdown')
        self.assertEqual(record['attachments'], ['rope'])
        self.assertIn('primaryMuscles', record)
        self.assertNotIn('baseWeight', record)


if __name__ == '__main__':
    unittest.main()
