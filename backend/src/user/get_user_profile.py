import os

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('get-user-profile')

users_service = DynamoConnection(os.getenv('USERS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        user = users_service.get_item({'userId': user_id})
        if not user:
            return APIResponse.not_found('Profile not found')

        return APIResponse.result(clean_decimals(user))
    except Exception as ex:
        logger.error(f'getUserProfile error: {ex}')
        return APIResponse.error()
