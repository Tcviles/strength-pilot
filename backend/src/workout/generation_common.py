from typing import Dict, List, Tuple

from common.domain.programming import pick_exercises, select_split
from common.services.deserialize_dynamo import clean_decimals
from common.services.exercise_library import ExerciseLibraryService


exercise_library = ExerciseLibraryService()

FOCUS_ALIASES = {
    'upper_body': 'upper',
    'lower_body': 'lower',
}


def normalize_focus(value: str | None) -> str | None:
    if not value:
        return None

    normalized = str(value).strip().lower()
    return FOCUS_ALIASES.get(normalized, normalized)


def build_generated_workout(
    *,
    profile: Dict,
    gym: Dict,
    body: Dict,
    recent_exercise_ids: List[str] | None = None,
) -> Tuple[Dict, str]:
    recent_exercise_ids = recent_exercise_ids or []
    split = select_split(
        int(profile.get('daysPerWeek', 3)),
        profile.get('splitPreference', 'auto'),
        profile.get('goal', 'general'),
    )

    focus_override = normalize_focus(body.get('focus'))
    if focus_override:
        focus = focus_override
    else:
        day_index = body.get('dayIndex')
        if day_index is None:
            day_index = len(recent_exercise_ids) % len(split)
        focus = split[day_index % len(split)]

    exercises = pick_exercises(
        focus=focus,
        gym_equipment=clean_decimals(gym.get('equipment') or {}),
        goal=profile.get('goal', 'general'),
        experience=profile.get('experience', 'beginner'),
        session_length=int(profile.get('sessionLength', 60)),
        pain_areas=list(profile.get('painAreas') or []),
        limited_time=bool(body.get('limitedTime', False)),
        gym_crowdedness=body.get('gymCrowdedness', 'low'),
        recent_exercise_ids=recent_exercise_ids,
        exercises=exercise_library.list_exercises(),
    )

    workout = {
        'goal': profile.get('goal', 'general'),
        'durationMinutes': int(profile.get('sessionLength', 60)),
        'exercises': exercises,
        'mood': body.get('mood'),
        'gymCrowdedness': body.get('gymCrowdedness'),
        'limitedTime': body.get('limitedTime'),
    }
    return workout, focus
