import json
import os

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger
from common.domain.programming import find_swap, get_set_rep_scheme

logger = setup_logger('swap-exercise')

users_service = DynamoConnection(os.getenv('USERS_TABLE'))
gyms_service = DynamoConnection(os.getenv('GYMS_TABLE'))


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

        current_exercise_id = body.get('currentExerciseId')
        reason = body.get('reason')
        if not current_exercise_id or not reason:
            return APIResponse.bad_request('Missing currentExerciseId or reason')

        user = users_service.get_item({'userId': user_id})
        if not user:
            return APIResponse.not_found('User profile not found')

        gym_id = body.get('gymId') or user.get('activeGymId')
        if not gym_id:
            return APIResponse.bad_request('No gym specified')

        gym = gyms_service.get_item({'userId': user_id, 'gymId': gym_id})
        if not gym:
            return APIResponse.not_found('Gym not found')

        replacement = find_swap(
            current_exercise_id=current_exercise_id,
            reason=reason,
            gym_equipment=clean_decimals(gym.get('equipment') or {}),
            experience=user.get('experience', 'beginner'),
        )
        if not replacement:
            return APIResponse.not_found('No suitable substitute found')

        scheme = get_set_rep_scheme(user.get('goal', 'general'), replacement)
        return APIResponse.result({
            'replacement': replacement.to_dict(),
            'scheme': scheme,
            'swappedFrom': current_exercise_id,
            'reason': reason,
        })
    except Exception as ex:
        logger.error(f'swapExercise error: {ex}')
        return APIResponse.error()
