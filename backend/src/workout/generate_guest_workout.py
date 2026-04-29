import json
import uuid
from datetime import datetime, timezone

from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

from generation_common import build_generated_workout

logger = setup_logger('generate-guest-workout')


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)

        try:
            body = json.loads(request.body_raw or '{}')
        except json.JSONDecodeError:
            return APIResponse.incomplete()

        profile = body.get('profile') or {}
        gym = body.get('gym') or {}
        if not profile or not gym:
            return APIResponse.bad_request('Missing guest profile or gym')

        workout, focus = build_generated_workout(
            profile=profile,
            gym=gym,
            body=body,
            recent_exercise_ids=[],
        )
        workout.update({
            'workoutId': f"guest-{uuid.uuid4()}",
            'generatedAt': datetime.now(timezone.utc).isoformat(),
        })

        return APIResponse.result({'workout': workout, 'focus': focus})
    except Exception as ex:
        logger.error(f'generateGuestWorkout error: {ex}')
        return APIResponse.error()
