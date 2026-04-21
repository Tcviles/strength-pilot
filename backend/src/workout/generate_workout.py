import json
import os
import uuid
from datetime import datetime, timezone

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger
from common.domain.programming import pick_exercises, select_split

logger = setup_logger('generate-workout')

users_service = DynamoConnection(os.getenv('USERS_TABLE'))
gyms_service = DynamoConnection(os.getenv('GYMS_TABLE'))
workouts_service = DynamoConnection(os.getenv('WORKOUTS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        try:
            body = json.loads(request.body_raw or '{}')
        except json.JSONDecodeError:
            return APIResponse.incomplete()

        user = users_service.get_item({'userId': user_id})
        if not user:
            return APIResponse.not_found('User profile not found')

        active_gym_id = user.get('activeGymId')
        if not active_gym_id:
            return APIResponse.bad_request('No active gym selected')

        gym = gyms_service.get_item({'userId': user_id, 'gymId': active_gym_id})
        if not gym:
            return APIResponse.not_found('Active gym not found')

        recent_res = workouts_service.query(
            IndexName='CompletedAtIndex',
            KeyConditionExpression='userId = :u',
            ExpressionAttributeValues={':u': user_id},
            ScanIndexForward=False,
            Limit=3,
        )
        recent = recent_res.get('Items', [])
        recent_exercise_ids = [
            e.get('exerciseId') for w in recent for e in (w.get('exercises') or [])
        ]

        days_per_week = int(user.get('daysPerWeek', 3))
        split = select_split(
            days_per_week,
            user.get('splitPreference', 'auto'),
            user.get('goal', 'general'),
        )
        day_index = body.get('dayIndex')
        if day_index is None:
            day_index = len(recent) % len(split)
        focus = split[day_index % len(split)]

        exercises = pick_exercises(
            focus=focus,
            gym_equipment=clean_decimals(gym.get('equipment') or {}),
            goal=user.get('goal', 'general'),
            experience=user.get('experience', 'beginner'),
            session_length=int(user.get('sessionLength', 60)),
            pain_areas=list(user.get('painAreas') or []),
            limited_time=bool(body.get('limitedTime', False)),
            gym_crowdedness=body.get('gymCrowdedness', 'low'),
            recent_exercise_ids=recent_exercise_ids,
        )

        workout = {
            'userId': user_id,
            'workoutId': str(uuid.uuid4()),
            'generatedAt': datetime.now(timezone.utc).isoformat(),
            'goal': user.get('goal', 'general'),
            'durationMinutes': int(user.get('sessionLength', 60)),
            'exercises': exercises,
            'mood': body.get('mood'),
            'gymCrowdedness': body.get('gymCrowdedness'),
            'limitedTime': body.get('limitedTime'),
        }

        return APIResponse.result({'workout': workout, 'focus': focus})
    except Exception as ex:
        logger.error(f'generateWorkout error: {ex}')
        return APIResponse.error()
