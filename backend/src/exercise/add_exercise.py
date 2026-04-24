import json
import os
import re
import urllib.error
import urllib.request
from typing import Any, Dict, List, Iterable

import boto3
from common.domain.canonical_exercises import CanonicalExercise
from common.models.api_response import APIResponse
from common.models.request_event import RequestEvent
from common.services.exercise_library import ExerciseLibraryService
from common.utils.logger import setup_logger

logger = setup_logger('add-exercise')
exercise_library = ExerciseLibraryService()

OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
OPENAI_API_KEY_PARAMETER = '/pilot-iq/openai_api_key'
EQUIPMENT_OPTIONS = {
    'barbell',
    'dumbbell',
    'cable',
    'machine',
    'cardio',
    'bodyweight',
    'smith',
    'kettlebell',
    'resistance_band',
    'bench',
    'pull_up_bar',
}

COMMON_MUSCLE_MAP = {
    'pectoralis_major': 'chest',
    'pectoralis_minor': 'chest',
    'anterior_deltoid': 'front_delts',
    'lateral_deltoid': 'side_delts',
    'posterior_deltoid': 'rear_delts',
    'triceps_brachii': 'triceps',
    'biceps_brachii': 'biceps',
    'latissimus_dorsi': 'lats',
    'rhomboids': 'upper_back',
    'trapezius': 'traps',
    'erector_spinae': 'lower_back',
    'rectus_abdominis': 'abs',
    'obliques': 'obliques',
    'gluteus_maximus': 'glutes',
    'quadriceps': 'quads',
    'hamstrings': 'hamstrings',
    'gastrocnemius': 'calves',
}


def _slugify(value: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '_', value.lower()).strip('_')
    return re.sub(r'_+', '_', slug)


def _humanize_slug(value: str) -> str:
    normalized = str(value or '').strip().replace('_', ' ')
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    if not normalized:
        return ''
    words = []
    for word in normalized.split(' '):
        if word.upper() in {'EZ', 'MAG'}:
            words.append(word.upper())
        elif word.lower() in {'db', 'bb'}:
            words.append(word.upper())
        else:
            words.append(word.capitalize())
    return ' '.join(words)


def _looks_like_slug(value: str) -> bool:
    value = str(value or '').strip()
    return '_' in value or value == value.lower()


def _normalize_muscle(value: str) -> str:
    return COMMON_MUSCLE_MAP.get(_slugify(value), _slugify(value))


def _dedupe(values: Iterable[str]) -> List[str]:
    seen = set()
    ordered: List[str] = []
    for value in values:
        if not value or value in seen:
            continue
        seen.add(value)
        ordered.append(value)
    return ordered


def _normalize_sentence(value: str) -> str:
    text = str(value or '').strip().replace('_', ' ')
    text = re.sub(r'\s+', ' ', text).strip(' .')
    if not text:
        return ''
    text = text[0].upper() + text[1:]
    return f'{text}.'


def _same_focus_family(left: CanonicalExercise, right: CanonicalExercise) -> bool:
    if left.compound != right.compound:
        return False

    if left.pattern == right.pattern:
        return True

    left_primary = set(left.primary_muscles)
    right_primary = set(right.primary_muscles)
    return bool(left_primary & right_primary) and left.pattern == 'isolation' and right.pattern == 'isolation'


def _infer_alternatives(current: CanonicalExercise, library: List[CanonicalExercise]) -> List[str]:
    scored: List[tuple[int, str]] = []
    current_primary = set(current.primary_muscles)

    for candidate in library:
        if candidate.exercise_id == current.exercise_id:
            continue
        if not _same_focus_family(current, candidate):
            continue

        score = 0
        if current.pattern == candidate.pattern:
            score += 4
        if current.compound == candidate.compound:
            score += 3
        if current_primary & set(candidate.primary_muscles):
            score += 3
        if set(current.equipment) & set(candidate.equipment):
            score += 1
        scored.append((score, candidate.exercise_id))

    scored.sort(key=lambda item: (-item[0], item[1]))
    return [exercise_id for _, exercise_id in scored[:4]]


def _normalize_generated_record(
    generated: Dict[str, Any],
    *,
    requested_name: str,
    selected_equipment: str,
    notes: str,
) -> Dict[str, Any]:
    normalized = dict(generated)
    resolved_name = str(normalized.get('name') or requested_name).strip()
    normalized['name'] = _humanize_slug(resolved_name) if _looks_like_slug(resolved_name) else resolved_name
    normalized['exerciseId'] = normalized.get('exerciseId') or _slugify(normalized['name'])
    normalized['aliases'] = _dedupe([
        _slugify(alias) for alias in normalized.get('aliases', [])
    ] + [_slugify(requested_name)])
    normalized['equipment'] = _dedupe([
        _slugify(item) for item in normalized.get('equipment', [])
    ] + [_slugify(selected_equipment)])
    normalized['primaryMuscles'] = _dedupe(
        _normalize_muscle(muscle) for muscle in normalized.get('primaryMuscles', [])
    ) or ['general']
    normalized['secondaryMuscles'] = _dedupe(
        _normalize_muscle(muscle) for muscle in normalized.get('secondaryMuscles', [])
    )
    normalized['formCues'] = _dedupe(
        filter(None, (_normalize_sentence(cue) for cue in normalized.get('formCues', [])))
    )
    normalized['tips'] = _dedupe(
        filter(None, (_normalize_sentence(tip) for tip in normalized.get('tips', [])))
    ) or list(normalized['formCues'])
    normalized['strategyTags'] = _dedupe(_slugify(tag) for tag in normalized.get('strategyTags', []))
    normalized['attachments'] = _dedupe(_slugify(item) for item in normalized.get('attachments', []))

    return normalized


def _pair_reciprocal_alternatives(current: CanonicalExercise, library: List[CanonicalExercise]) -> None:
    for alternative_id in current.alternatives:
        existing = next((exercise for exercise in library if exercise.exercise_id == alternative_id), None)
        if not existing or current.exercise_id in existing.alternatives:
            continue
        if not _same_focus_family(current, existing):
            continue

        updated = existing.to_record()
        updated['alternatives'] = _dedupe(list(existing.alternatives) + [current.exercise_id])
        exercise_library.upsert_exercise(updated)


def _allowed_admin_emails() -> List[str]:
    value = os.getenv('EXERCISE_ADMIN_EMAILS', '')
    return [email.strip().lower() for email in value.split(',') if email.strip()]


def _is_allowed_admin(email: str) -> bool:
    allowed = _allowed_admin_emails()
    return not allowed or email.lower() in allowed


def _parse_body(raw_body: str) -> Dict[str, Any]:
    try:
        return json.loads(raw_body or '{}')
    except json.JSONDecodeError:
        return {}


def _extract_response_text(response: Dict[str, Any]) -> str:
    output_text = response.get('output_text')
    if output_text:
        return output_text

    for item in response.get('output', []):
        for content in item.get('content', []):
            if content.get('type') in ('output_text', 'text') and content.get('text'):
                return content['text']

    raise ValueError('OpenAI response did not include output text')


def _build_openai_payload(name: str, equipment: str, notes: str) -> Dict[str, Any]:
    schema = {
        'type': 'object',
        'additionalProperties': False,
        'required': [
            'name',
            'aliases',
            'primaryMuscles',
            'secondaryMuscles',
            'compound',
            'pattern',
            'equipment',
            'fatigue',
            'minLevel',
            'placement',
            'alternatives',
            'attachments',
            'formCues',
            'tips',
            'strategyTags',
        ],
        'properties': {
            'name': {'type': 'string'},
            'aliases': {'type': 'array', 'items': {'type': 'string'}},
            'primaryMuscles': {'type': 'array', 'items': {'type': 'string'}},
            'secondaryMuscles': {'type': 'array', 'items': {'type': 'string'}},
            'compound': {'type': 'boolean'},
            'pattern': {
                'type': 'string',
                'enum': [
                    'horizontal_push',
                    'vertical_push',
                    'horizontal_pull',
                    'vertical_pull',
                    'squat',
                    'hinge',
                    'lunge',
                    'isolation',
                    'core',
                    'cardio',
                ],
            },
            'equipment': {
                'type': 'array',
                'items': {
                    'type': 'string',
                    'enum': sorted(EQUIPMENT_OPTIONS),
                },
            },
            'fatigue': {'type': 'string', 'enum': ['low', 'medium', 'high']},
            'minLevel': {'type': 'string', 'enum': ['beginner', 'intermediate', 'advanced']},
            'placement': {'type': 'string', 'enum': ['warm_up', 'opener', 'any', 'mid', 'finisher']},
            'alternatives': {'type': 'array', 'items': {'type': 'string'}},
            'attachments': {'type': 'array', 'items': {'type': 'string'}},
            'formCues': {'type': 'array', 'items': {'type': 'string'}},
            'tips': {'type': 'array', 'items': {'type': 'string'}},
            'strategyTags': {'type': 'array', 'items': {'type': 'string'}},
        },
    }

    user_prompt = {
        'requestedName': name,
        'selectedEquipment': equipment,
        'attachmentsOrNotes': notes,
    }

    return {
        'model': os.getenv('OPENAI_EXERCISE_MODEL', 'gpt-4o-mini'),
        'input': [
            {
                'role': 'system',
                'content': (
                'You are maintaining StrengthPilot canonical exercise data. '
                'Return one exercise record only. Preserve movement intent: presses are compound, fly/deck movements are isolation, '
                'and alternatives should be empty unless you are confident they are same-pattern, same-compoundness substitutes. '
                'Treat attachmentsOrNotes as optional context that may include handle/attachment details, machine notes, or other hints. '
                'Use lowercase snake_case for muscles, equipment, attachments, and strategyTags.'
                ),
            },
            {
                'role': 'user',
                'content': json.dumps(user_prompt),
            },
        ],
        'text': {
            'format': {
                'type': 'json_schema',
                'name': 'canonical_exercise',
                'schema': schema,
                'strict': True,
            },
        },
    }


def _call_openai(name: str, equipment: str, notes: str) -> Dict[str, Any]:
    api_key = _get_openai_api_key()

    payload = _build_openai_payload(name, equipment, notes)
    request = urllib.request.Request(
        OPENAI_RESPONSES_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            response_payload = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode('utf-8')
        logger.error(f'OpenAI HTTP error: {exc.code} {error_body}')
        raise

    return json.loads(_extract_response_text(response_payload))


def _get_openai_api_key() -> str:
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(
        Name=OPENAI_API_KEY_PARAMETER,
        WithDecryption=True,
    )
    value = str(response.get('Parameter', {}).get('Value') or '').strip()
    if not value:
        raise ValueError('OPENAI_API_KEY is not configured')
    return value


def lambda_handler(event, context):
    try:
        request = RequestEvent(event)
        email = request.get_email() or ''
        # Beta-mode behavior: keep add-exercise open while Thomas is the only active tester.
        # Once admin-managed exercise creation is ready, restore auth enforcement here.
        if email and not _is_allowed_admin(email):
            return APIResponse.unauthorized()

        body = _parse_body(request.body_raw or '{}')
        name = str(body.get('name') or '').strip()
        equipment = str(body.get('equipment') or '').strip().lower()
        notes = str(
            body.get('notes')
            or body.get('attachmentNotes')
            or body.get('attachment')
            or ''
        ).strip().lower()

        if not name:
            return APIResponse.bad_request('Exercise name is required')
        if equipment not in EQUIPMENT_OPTIONS:
            return APIResponse.bad_request('Invalid equipment type')

        generated = _call_openai(name, equipment, notes)
        normalized = _normalize_generated_record(
            generated,
            requested_name=name,
            selected_equipment=equipment,
            notes=notes,
        )

        library = exercise_library.list_exercises(force_refresh=True)
        draft = CanonicalExercise.from_record(normalized)
        inferred_alternatives = _infer_alternatives(draft, library)
        normalized['alternatives'] = _dedupe(
            list(normalized.get('alternatives', [])) + inferred_alternatives
        )

        canonical = CanonicalExercise.from_record(normalized)
        saved = exercise_library.upsert_exercise(canonical.to_record())
        _pair_reciprocal_alternatives(saved, library)

        return APIResponse.result({'exercise': saved.to_record()}, status_code=201)
    except ValueError as exc:
        return APIResponse.bad_request(str(exc))
    except Exception as exc:
        logger.error(f'addExercise error: {exc}')
        return APIResponse.error()
