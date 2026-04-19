import os

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('list-workouts')

workouts_service = DynamoConnection(os.getenv('WORKOUTS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        try:
            limit = min(int(request.get_query_param('limit') or 20), 100)
        except (TypeError, ValueError):
            limit = 20

        res = workouts_service.query(
            IndexName='CompletedAtIndex',
            KeyConditionExpression='userId = :u',
            ExpressionAttributeValues={':u': user_id},
            ScanIndexForward=False,
            Limit=limit,
        )
        items = clean_decimals(res.get('Items', []))
        return APIResponse.result({'workouts': items})
    except Exception as ex:
        logger.error(f'listWorkouts error: {ex}')
        return APIResponse.error()
