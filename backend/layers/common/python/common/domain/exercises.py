from dataclasses import dataclass, field, asdict
from typing import List, Optional


@dataclass
class Exercise:
    id: str
    name: str
    primary: str                  # muscle group
    secondary: List[str]
    compound: bool
    pattern: str                  # horizontal_push, vertical_pull, squat, etc.
    equipment: List[str]          # barbell, dumbbell, cable, machine, smith, bodyweight, bench, pull_up_bar, kettlebell, resistance_band
    fatigue: str                  # low, medium, high
    min_level: str                # beginner, intermediate, advanced
    placement: str                # opener, mid, finisher, any
    substitutes: List[str]
    form_cues: List[str] = field(default_factory=list)

    def to_dict(self):
        return asdict(self)


EXERCISES: List[Exercise] = [
    # ---- Chest ----
    Exercise('bb_bench_press', 'Barbell Bench Press', 'chest', ['triceps', 'shoulders'], True, 'horizontal_push',
             ['barbell', 'bench'], 'high', 'beginner', 'opener',
             ['db_bench_press', 'machine_chest_press', 'smith_bench_press'],
             ['Retract scapula', 'Feet planted', 'Bar to mid-chest']),
    Exercise('db_bench_press', 'Dumbbell Bench Press', 'chest', ['triceps', 'shoulders'], True, 'horizontal_push',
             ['dumbbell', 'bench'], 'high', 'beginner', 'opener',
             ['bb_bench_press', 'machine_chest_press']),
    Exercise('incline_db_press', 'Incline Dumbbell Press', 'chest', ['shoulders', 'triceps'], True, 'horizontal_push',
             ['dumbbell', 'bench'], 'high', 'beginner', 'opener',
             ['incline_bb_press', 'machine_chest_press']),
    Exercise('machine_chest_press', 'Machine Chest Press', 'chest', ['triceps'], True, 'horizontal_push',
             ['machine'], 'medium', 'beginner', 'mid',
             ['db_bench_press', 'bb_bench_press']),
    Exercise('cable_fly', 'Cable Chest Fly', 'chest', [], False, 'isolation',
             ['cable'], 'low', 'beginner', 'finisher',
             ['pec_deck', 'db_fly']),
    Exercise('push_up', 'Push-Up', 'chest', ['triceps', 'shoulders', 'core'], True, 'horizontal_push',
             ['bodyweight'], 'medium', 'beginner', 'any',
             ['db_bench_press', 'machine_chest_press']),

    # ---- Back / Lats ----
    Exercise('deadlift', 'Barbell Deadlift', 'back', ['hamstrings', 'glutes', 'forearms'], True, 'hinge',
             ['barbell'], 'high', 'intermediate', 'opener',
             ['trap_bar_deadlift', 'rdl'],
             ['Neutral spine', 'Bar close to shins', 'Drive through heels']),
    Exercise('pull_up', 'Pull-Up', 'lats', ['biceps', 'back'], True, 'vertical_pull',
             ['pull_up_bar', 'bodyweight'], 'high', 'intermediate', 'opener',
             ['lat_pulldown', 'assisted_pull_up']),
    Exercise('lat_pulldown', 'Lat Pulldown', 'lats', ['biceps', 'back'], True, 'vertical_pull',
             ['cable', 'machine'], 'medium', 'beginner', 'mid',
             ['pull_up', 'assisted_pull_up']),
    Exercise('barbell_row', 'Barbell Row', 'back', ['lats', 'biceps'], True, 'horizontal_pull',
             ['barbell'], 'high', 'intermediate', 'opener',
             ['db_row', 'seated_cable_row', 'chest_supported_row']),
    Exercise('db_row', 'Dumbbell Row', 'back', ['lats', 'biceps'], True, 'horizontal_pull',
             ['dumbbell', 'bench'], 'medium', 'beginner', 'mid',
             ['barbell_row', 'seated_cable_row']),
    Exercise('seated_cable_row', 'Seated Cable Row', 'back', ['lats', 'biceps'], True, 'horizontal_pull',
             ['cable'], 'medium', 'beginner', 'mid',
             ['db_row', 'chest_supported_row']),
    Exercise('face_pull', 'Face Pull', 'shoulders', ['back'], False, 'isolation',
             ['cable'], 'low', 'beginner', 'finisher',
             ['rear_delt_fly']),

    # ---- Shoulders ----
    Exercise('ohp', 'Overhead Press', 'shoulders', ['triceps', 'core'], True, 'vertical_push',
             ['barbell'], 'high', 'intermediate', 'opener',
             ['db_shoulder_press', 'machine_shoulder_press']),
    Exercise('db_shoulder_press', 'Dumbbell Shoulder Press', 'shoulders', ['triceps'], True, 'vertical_push',
             ['dumbbell', 'bench'], 'high', 'beginner', 'opener',
             ['ohp', 'machine_shoulder_press', 'arnold_press']),
    Exercise('lateral_raise', 'Dumbbell Lateral Raise', 'shoulders', [], False, 'isolation',
             ['dumbbell'], 'low', 'beginner', 'mid',
             ['cable_lateral_raise', 'machine_lateral_raise']),
    Exercise('rear_delt_fly', 'Rear Delt Fly', 'shoulders', ['back'], False, 'isolation',
             ['dumbbell', 'machine'], 'low', 'beginner', 'finisher',
             ['face_pull']),

    # ---- Arms ----
    Exercise('bb_curl', 'Barbell Curl', 'biceps', ['forearms'], False, 'isolation',
             ['barbell'], 'low', 'beginner', 'mid',
             ['db_curl', 'cable_curl', 'ez_bar_curl']),
    Exercise('db_curl', 'Dumbbell Curl', 'biceps', ['forearms'], False, 'isolation',
             ['dumbbell'], 'low', 'beginner', 'mid',
             ['bb_curl', 'cable_curl', 'hammer_curl']),
    Exercise('hammer_curl', 'Hammer Curl', 'biceps', ['forearms'], False, 'isolation',
             ['dumbbell'], 'low', 'beginner', 'finisher',
             ['db_curl', 'cable_hammer_curl']),
    Exercise('tricep_pushdown', 'Cable Tricep Pushdown', 'triceps', [], False, 'isolation',
             ['cable'], 'low', 'beginner', 'mid',
             ['skull_crusher', 'overhead_tricep_ext']),
    Exercise('overhead_tricep_ext', 'Overhead Tricep Extension', 'triceps', [], False, 'isolation',
             ['dumbbell', 'cable'], 'low', 'beginner', 'finisher',
             ['tricep_pushdown', 'skull_crusher']),
    Exercise('close_grip_bench', 'Close-Grip Bench Press', 'triceps', ['chest', 'shoulders'], True, 'horizontal_push',
             ['barbell', 'bench'], 'medium', 'intermediate', 'opener',
             ['dip', 'tricep_pushdown']),

    # ---- Legs ----
    Exercise('back_squat', 'Barbell Back Squat', 'quads', ['glutes', 'hamstrings', 'core'], True, 'squat',
             ['barbell'], 'high', 'beginner', 'opener',
             ['front_squat', 'leg_press', 'hack_squat', 'smith_squat'],
             ['Brace core', 'Break at hips and knees together', 'Knees track toes']),
    Exercise('front_squat', 'Barbell Front Squat', 'quads', ['glutes', 'core'], True, 'squat',
             ['barbell'], 'high', 'intermediate', 'opener',
             ['back_squat', 'goblet_squat', 'hack_squat']),
    Exercise('leg_press', 'Leg Press', 'quads', ['glutes', 'hamstrings'], True, 'squat',
             ['machine'], 'high', 'beginner', 'mid',
             ['back_squat', 'hack_squat']),
    Exercise('hack_squat', 'Hack Squat', 'quads', ['glutes'], True, 'squat',
             ['machine'], 'high', 'beginner', 'mid',
             ['leg_press', 'back_squat']),
    Exercise('bulgarian_split_squat', 'Bulgarian Split Squat', 'quads', ['glutes', 'hamstrings'], True, 'lunge',
             ['dumbbell', 'bench'], 'high', 'intermediate', 'mid',
             ['walking_lunge', 'step_up']),
    Exercise('rdl', 'Romanian Deadlift', 'hamstrings', ['glutes', 'back'], True, 'hinge',
             ['barbell', 'dumbbell'], 'high', 'beginner', 'opener',
             ['deadlift', 'good_morning', 'leg_curl']),
    Exercise('leg_curl', 'Lying/Seated Leg Curl', 'hamstrings', [], False, 'isolation',
             ['machine'], 'low', 'beginner', 'mid',
             ['rdl', 'nordic_curl']),
    Exercise('hip_thrust', 'Barbell Hip Thrust', 'glutes', ['hamstrings'], True, 'hinge',
             ['barbell', 'bench'], 'medium', 'beginner', 'mid',
             ['glute_bridge', 'cable_kickback']),
    Exercise('standing_calf_raise', 'Standing Calf Raise', 'calves', [], False, 'isolation',
             ['machine', 'dumbbell'], 'low', 'beginner', 'finisher',
             ['seated_calf_raise']),
    Exercise('seated_calf_raise', 'Seated Calf Raise', 'calves', [], False, 'isolation',
             ['machine'], 'low', 'beginner', 'finisher',
             ['standing_calf_raise']),

    # ---- Core ----
    Exercise('plank', 'Plank', 'core', [], False, 'core',
             ['bodyweight'], 'low', 'beginner', 'finisher',
             ['dead_bug', 'ab_wheel']),
    Exercise('hanging_leg_raise', 'Hanging Leg Raise', 'core', [], False, 'core',
             ['pull_up_bar'], 'medium', 'intermediate', 'finisher',
             ['cable_crunch', 'ab_wheel']),
    Exercise('cable_crunch', 'Cable Crunch', 'core', [], False, 'core',
             ['cable'], 'low', 'beginner', 'finisher',
             ['hanging_leg_raise', 'ab_wheel']),
]


EXERCISE_BY_ID = {e.id: e for e in EXERCISES}


def exercises_by_muscle(muscle: str) -> List[Exercise]:
    return [e for e in EXERCISES if e.primary == muscle]


def get_exercise(exercise_id: str) -> Optional[Exercise]:
    return EXERCISE_BY_ID.get(exercise_id)
