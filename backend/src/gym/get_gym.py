import os

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('get-gym')

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

        gym = gyms_service.get_item({'userId': user_id, 'gymId': gym_id})
        if not gym:
            return APIResponse.not_found('Gym not found')

        return APIResponse.result(clean_decimals(gym))
    except Exception as ex:
        logger.error(f'getGym error: {ex}')
        return APIResponse.error()
