from dataclasses import dataclass, field
from typing import Any, Dict, List


def _ensure_list(value: Any) -> List[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _normalize_text(value: Any) -> str:
    return str(value or '').strip()


def _normalize_slug(value: Any) -> str:
    return _normalize_text(value).lower()


def _normalize_tag(value: Any) -> str:
    return _normalize_slug(value).replace('-', '_').replace(' ', '_')


def _normalize_string_list(values: Any, *, slug: bool = False, tag: bool = False) -> List[str]:
    normalized: List[str] = []
    for value in _ensure_list(values):
        text = _normalize_text(value)
        if not text:
            continue
        if tag:
            text = _normalize_tag(text)
        elif slug:
            text = _normalize_slug(text)
        normalized.append(text)
    return normalized


def _default_strategy_tags(compound: bool, placement: str) -> List[str]:
    tags: List[str] = []
    if compound:
        tags.append('compound')
    else:
        tags.append('isolation')

    if placement == 'opener':
        tags.append('main_lift')
    elif placement == 'mid':
        tags.append('accessory')
    elif placement == 'finisher':
        tags.append('finisher')
    elif placement == 'warm_up':
        tags.append('warm_up')
    else:
        tags.append('general')

    return tags


@dataclass(frozen=True)
class CanonicalExercise:
    exercise_id: str
    name: str
    family_id: str = ''
    family_name: str = ''
    variant_label: str = ''
    aliases: List[str] = field(default_factory=list)
    primary_muscles: List[str] = field(default_factory=list)
    secondary_muscles: List[str] = field(default_factory=list)
    compound: bool = False
    pattern: str = 'isolation'
    equipment: List[str] = field(default_factory=list)
    fatigue: str = 'medium'
    min_level: str = 'beginner'
    placement: str = 'mid'
    alternatives: List[str] = field(default_factory=list)
    attachments: List[str] = field(default_factory=list)
    thumbnail_url: str = ''
    detail_image_url: str = ''
    form_cues: List[str] = field(default_factory=list)
    tips: List[str] = field(default_factory=list)
    strategy_tags: List[str] = field(default_factory=list)

    @property
    def id(self) -> str:
        return self.exercise_id

    @property
    def primary(self) -> str:
        return self.primary_muscles[0] if self.primary_muscles else 'general'

    @property
    def secondary(self) -> List[str]:
        return self.secondary_muscles

    @property
    def substitutes(self) -> List[str]:
        return self.alternatives

    def to_record(self) -> Dict[str, Any]:
        return {
            'exerciseId': self.exercise_id,
            'name': self.name,
            'familyId': self.family_id or self.exercise_id,
            'familyName': self.family_name or self.name,
            'variantLabel': self.variant_label,
            'aliases': list(self.aliases),
            'primaryMuscles': list(self.primary_muscles),
            'secondaryMuscles': list(self.secondary_muscles),
            'compound': self.compound,
            'pattern': self.pattern,
            'equipment': list(self.equipment),
            'fatigue': self.fatigue,
            'minLevel': self.min_level,
            'placement': self.placement,
            'alternatives': list(self.alternatives),
            'attachments': list(self.attachments),
            'thumbnailUrl': self.thumbnail_url,
            'detailImageUrl': self.detail_image_url,
            'formCues': list(self.form_cues),
            'tips': list(self.tips),
            'strategyTags': list(self.strategy_tags),
        }

    def to_dict(self) -> Dict[str, Any]:
        return self.to_record()

    @classmethod
    def from_record(cls, record: Dict[str, Any]) -> 'CanonicalExercise':
        return build_canonical_exercise(record)


def build_canonical_exercise(record: Dict[str, Any]) -> CanonicalExercise:
    exercise_id = _normalize_text(record.get('exerciseId') or record.get('id'))
    if not exercise_id:
        raise ValueError('exerciseId is required')

    name = _normalize_text(record.get('name')) or exercise_id.replace('_', ' ').title()
    family_id = _normalize_text(record.get('familyId')) or exercise_id
    family_name = _normalize_text(record.get('familyName')) or name
    variant_label = _normalize_text(record.get('variantLabel'))

    aliases = _normalize_string_list(record.get('aliases'))
    primary_muscles = _normalize_string_list(
        record.get('primaryMuscles') or record.get('primary'),
        slug=True,
    )
    if not primary_muscles:
        # Default keeps seed validation lenient for future bulk imports while still producing a usable record.
        primary_muscles = ['general']

    secondary_muscles = _normalize_string_list(
        record.get('secondaryMuscles') or record.get('secondary'),
        slug=True,
    )
    compound = bool(record.get('compound', False))

    pattern = _normalize_slug(record.get('pattern')) or 'isolation'

    equipment = _normalize_string_list(record.get('equipment'), slug=True)
    if not equipment:
        # Default avoids invalid records during early content expansion; machine is the safest generic fallback.
        equipment = ['machine']

    fatigue = _normalize_slug(record.get('fatigue')) or 'medium'
    min_level = _normalize_slug(record.get('minLevel') or record.get('min_level')) or 'beginner'
    placement = _normalize_slug(record.get('placement')) or 'mid'
    alternatives = _normalize_string_list(
        record.get('alternatives') or record.get('substitutes'),
    )
    attachments = _normalize_string_list(record.get('attachments'), tag=True)
    thumbnail_url = _normalize_text(record.get('thumbnailUrl'))
    detail_image_url = _normalize_text(record.get('detailImageUrl'))
    form_cues = _normalize_string_list(record.get('formCues') or record.get('form_cues'))
    tips = _normalize_string_list(record.get('tips')) or list(form_cues)

    strategy_tags = _normalize_string_list(record.get('strategyTags'), tag=True)
    if not strategy_tags:
        # Default tags preserve useful metadata for filtering without forcing every seed record to spell them out.
        strategy_tags = _default_strategy_tags(compound, placement)

    return CanonicalExercise(
        exercise_id=exercise_id,
        name=name,
        family_id=family_id,
        family_name=family_name,
        variant_label=variant_label,
        aliases=aliases,
        primary_muscles=primary_muscles,
        secondary_muscles=secondary_muscles,
        compound=compound,
        pattern=pattern,
        equipment=equipment,
        fatigue=fatigue,
        min_level=min_level,
        placement=placement,
        alternatives=alternatives,
        attachments=attachments,
        thumbnail_url=thumbnail_url,
        detail_image_url=detail_image_url,
        form_cues=form_cues,
        tips=tips,
        strategy_tags=strategy_tags,
    )
