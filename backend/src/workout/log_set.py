import json
import os
from datetime import datetime, timezone

from common.services.dynamo import DynamoConnection
from common.services.deserialize_dynamo import clean_decimals
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.utils.logger import setup_logger

logger = setup_logger('log-set')

workouts_service = DynamoConnection(os.getenv('WORKOUTS_TABLE'))


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        user_id = request.get_user_id()
        if not user_id:
            return APIResponse.unauthorized()

        workout_id = request.get_path_param('workoutId')
        if not workout_id:
            return APIResponse.bad_request('Missing workoutId')

        try:
            body = json.loads(request.body_raw or '{}')
        except json.JSONDecodeError:
            return APIResponse.incomplete()

        exercise_id = body.get('exerciseId')
        set_number = body.get('setNumber')
        weight = body.get('weight')
        reps = body.get('reps')
        if exercise_id is None or set_number is None or weight is None or reps is None:
            return APIResponse.bad_request('Missing exerciseId, setNumber, weight, or reps')

        workout = workouts_service.get_item({'userId': user_id, 'workoutId': workout_id})
        if not workout:
            return APIResponse.not_found('Workout not found')

        workout = clean_decimals(workout)
        exercises = workout.get('exercises', [])
        target = next((e for e in exercises if e.get('exerciseId') == exercise_id), None)
        if not target:
            return APIResponse.not_found('Exercise not in workout')

        set_log = {
            'setNumber': set_number,
            'weight': weight,
            'reps': reps,
            'rir': body.get('rir'),
            'completedAt': datetime.now(timezone.utc).isoformat(),
        }

        existing_idx = next(
            (i for i, s in enumerate(target.get('sets', [])) if s.get('setNumber') == set_number),
            None,
        )
        sets = target.setdefault('sets', [])
        if existing_idx is not None:
            sets[existing_idx] = set_log
        else:
            sets.append(set_log)

        if body.get('markWorkoutComplete'):
            workout['completedAt'] = datetime.now(timezone.utc).isoformat()

        workouts_service.put_item(workout)
        return APIResponse.result({'workout': workout})
    except Exception as ex:
        logger.error(f'logSet error: {ex}')
        return APIResponse.error()
