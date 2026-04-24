from common.models.api_response import APIResponse
from common.services.exercise_library import ExerciseLibraryService
from common.utils.logger import setup_logger

logger = setup_logger('list-exercises')
exercise_library = ExerciseLibraryService()


def lambda_handler(event, context):
    try:
        exercises = [exercise.to_record() for exercise in exercise_library.list_exercises(dynamo_only=True)]
        return APIResponse.result({'exercises': exercises})
    except Exception as ex:
        logger.error(f'listExercises error: {ex}')
        return APIResponse.error()
