import json
import os

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('update-gym')

gyms_service = DynamoConnection(os.getenv('GYMS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        gym_id = request.get_path_param('gymId')
        if not gym_id:
            return APIResponse.bad_request('Missing gymId')

        try:
            body = json.loads(request.body_raw or '{}')
        except json.JSONDecodeError:
            return APIResponse.incomplete()

        gym = {
            'userId': user_id,
            'gymId': gym_id,
            'name': body.get('name', 'My Gym'),
            'type': body.get('type', 'commercial'),
            'equipment': body.get('equipment', {}),
            'dumbbellMax': body.get('dumbbellMax'),
            'hasSmith': body.get('hasSmith'),
            'hasHackSquat': body.get('hasHackSquat'),
            'notes': body.get('notes'),
        }
        gym = {k: v for k, v in gym.items() if v is not None}

        gyms_service.put_item(gym)
        return APIResponse.result(clean_decimals(gym))
    except Exception as ex:
        logger.error(f'updateGym error: {ex}')
        return APIResponse.error()
