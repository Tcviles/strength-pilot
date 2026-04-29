from typing import List

from common.domain.canonical_exercises import CanonicalExercise
from common.domain.exercises import EXERCISES as LEGACY_EXERCISES, Exercise as LegacyExercise


PRIMARY_MUSCLE_OVERRIDES = {
    'pull_up': 'lats',
    'lat_pulldown': 'lats',
    'barbell_row': 'upper_back',
    'db_row': 'upper_back',
    'seated_cable_row': 'upper_back',
    'face_pull': 'rear_delts',
    'ohp': 'front_delts',
    'db_shoulder_press': 'front_delts',
    'lateral_raise': 'side_delts',
    'rear_delt_fly': 'rear_delts',
}

SECONDARY_MUSCLE_OVERRIDES = {
    'pull_up': ['biceps', 'upper_back'],
    'lat_pulldown': ['biceps', 'upper_back'],
    'barbell_row': ['lats', 'biceps'],
    'db_row': ['lats', 'biceps'],
    'seated_cable_row': ['lats', 'biceps'],
    'face_pull': ['upper_back'],
    'ohp': ['triceps', 'side_delts', 'core'],
    'db_shoulder_press': ['triceps', 'side_delts'],
    'lateral_raise': [],
    'rear_delt_fly': ['upper_back'],
}

FAMILY_METADATA_OVERRIDES = {
    'bb_bench_press': {'familyId': 'bench_press', 'familyName': 'Bench Press', 'variantLabel': 'Barbell'},
    'db_bench_press': {'familyId': 'bench_press', 'familyName': 'Bench Press', 'variantLabel': 'Dumbbell'},
    'smith_bench_press': {'familyId': 'bench_press', 'familyName': 'Bench Press', 'variantLabel': 'Smith'},
    'incline_bb_press': {'familyId': 'incline_press', 'familyName': 'Incline Press', 'variantLabel': 'Barbell'},
    'incline_db_press': {'familyId': 'incline_press', 'familyName': 'Incline Press', 'variantLabel': 'Dumbbell'},
    'pec_fly': {'familyId': 'chest_fly', 'familyName': 'Chest Fly', 'variantLabel': 'Machine'},
    'pec_deck': {'familyId': 'chest_fly', 'familyName': 'Chest Fly', 'variantLabel': 'Pec Deck'},
    'pec_fly_machine': {'familyId': 'chest_fly', 'familyName': 'Chest Fly', 'variantLabel': 'Machine'},
    'db_fly': {'familyId': 'chest_fly', 'familyName': 'Chest Fly', 'variantLabel': 'Dumbbell'},
    'cable_fly': {'familyId': 'chest_fly', 'familyName': 'Chest Fly', 'variantLabel': 'Cable'},
    'ohp': {'familyId': 'shoulder_press', 'familyName': 'Shoulder Press', 'variantLabel': 'Barbell'},
    'db_shoulder_press': {'familyId': 'shoulder_press', 'familyName': 'Shoulder Press', 'variantLabel': 'Dumbbell'},
    'machine_shoulder_press': {'familyId': 'shoulder_press', 'familyName': 'Shoulder Press', 'variantLabel': 'Machine'},
    'lateral_raise': {'familyId': 'lateral_raise', 'familyName': 'Lateral Raise', 'variantLabel': 'Dumbbell'},
    'cable_lateral_raise': {'familyId': 'lateral_raise', 'familyName': 'Lateral Raise', 'variantLabel': 'Cable'},
    'machine_lateral_raise': {'familyId': 'lateral_raise', 'familyName': 'Lateral Raise', 'variantLabel': 'Machine'},
    'bb_curl': {'familyId': 'curl', 'familyName': 'Curl', 'variantLabel': 'Barbell'},
    'db_curl': {'familyId': 'curl', 'familyName': 'Curl', 'variantLabel': 'Dumbbell'},
    'cable_curl': {'familyId': 'curl', 'familyName': 'Curl', 'variantLabel': 'Cable'},
    'ez_bar_curl': {'familyId': 'curl', 'familyName': 'Curl', 'variantLabel': 'EZ-Bar'},
    'hammer_curl': {'familyId': 'hammer_curl', 'familyName': 'Hammer Curl', 'variantLabel': 'Dumbbell'},
    'cable_hammer_curl': {'familyId': 'hammer_curl', 'familyName': 'Hammer Curl', 'variantLabel': 'Cable'},
    'standing_calf_raise': {'familyId': 'calf_raise', 'familyName': 'Calf Raise', 'variantLabel': 'Standing'},
    'seated_calf_raise': {'familyId': 'calf_raise', 'familyName': 'Calf Raise', 'variantLabel': 'Seated'},
    'pull_up': {'familyId': 'pull_up', 'familyName': 'Pull-Up', 'variantLabel': 'Bodyweight'},
    'assisted_pull_up': {'familyId': 'pull_up', 'familyName': 'Pull-Up', 'variantLabel': 'Assisted'},
}

PRIMARY_DISPLAY_NAMES = {
    'chest': 'chest',
    'lats': 'lats',
    'upper_back': 'upper back',
    'lower_back': 'lower back',
    'back': 'back',
    'front_delts': 'front delts',
    'side_delts': 'side delts',
    'rear_delts': 'rear delts',
    'shoulders': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'forearms': 'forearms',
    'quads': 'quads',
    'hamstrings': 'hamstrings',
    'glutes': 'glutes',
    'calves': 'calves',
    'core': 'core',
    'abs': 'abs',
    'obliques': 'obliques',
}

PATTERN_TIPS = {
    'horizontal_push': [
        'Keep the ribcage tall and press through a stable upper back.',
        'Lower under control and drive the handles or bar back to the start.',
    ],
    'vertical_push': [
        'Brace the torso before each rep so the press stays stacked.',
        'Finish with the biceps close to the ears without overextending the low back.',
    ],
    'horizontal_pull': [
        'Initiate the pull by moving the shoulder blades, then drive the elbows back.',
        'Pause briefly at the torso and control the return.',
    ],
    'vertical_pull': [
        'Think about pulling the elbows toward the ribs instead of yanking with the hands.',
        'Stay tall through the chest and avoid swinging into the rep.',
    ],
    'squat': [
        'Stay balanced through the whole foot and keep the knees tracking over the toes.',
        'Brace before the descent and stand up with the chest and hips rising together.',
    ],
    'hinge': [
        'Push the hips back first and keep the weight close to the body.',
        'Keep the spine long and finish by squeezing the glutes, not by leaning back.',
    ],
    'lunge': [
        'Take a controlled step and keep pressure through the front foot.',
        'Use a full range of motion without bouncing out of the bottom.',
    ],
    'core': [
        'Exhale hard to lock the ribs down and keep the trunk braced.',
        'Move slowly enough that the abs stay loaded for the entire rep.',
    ],
    'isolation': [
        'Keep the target muscle under tension instead of chasing momentum.',
        'Use a tempo you can control from the stretch to the squeeze.',
    ],
}

EQUIPMENT_TIPS = {
    'machine': 'Set the seat or pad so the joint lines up with the machine pivot before loading it up.',
    'cable': 'Use the cable path to keep constant tension and avoid letting the stack slam between reps.',
    'barbell': 'Set up the same way every set so bar path and leverage stay consistent.',
    'dumbbell': 'Match both sides and keep the bells moving through the same path each rep.',
    'smith': 'Set your stance and bench position first so the fixed path works for your body.',
    'bodyweight': 'Own the full range of motion before adding speed or extra difficulty.',
}


def _unique_preserving_order(values: List[str]) -> List[str]:
    seen = set()
    unique: List[str] = []
    for value in values:
        cleaned = value.strip()
        if not cleaned:
            continue
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(cleaned)
    return unique


def _primary_display_name(primary_muscle: str) -> str:
    return PRIMARY_DISPLAY_NAMES.get(primary_muscle, primary_muscle.replace('_', ' '))


def _generated_tips(exercise: CanonicalExercise) -> List[str]:
    primary_display = _primary_display_name(exercise.primary)
    pattern_tips = PATTERN_TIPS.get(exercise.pattern, PATTERN_TIPS['isolation'])

    equipment_tip = None
    for equipment in exercise.equipment:
        equipment_tip = EQUIPMENT_TIPS.get(equipment)
        if equipment_tip:
            break

    specificity_tip = (
        f"Keep the tension where you want it by feeling the {primary_display} work on every rep."
    )

    generated = [specificity_tip, *pattern_tips]
    if equipment_tip:
        generated.append(equipment_tip)

    return _unique_preserving_order(generated)[:3]


def _enrich_seed_exercise(exercise: CanonicalExercise) -> CanonicalExercise:
    tips = _unique_preserving_order(list(exercise.tips))
    if len(tips) < 2:
        tips = _unique_preserving_order([*tips, *_generated_tips(exercise)])

    form_cues = _unique_preserving_order(list(exercise.form_cues))
    return CanonicalExercise.from_record({
        **exercise.to_record(),
        'formCues': form_cues,
        'tips': tips[:3],
    })


def _legacy_to_canonical(exercise: LegacyExercise) -> CanonicalExercise:
    return CanonicalExercise.from_record({
        'exerciseId': exercise.id,
        'name': exercise.name,
        **FAMILY_METADATA_OVERRIDES.get(exercise.id, {}),
        'aliases': [exercise.name.lower()],
        'primaryMuscles': [PRIMARY_MUSCLE_OVERRIDES.get(exercise.id, exercise.primary)],
        'secondaryMuscles': SECONDARY_MUSCLE_OVERRIDES.get(exercise.id, exercise.secondary),
        'compound': exercise.compound,
        'pattern': exercise.pattern,
        'equipment': exercise.equipment,
        'fatigue': exercise.fatigue,
        'minLevel': exercise.min_level,
        'placement': exercise.placement,
        'alternatives': exercise.substitutes,
        'formCues': exercise.form_cues,
        'tips': exercise.form_cues,
    })


SUPPLEMENTAL_EXERCISES = [
    {
        'exerciseId': 'pec_fly',
        'name': 'Pec Fly',
        'aliases': ['machine chest fly', 'pec fly machine', 'chest fly'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['front_delts'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['machine'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['pec_deck', 'cable_fly', 'db_fly'],
        'formCues': [
            'Keep a soft bend in the elbows.',
            'Stretch the chest without losing shoulder position.',
            'Bring the handles together under control.',
        ],
        'tips': [
            'Think about hugging a tree to keep tension on the chest.',
            'Pause briefly in the contracted position.',
        ],
        'strategyTags': ['isolation', 'accessory', 'chest'],
    },
    {
        'exerciseId': 'pec_deck',
        'name': 'Pec Deck',
        'aliases': ['pec deck fly', 'butterfly machine'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['front_delts'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['machine'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['pec_fly', 'cable_fly', 'db_fly'],
        'formCues': [
            'Set the seat so the handles line up with mid-chest.',
            'Keep the ribcage tall as you squeeze inward.',
        ],
        'tips': [
            'Use the pec deck after pressing to chase a stronger chest contraction.',
        ],
        'strategyTags': ['isolation', 'finisher', 'chest'],
    },
    {
        'exerciseId': 'pec_fly_machine',
        'name': 'Pec Fly Machine',
        'aliases': ['machine pec fly', 'selectorized chest fly'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['front_delts'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['machine'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['pec_deck', 'cable_fly', 'db_fly'],
        'formCues': [
            'Keep the shoulders packed down and back.',
            'Move through the chest, not the elbows.',
        ],
        'strategyTags': ['isolation', 'finisher', 'chest'],
    },
    {
        'exerciseId': 'db_fly',
        'name': 'Dumbbell Fly',
        'aliases': ['dumbbell chest fly'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['front_delts'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['dumbbell', 'bench'],
        'fatigue': 'medium',
        'minLevel': 'intermediate',
        'placement': 'mid',
        'alternatives': ['cable_fly', 'pec_deck', 'pec_fly'],
        'formCues': [
            'Lower the bells in a wide arc.',
            'Keep a slight bend in the elbows the entire rep.',
        ],
        'strategyTags': ['isolation', 'accessory', 'chest'],
    },
    {
        'exerciseId': 'smith_bench_press',
        'name': 'Smith Bench Press',
        'aliases': ['smith machine bench press'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['triceps', 'shoulders'],
        'compound': True,
        'pattern': 'horizontal_push',
        'equipment': ['smith', 'bench'],
        'fatigue': 'high',
        'minLevel': 'beginner',
        'placement': 'opener',
        'alternatives': ['bb_bench_press', 'db_bench_press', 'machine_chest_press'],
        'formCues': [
            'Set the bench so the bar tracks to the mid-chest.',
            'Drive evenly through both arms.',
        ],
        'strategyTags': ['compound', 'main_lift', 'chest'],
    },
    {
        'exerciseId': 'incline_bb_press',
        'name': 'Incline Barbell Press',
        'aliases': ['barbell incline press'],
        'primaryMuscles': ['chest'],
        'secondaryMuscles': ['shoulders', 'triceps'],
        'compound': True,
        'pattern': 'horizontal_push',
        'equipment': ['barbell', 'bench'],
        'fatigue': 'high',
        'minLevel': 'intermediate',
        'placement': 'opener',
        'alternatives': ['incline_db_press', 'smith_bench_press', 'machine_chest_press'],
        'formCues': [
            'Use a moderate incline to keep tension on the upper chest.',
            'Press back and up in a smooth bar path.',
        ],
        'strategyTags': ['compound', 'main_lift', 'chest'],
    },
    {
        'exerciseId': 'assisted_pull_up',
        'name': 'Assisted Pull-Up',
        'aliases': ['machine assisted pull up'],
        'primaryMuscles': ['lats'],
        'secondaryMuscles': ['biceps', 'upper_back'],
        'compound': True,
        'pattern': 'vertical_pull',
        'equipment': ['machine', 'bodyweight'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['pull_up', 'lat_pulldown'],
        'formCues': [
            'Drive the elbows toward the ribs.',
            'Keep the chest lifted as you pull.',
        ],
        'strategyTags': ['compound', 'accessory', 'back'],
    },
    {
        'exerciseId': 'trap_bar_deadlift',
        'name': 'Trap Bar Deadlift',
        'aliases': ['hex bar deadlift'],
        'primaryMuscles': ['back'],
        'secondaryMuscles': ['glutes', 'hamstrings', 'quads'],
        'compound': True,
        'pattern': 'hinge',
        'equipment': ['barbell'],
        'fatigue': 'high',
        'minLevel': 'beginner',
        'placement': 'opener',
        'alternatives': ['deadlift', 'rdl'],
        'formCues': [
            'Push the floor away and stay tall through lockout.',
        ],
        'strategyTags': ['compound', 'main_lift', 'lower_body'],
    },
    {
        'exerciseId': 'chest_supported_row',
        'name': 'Chest-Supported Row',
        'aliases': ['incline bench row'],
        'primaryMuscles': ['back'],
        'secondaryMuscles': ['lats', 'biceps'],
        'compound': True,
        'pattern': 'horizontal_pull',
        'equipment': ['dumbbell', 'bench', 'machine'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['seated_cable_row', 'db_row', 'barbell_row'],
        'formCues': [
            'Let the shoulder blades move, then pull with the elbows.',
        ],
        'strategyTags': ['compound', 'accessory', 'back'],
    },
    {
        'exerciseId': 'machine_shoulder_press',
        'name': 'Machine Shoulder Press',
        'aliases': ['selectorized shoulder press'],
        'primaryMuscles': ['front_delts'],
        'secondaryMuscles': ['triceps', 'side_delts'],
        'compound': True,
        'pattern': 'vertical_push',
        'equipment': ['machine'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['ohp', 'db_shoulder_press', 'arnold_press'],
        'strategyTags': ['compound', 'accessory', 'shoulders'],
    },
    {
        'exerciseId': 'arnold_press',
        'name': 'Arnold Press',
        'aliases': ['dumbbell arnold press'],
        'primaryMuscles': ['front_delts'],
        'secondaryMuscles': ['triceps', 'side_delts'],
        'compound': True,
        'pattern': 'vertical_push',
        'equipment': ['dumbbell', 'bench'],
        'fatigue': 'medium',
        'minLevel': 'intermediate',
        'placement': 'mid',
        'alternatives': ['db_shoulder_press', 'machine_shoulder_press', 'ohp'],
        'strategyTags': ['compound', 'accessory', 'shoulders'],
    },
    {
        'exerciseId': 'cable_lateral_raise',
        'name': 'Cable Lateral Raise',
        'aliases': ['single arm cable lateral raise'],
        'primaryMuscles': ['side_delts'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['cable'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['lateral_raise', 'machine_lateral_raise'],
        'strategyTags': ['isolation', 'accessory', 'shoulders'],
    },
    {
        'exerciseId': 'machine_lateral_raise',
        'name': 'Machine Lateral Raise',
        'aliases': ['lateral raise machine'],
        'primaryMuscles': ['side_delts'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['machine'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['lateral_raise', 'cable_lateral_raise'],
        'strategyTags': ['isolation', 'finisher', 'shoulders'],
    },
    {
        'exerciseId': 'cable_curl',
        'name': 'Cable Curl',
        'aliases': ['standing cable curl'],
        'primaryMuscles': ['biceps'],
        'secondaryMuscles': ['forearms'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['cable'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['bb_curl', 'db_curl', 'ez_bar_curl'],
        'strategyTags': ['isolation', 'accessory', 'biceps'],
    },
    {
        'exerciseId': 'ez_bar_curl',
        'name': 'EZ-Bar Curl',
        'aliases': ['ez curl bar curl'],
        'primaryMuscles': ['biceps'],
        'secondaryMuscles': ['forearms'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['barbell'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['bb_curl', 'cable_curl', 'db_curl'],
        'strategyTags': ['isolation', 'accessory', 'biceps'],
    },
    {
        'exerciseId': 'cable_hammer_curl',
        'name': 'Cable Hammer Curl',
        'aliases': ['rope hammer curl'],
        'primaryMuscles': ['biceps'],
        'secondaryMuscles': ['forearms'],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['cable'],
        'attachments': ['rope'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['hammer_curl', 'cable_curl'],
        'strategyTags': ['isolation', 'finisher', 'biceps'],
    },
    {
        'exerciseId': 'skull_crusher',
        'name': 'Skull Crusher',
        'aliases': ['lying tricep extension'],
        'primaryMuscles': ['triceps'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['barbell', 'dumbbell', 'bench'],
        'fatigue': 'medium',
        'minLevel': 'intermediate',
        'placement': 'mid',
        'alternatives': ['tricep_pushdown', 'overhead_tricep_ext'],
        'strategyTags': ['isolation', 'accessory', 'triceps'],
    },
    {
        'exerciseId': 'dip',
        'name': 'Dip',
        'aliases': ['parallel bar dip'],
        'primaryMuscles': ['triceps'],
        'secondaryMuscles': ['chest', 'shoulders'],
        'compound': True,
        'pattern': 'horizontal_push',
        'equipment': ['bodyweight'],
        'fatigue': 'high',
        'minLevel': 'intermediate',
        'placement': 'mid',
        'alternatives': ['close_grip_bench', 'tricep_pushdown'],
        'strategyTags': ['compound', 'accessory', 'triceps'],
    },
    {
        'exerciseId': 'walking_lunge',
        'name': 'Walking Lunge',
        'aliases': ['dumbbell walking lunge'],
        'primaryMuscles': ['quads'],
        'secondaryMuscles': ['glutes', 'hamstrings'],
        'compound': True,
        'pattern': 'lunge',
        'equipment': ['dumbbell', 'bodyweight'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['bulgarian_split_squat', 'step_up'],
        'strategyTags': ['compound', 'accessory', 'legs'],
    },
    {
        'exerciseId': 'step_up',
        'name': 'Step-Up',
        'aliases': ['dumbbell step up'],
        'primaryMuscles': ['quads'],
        'secondaryMuscles': ['glutes', 'hamstrings'],
        'compound': True,
        'pattern': 'lunge',
        'equipment': ['dumbbell', 'bench'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['walking_lunge', 'bulgarian_split_squat'],
        'strategyTags': ['compound', 'accessory', 'legs'],
    },
    {
        'exerciseId': 'good_morning',
        'name': 'Good Morning',
        'aliases': ['barbell good morning'],
        'primaryMuscles': ['hamstrings'],
        'secondaryMuscles': ['glutes', 'lower_back'],
        'compound': True,
        'pattern': 'hinge',
        'equipment': ['barbell'],
        'fatigue': 'high',
        'minLevel': 'intermediate',
        'placement': 'mid',
        'alternatives': ['rdl', 'deadlift'],
        'strategyTags': ['compound', 'accessory', 'posterior_chain'],
    },
    {
        'exerciseId': 'nordic_curl',
        'name': 'Nordic Curl',
        'aliases': ['nordic hamstring curl'],
        'primaryMuscles': ['hamstrings'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['bodyweight'],
        'fatigue': 'high',
        'minLevel': 'advanced',
        'placement': 'finisher',
        'alternatives': ['leg_curl', 'rdl'],
        'strategyTags': ['isolation', 'finisher', 'hamstrings'],
    },
    {
        'exerciseId': 'glute_bridge',
        'name': 'Glute Bridge',
        'aliases': ['bodyweight glute bridge'],
        'primaryMuscles': ['glutes'],
        'secondaryMuscles': ['hamstrings'],
        'compound': True,
        'pattern': 'hinge',
        'equipment': ['bodyweight'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['hip_thrust', 'cable_kickback'],
        'strategyTags': ['compound', 'accessory', 'glutes'],
    },
    {
        'exerciseId': 'cable_kickback',
        'name': 'Cable Kickback',
        'aliases': ['glute cable kickback'],
        'primaryMuscles': ['glutes'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'isolation',
        'equipment': ['cable'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['hip_thrust', 'glute_bridge'],
        'strategyTags': ['isolation', 'finisher', 'glutes'],
    },
    {
        'exerciseId': 'ab_wheel',
        'name': 'Ab Wheel Rollout',
        'aliases': ['ab wheel'],
        'primaryMuscles': ['core'],
        'secondaryMuscles': ['shoulders'],
        'compound': False,
        'pattern': 'core',
        'equipment': ['bodyweight'],
        'fatigue': 'medium',
        'minLevel': 'intermediate',
        'placement': 'finisher',
        'alternatives': ['plank', 'cable_crunch', 'dead_bug'],
        'strategyTags': ['core', 'finisher'],
    },
    {
        'exerciseId': 'dead_bug',
        'name': 'Dead Bug',
        'aliases': ['bodyweight dead bug'],
        'primaryMuscles': ['core'],
        'secondaryMuscles': [],
        'compound': False,
        'pattern': 'core',
        'equipment': ['bodyweight'],
        'fatigue': 'low',
        'minLevel': 'beginner',
        'placement': 'finisher',
        'alternatives': ['plank', 'ab_wheel'],
        'strategyTags': ['core', 'finisher'],
    },
    {
        'exerciseId': 'goblet_squat',
        'name': 'Goblet Squat',
        'aliases': ['dumbbell goblet squat'],
        'primaryMuscles': ['quads'],
        'secondaryMuscles': ['glutes', 'core'],
        'compound': True,
        'pattern': 'squat',
        'equipment': ['dumbbell'],
        'fatigue': 'medium',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['front_squat', 'back_squat', 'hack_squat'],
        'strategyTags': ['compound', 'accessory', 'legs'],
    },
    {
        'exerciseId': 'smith_squat',
        'name': 'Smith Squat',
        'aliases': ['smith machine squat'],
        'primaryMuscles': ['quads'],
        'secondaryMuscles': ['glutes', 'hamstrings'],
        'compound': True,
        'pattern': 'squat',
        'equipment': ['smith'],
        'fatigue': 'high',
        'minLevel': 'beginner',
        'placement': 'mid',
        'alternatives': ['back_squat', 'hack_squat', 'leg_press'],
        'strategyTags': ['compound', 'accessory', 'legs'],
    },
]


def build_seed_exercises() -> List[CanonicalExercise]:
    canonical = {_legacy_to_canonical(exercise).exercise_id: _legacy_to_canonical(exercise) for exercise in LEGACY_EXERCISES}
    for record in SUPPLEMENTAL_EXERCISES:
        exercise = CanonicalExercise.from_record({
            **FAMILY_METADATA_OVERRIDES.get(record['exerciseId'], {}),
            **record,
        })
        canonical[exercise.exercise_id] = exercise
    enriched = [_enrich_seed_exercise(exercise) for exercise in canonical.values()]
    return sorted(enriched, key=lambda exercise: exercise.name)
