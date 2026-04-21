from common.utils.logger import setup_logger

logger = setup_logger('pre-sign-up')


def lambda_handler(event, context):
    try:
        response = event.setdefault('response', {})
        response['autoConfirmUser'] = True

        user_attributes = event.get('request', {}).get('userAttributes', {})
        if user_attributes.get('email'):
            response['autoVerifyEmail'] = True

        return event
    except Exception as ex:
        logger.error(f'preSignUp error: {ex}')
        raise
