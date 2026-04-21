import json
import os
from datetime import datetime, timezone

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('update-user-profile')

users_service = DynamoConnection(os.getenv('USERS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        try:
            updates = json.loads(request.body_raw or '{}')
        except json.JSONDecodeError:
            return APIResponse.incomplete()

        existing = users_service.get_item({'userId': user_id}) or {}
        now = datetime.now(timezone.utc).isoformat()

        profile = {
            'userId': user_id,
            'email': request.get_email() or existing.get('email', ''),
            'firstName': updates.get('firstName', existing.get('firstName')),
            'goal': updates.get('goal', existing.get('goal', 'general')),
            'experience': updates.get('experience', existing.get('experience', 'beginner')),
            'splitPreference': updates.get('splitPreference', existing.get('splitPreference', 'auto')),
            'daysPerWeek': updates.get('daysPerWeek', existing.get('daysPerWeek', 3)),
            'sessionLength': updates.get('sessionLength', existing.get('sessionLength', 60)),
            'activeGymId': updates.get('activeGymId', existing.get('activeGymId')),
            'painAreas': updates.get('painAreas', existing.get('painAreas')),
            'permanentLimitations': updates.get(
                'permanentLimitations', existing.get('permanentLimitations')
            ),
            'createdAt': existing.get('createdAt', now),
            'updatedAt': now,
        }
        profile = {k: v for k, v in profile.items() if v is not None}

        users_service.put_item(profile)
        return APIResponse.result(clean_decimals(profile))
    except Exception as ex:
        logger.error(f'updateUserProfile error: {ex}')
        return APIResponse.error()
