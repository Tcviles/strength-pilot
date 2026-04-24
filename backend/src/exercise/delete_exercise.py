from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.services.exercise_library import ExerciseLibraryService
from common.utils.logger import setup_logger

logger = setup_logger('delete-exercise')
exercise_library = ExerciseLibraryService()


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        exercise_id = request.get_path_param('exerciseId')
        if not exercise_id:
            return APIResponse.bad_request('Missing exerciseId')

        deleted = exercise_library.delete_exercise(exercise_id)
        if not deleted:
            return APIResponse.not_found('Exercise not found in custom library')

        return APIResponse.success('Exercise deleted.')
    except Exception as ex:
        logger.error(f'deleteExercise error: {ex}')
        return APIResponse.error()
