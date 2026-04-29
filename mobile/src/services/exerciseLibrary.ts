import { publicApiRequest } from './api';

export type ExerciseApiRecord = {
  exerciseId: string;
  name: string;
  familyId?: string;
  familyName?: string;
  variantLabel?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  tips: string[];
  alternatives: string[];
  attachments?: string[];
};

type ExerciseLibraryAlternative = {
  exerciseId: string;
  name: string;
  displayName?: string;
  equipment: string;
};

export type ExerciseLibraryVariant = {
  exerciseId: string;
  name: string;
  familyId: string;
  familyName: string;
  variantLabel: string;
  displayName: string;
  equipment: string;
  attachments: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tips: string[];
  alternatives: ExerciseLibraryAlternative[];
};

export type ExerciseLibraryFamily = ExerciseLibraryVariant & {
  variants: ExerciseLibraryVariant[];
};

function titleize(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function mapExerciseApiToVariants(exercises: ExerciseApiRecord[]): ExerciseLibraryVariant[] {
  const byId = new Map(exercises.map((exercise) => [exercise.exerciseId, exercise]));

  return exercises
    .map((exercise) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      familyId: exercise.familyId || exercise.exerciseId,
      familyName: exercise.familyName || exercise.name,
      variantLabel: exercise.variantLabel || '',
      displayName: exercise.variantLabel
        ? `${exercise.familyName || exercise.name} (${exercise.variantLabel})`
        : exercise.familyName || exercise.name,
      equipment: titleize(exercise.equipment[0] || 'machine'),
      attachments: (exercise.attachments || []).map(titleize),
      primaryMuscles: exercise.primaryMuscles.map(titleize),
      secondaryMuscles: exercise.secondaryMuscles.map(titleize),
      tips: exercise.tips,
      alternatives: exercise.alternatives.map((alternativeId) => {
        const alternative = byId.get(alternativeId);
        return {
          exerciseId: alternativeId,
          name: alternative?.familyName || alternative?.name || titleize(alternativeId),
          displayName: alternative?.variantLabel
            ? `${alternative.familyName || alternative.name} (${alternative.variantLabel})`
            : alternative?.familyName || alternative?.name || titleize(alternativeId),
          equipment: titleize(alternative?.equipment?.[0] || 'machine'),
        };
      }),
    }))
    .sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
}

export function mapVariantsToFamilies(variants: ExerciseLibraryVariant[]): ExerciseLibraryFamily[] {
  const families = new Map<string, ExerciseLibraryVariant[]>();
  variants.forEach((exercise) => {
    const key = exercise.familyId || exercise.exerciseId;
    const group = families.get(key) || [];
    group.push(exercise);
    families.set(key, group);
  });

  return Array.from(families.values())
    .map((familyVariants) => {
      const sortedVariants = [...familyVariants].sort((left, right) => {
        if (!left.variantLabel && right.variantLabel) {
          return -1;
        }
        if (left.variantLabel && !right.variantLabel) {
          return 1;
        }
        return (left.variantLabel || left.equipment).localeCompare(right.variantLabel || right.equipment);
      });
      const representative = sortedVariants[0];
      return {
        ...representative,
        name: representative.familyName || representative.name,
        variants: sortedVariants,
      };
    })
    .sort((a, b) => (a.familyName || a.name).localeCompare(b.familyName || b.name));
}

export async function fetchExerciseLibraryVariants() {
  const payload = await publicApiRequest<{ exercises: ExerciseApiRecord[] }>('/exercises');
  return mapExerciseApiToVariants(payload.exercises);
}

export async function fetchExerciseLibraryFamilies() {
  const variants = await fetchExerciseLibraryVariants();
  return mapVariantsToFamilies(variants);
}
