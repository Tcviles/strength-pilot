from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.services.exercise_library import ExerciseLibraryService
from common.utils.logger import setup_logger

logger = setup_logger('get-exercise')
exercise_library = ExerciseLibraryService()


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        exercise_id = request.get_path_param('exerciseId')
        if not exercise_id:
            return APIResponse.bad_request('Missing exerciseId')

        exercise = exercise_library.get_exercise(exercise_id, dynamo_only=True)
        if not exercise:
            return APIResponse.not_found('Exercise not found')

        return APIResponse.result({'exercise': exercise.to_record()})
    except Exception as ex:
        logger.error(f'getExercise error: {ex}')
        return APIResponse.error()
