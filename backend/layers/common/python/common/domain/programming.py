from typing import Dict, List, Optional

from .canonical_exercises import CanonicalExercise as Exercise
from .exercises import EXERCISES as LEGACY_EXERCISES


AUTO_SPLITS: Dict[int, List[str]] = {
    1: ['full_body'],
    2: ['full_body', 'full_body'],
    3: ['full_body', 'full_body', 'full_body'],
    4: ['upper', 'lower', 'upper', 'lower'],
    5: ['push', 'pull', 'legs', 'upper', 'lower'],
    6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
    7: ['push', 'pull', 'legs', 'upper', 'lower', 'push', 'pull'],
}

SPLIT_PREFERENCE_SPLITS: Dict[int, List[str]] = {
    1: ['full_body'],
    2: ['upper', 'lower'],
    3: ['push', 'pull', 'legs'],
    5: ['push', 'pull', 'legs', 'upper', 'lower'],
    6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'],
    7: ['push', 'pull', 'legs', 'upper', 'lower', 'push', 'pull'],
}

FOCUS_MUSCLES: Dict[str, List[str]] = {
    'push': ['chest', 'shoulders', 'triceps'],
    'pull': ['back', 'lats', 'biceps'],
    'legs': ['quads', 'hamstrings', 'glutes', 'calves'],
    'upper': ['chest', 'back', 'lats', 'shoulders', 'biceps', 'triceps'],
    'lower': ['quads', 'hamstrings', 'glutes', 'calves'],
    'full_body': ['chest', 'back', 'quads', 'hamstrings', 'shoulders'],
    'chest': ['chest'],
    'back': ['back', 'lats', 'upper_back'],
    'shoulders': ['shoulders', 'front_delts', 'side_delts', 'rear_delts'],
    'arms': ['biceps', 'triceps', 'forearms'],
    'abs': ['core', 'abs', 'obliques'],
    'chest_tri': ['chest', 'triceps'],
    'back_bi': ['back', 'lats', 'biceps'],
    'shoulders_arms': ['shoulders', 'biceps', 'triceps'],
}

EXERCISES_PER_SESSION: Dict[int, int] = {30: 4, 45: 5, 60: 6, 90: 8}

EXPERIENCE_RANK: Dict[str, int] = {'beginner': 0, 'intermediate': 1, 'advanced': 2}

PLACEMENT_ORDER: Dict[str, int] = {'warm_up': 0, 'opener': 1, 'any': 2, 'mid': 3, 'finisher': 4}

DEFAULT_EXERCISES: List[Exercise] = [
    Exercise.from_record({
        'exerciseId': exercise.id,
        'name': exercise.name,
        'aliases': [exercise.name.lower()],
        'primaryMuscles': [exercise.primary],
        'secondaryMuscles': exercise.secondary,
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
    for exercise in LEGACY_EXERCISES
]
DEFAULT_EXERCISE_BY_ID: Dict[str, Exercise] = {
    exercise.exercise_id: exercise for exercise in DEFAULT_EXERCISES
}


def _normalize_token(value: str) -> str:
    return str(value or '').strip().lower()


def select_split(days_per_week: int, split_preference: str = 'auto', goal: str = 'general') -> List[str]:
    normalized_days = max(days_per_week, 1)

    if split_preference == 'full_body':
        return ['full_body'] * normalized_days

    if split_preference == 'split':
        if normalized_days == 4:
            if goal == 'strength':
                return ['upper', 'lower', 'upper', 'lower']
            return ['chest_tri', 'back_bi', 'legs', 'shoulders_arms']

        return SPLIT_PREFERENCE_SPLITS.get(normalized_days, SPLIT_PREFERENCE_SPLITS[3])

    return AUTO_SPLITS.get(normalized_days, AUTO_SPLITS[3])


def can_use_exercise(exercise: Exercise, gym_equipment: Dict[str, bool], experience: str) -> bool:
    if EXPERIENCE_RANK[exercise.min_level] > EXPERIENCE_RANK[experience]:
        return False
    return all(eq == 'bodyweight' or gym_equipment.get(eq) is True for eq in exercise.equipment)


def get_set_rep_scheme(goal: str, exercise: Exercise) -> Dict:
    is_compound = exercise.compound
    if goal == 'strength':
        return ({'sets': 4, 'reps': '3-6', 'restSeconds': 180} if is_compound
                else {'sets': 3, 'reps': '6-10', 'restSeconds': 120})
    if goal == 'hypertrophy':
        return ({'sets': 3, 'reps': '6-10', 'restSeconds': 120} if is_compound
                else {'sets': 3, 'reps': '10-15', 'restSeconds': 75})
    if goal == 'fat_loss':
        return {'sets': 3, 'reps': '12-20', 'restSeconds': 45}
    # general
    return ({'sets': 3, 'reps': '6-10', 'restSeconds': 120} if is_compound
            else {'sets': 3, 'reps': '10-12', 'restSeconds': 75})


def pick_exercises(
    focus: str,
    gym_equipment: Dict[str, bool],
    goal: str,
    experience: str,
    session_length: int,
    pain_areas: Optional[List[str]] = None,
    limited_time: bool = False,
    gym_crowdedness: str = 'low',
    recent_exercise_ids: Optional[List[str]] = None,
    exercises: Optional[List[Exercise]] = None,
) -> List[Dict]:
    pain_areas = pain_areas or []
    recent_exercise_ids = recent_exercise_ids or []
    exercises = exercises or DEFAULT_EXERCISES

    pain_area_set = {_normalize_token(area) for area in pain_areas}
    target_muscles = [
        muscle for muscle in FOCUS_MUSCLES[focus]
        if _normalize_token(muscle) not in pain_area_set
    ]
    target_muscle_set = {_normalize_token(muscle) for muscle in target_muscles}
    target_count = (max(3, EXERCISES_PER_SESSION[session_length] - 2)
                    if limited_time else EXERCISES_PER_SESSION[session_length])

    candidates = [
        e for e in exercises
        if any(_normalize_token(muscle) in target_muscle_set for muscle in e.primary_muscles)
        and can_use_exercise(e, gym_equipment, experience)
        and not any(_normalize_token(muscle) in pain_area_set for muscle in e.secondary_muscles)
    ]

    scored = []
    for e in candidates:
        score = 0
        if e.compound:
            score += 10
        if e.id in recent_exercise_ids:
            score -= 5
        if gym_crowdedness == 'high' and 'machine' in e.equipment:
            score -= 3
        if gym_crowdedness == 'high' and 'cable' in e.equipment:
            score -= 2
        if goal == 'strength' and e.compound:
            score += 5
        if goal == 'fat_loss' and e.fatigue == 'low':
            score += 2
        scored.append((e, score))

    # Ensure each target muscle gets at least one exercise
    by_muscle: Dict[str, list] = {}
    for e, s in scored:
        for muscle in e.primary_muscles:
            normalized_muscle = _normalize_token(muscle)
            if normalized_muscle in target_muscle_set:
                by_muscle.setdefault(normalized_muscle, []).append((e, s))

    selected: List[Exercise] = []
    for muscle in target_muscles:
        group = by_muscle.get(_normalize_token(muscle))
        if not group:
            continue
        group.sort(key=lambda pair: pair[1], reverse=True)
        selected.append(group[0][0])

    selected_ids = {e.id for e in selected}
    remaining = sorted(
        [(e, s) for e, s in scored if e.id not in selected_ids],
        key=lambda pair: pair[1],
        reverse=True,
    )

    while len(selected) < target_count and remaining:
        selected.append(remaining.pop(0)[0])

    selected.sort(key=lambda e: PLACEMENT_ORDER[e.placement])

    workout_exercises = []
    for exercise in selected:
        scheme = get_set_rep_scheme(goal, exercise)
        workout_exercises.append({
            'exerciseId': exercise.id,
            'targetSets': scheme['sets'],
            'targetReps': scheme['reps'],
            'restSeconds': scheme['restSeconds'],
            'thumbnailUrl': exercise.thumbnail_url or None,
            'detailImageUrl': exercise.detail_image_url or None,
            'sets': [],
        })
    return workout_exercises


def find_swap(
    current_exercise_id: str,
    reason: str,
    gym_equipment: Dict[str, bool],
    experience: str,
    exercises: Optional[List[Exercise]] = None,
    exercise_by_id: Optional[Dict[str, Exercise]] = None,
) -> Optional[Exercise]:
    exercises = exercises or DEFAULT_EXERCISES
    exercise_by_id = exercise_by_id or DEFAULT_EXERCISE_BY_ID

    current = exercise_by_id.get(current_exercise_id)
    if not current:
        return None

    for sub_id in current.substitutes:
        sub = exercise_by_id.get(sub_id)
        if not sub:
            continue
        if not can_use_exercise(sub, gym_equipment, experience):
            continue
        if reason == 'unavailable':
            current_equip = set(current.equipment)
            if any(eq in current_equip and eq != 'bench' for eq in sub.equipment):
                continue
        return sub

    # Fallback: same primary, same pattern
    current_primary = _normalize_token(current.primary)
    for e in exercises:
        if (e.id != current.id
                and _normalize_token(e.primary) == current_primary
                and e.pattern == current.pattern
                and can_use_exercise(e, gym_equipment, experience)):
            return e
    return None


def round_weight(w: float) -> float:
    return round(w / 2.5) * 2.5


def suggest_next_weight(
    last_weight: float,
    last_reps_hit: int,
    target_reps: str,
    rir: Optional[int] = None,
) -> float:
    parts = target_reps.split('-')
    low = int(parts[0])
    high = int(parts[1]) if len(parts) > 1 else low

    if last_reps_hit >= high and (rir is None or rir >= 2):
        return round_weight(last_weight * 1.025)
    if last_reps_hit < low:
        return round_weight(last_weight * 0.9)
    return last_weight
