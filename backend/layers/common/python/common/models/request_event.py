class RequestEvent:
    def __init__(self, lambda_event_object):
        self.raw = lambda_event_object
        self.query_string_params = lambda_event_object.get('queryStringParameters', {}) or {}
        self.path_params = lambda_event_object.get('pathParameters', {}) or {}
        self.headers = lambda_event_object.get('headers', {}) or {}
        self.auth = self.headers.get('Authorization') or self.headers.get('authorization')
        self.body_raw = lambda_event_object.get('body')
        self._claims = self.__extract_claims(lambda_event_object)

    @staticmethod
    def __extract_claims(event):
        request_context = event.get('requestContext') or {}
        authorizer = request_context.get('authorizer') or {}
        jwt = authorizer.get('jwt') or {}
        return jwt.get('claims') or {}

    def get_query_param(self, param):
        return self.query_string_params.get(param)

    def get_path_param(self, param):
        return self.path_params.get(param)

    def get_claim(self, claim):
        return self._claims.get(claim)

    def get_user_id(self):
        """Returns the Cognito 'sub' claim (the user's unique ID)."""
        return self._claims.get('sub')

    def get_email(self):
        return self._claims.get('email')
