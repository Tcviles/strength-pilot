from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend/layers/common/python'))
sys.path.insert(0, str(ROOT / 'backend/src'))

from common.domain.canonical_exercises import CanonicalExercise  # noqa: E402
from common.domain.programming import can_use_exercise, find_swap, select_split  # noqa: E402


class ProgrammingTests(unittest.TestCase):
    def test_select_split_honors_full_body_preference_for_all_days(self):
        split = select_split(5, split_preference='full_body', goal='strength')
        self.assertEqual(split, ['full_body'] * 5)

    def test_select_split_uses_goal_sensitive_four_day_split(self):
        strength_split = select_split(4, split_preference='split', goal='strength')
        hypertrophy_split = select_split(4, split_preference='split', goal='hypertrophy')

        self.assertEqual(strength_split, ['upper', 'lower', 'upper', 'lower'])
        self.assertEqual(hypertrophy_split, ['chest_tri', 'back_bi', 'legs', 'shoulders_arms'])

    def test_can_use_exercise_allows_bodyweight_without_gym_flags(self):
        exercise = CanonicalExercise.from_record({
            'exerciseId': 'push_up',
            'name': 'Push-Up',
            'primaryMuscles': ['chest'],
            'equipment': ['bodyweight'],
            'minLevel': 'beginner',
        })

        self.assertTrue(can_use_exercise(exercise, gym_equipment={}, experience='beginner'))

    def test_find_swap_prefers_substitute_with_different_equipment_when_unavailable(self):
        current = CanonicalExercise.from_record({
            'exerciseId': 'lat_pulldown',
            'name': 'Lat Pulldown',
            'primaryMuscles': ['lats'],
            'equipment': ['cable', 'machine'],
            'pattern': 'vertical_pull',
            'alternatives': ['pull_up'],
            'minLevel': 'beginner',
        })
        alternative = CanonicalExercise.from_record({
            'exerciseId': 'pull_up',
            'name': 'Pull-Up',
            'primaryMuscles': ['lats'],
            'equipment': ['bodyweight'],
            'pattern': 'vertical_pull',
            'minLevel': 'beginner',
        })

        result = find_swap(
            current_exercise_id='lat_pulldown',
            reason='unavailable',
            gym_equipment={},
            experience='beginner',
            exercises=[current, alternative],
            exercise_by_id={
                current.exercise_id: current,
                alternative.exercise_id: alternative,
            },
        )

        self.assertIsNotNone(result)
        self.assertEqual(result.exercise_id, 'pull_up')


if __name__ == '__main__':
    unittest.main()
