import boto3
import os
from ..utils.logger import setup_logger

logger = setup_logger('cognito-service')


class CognitoConnection:
    def __init__(self):
        try:
            self.user_pool_id = os.getenv("COGNITO_USER_POOL_ID")
            if not self.user_pool_id:
                raise ValueError("COGNITO_USER_POOL_ID environment variable is not set")
            self.__create_connection()
        except Exception as ex:
            logger.error(ex)
            logger.error("Error initializing Cognito connection. Have you set COGNITO_USER_POOL_ID?")

    def __create_connection(self):
        self.cognito_client = boto3.client('cognito-idp')
        logger.info(f"Cognito client initialized for User Pool: {self.user_pool_id}")

    def get_user(self, username):
        try:
            return self.cognito_client.admin_get_user(
                UserPoolId=self.user_pool_id,
                Username=username,
            )
        except Exception as e:
            logger.error(f"Error getting user {username}: {e}")
            return {"error": str(e)}

    def get_user_by_email(self, email):
        try:
            response = self.cognito_client.list_users(
                UserPoolId=self.user_pool_id,
                Filter=f'email = "{email}"',
                Limit=1,
            )
            users = response.get("Users", [])
            return users[0] if users else None
        except Exception as e:
            logger.error(f"Error getting user by email {email}: {e}")
            return {"error": str(e)}

    def update_user_attribute(self, username, attribute_name, attribute_value):
        try:
            self.cognito_client.admin_update_user_attributes(
                UserPoolId=self.user_pool_id,
                Username=username,
                UserAttributes=[{"Name": attribute_name, "Value": attribute_value}],
            )
            return {"message": f"User {username} updated successfully"}
        except Exception as e:
            logger.error(f"Error updating user {username}: {e}")
            return {"error": str(e)}

    def delete_user(self, username):
        try:
            self.cognito_client.admin_delete_user(
                UserPoolId=self.user_pool_id,
                Username=username,
            )
            return {"message": f"User {username} deleted successfully"}
        except Exception as e:
            logger.error(f"Error deleting user {username}: {e}")
            return {"error": str(e)}
