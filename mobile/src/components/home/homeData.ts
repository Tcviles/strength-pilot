export type HomeMode = 'guest' | 'signedIn';

export type WorkoutOption = {
  key: string;
  label: string;
  detail: string;
  emphasis?: string;
};

export type HomeTemplateCard = {
  key: string;
  label: string;
  image: any;
  exerciseCount: number;
  durationMinutes: number;
};

export const WORKOUT_OPTIONS: WorkoutOption[] = [
  { key: 'push', label: 'Push', detail: 'Chest, shoulders, and triceps' },
  { key: 'pull', label: 'Pull', detail: 'Back, rear delts, and biceps' },
  { key: 'legs', label: 'Legs', detail: 'Quads, glutes, and hamstrings', emphasis: 'Isolation' },
  { key: 'upper_body', label: 'Upper Body', detail: 'Balanced upper session' },
  { key: 'lower_body', label: 'Lower Body', detail: 'Squat, hinge, and accessories', emphasis: 'Compound' },
  { key: 'chest', label: 'Chest', detail: 'Pressing and fly variations' },
  { key: 'back', label: 'Back', detail: 'Rows, pulldowns, and hinges' },
  { key: 'shoulders', label: 'Shoulders', detail: 'Presses, raises, and rear delts' },
  { key: 'arms', label: 'Arms', detail: 'Biceps and triceps pump work' },
  { key: 'abs', label: 'Abs', detail: 'Core-focused finisher day' },
  { key: 'full_body', label: 'Full Body', detail: 'One-session full sweep' },
];

export const WORKOUT_THUMBNAILS = {
  abs: require('../../media/WorkoutThumbnails/AbHighlight.png'),
  arms: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  push: require('../../media/WorkoutThumbnails/PushHighlight.png'),
  pull: require('../../media/WorkoutThumbnails/PullHighlight.png'),
  chest: require('../../media/WorkoutThumbnails/ChestHighlight.png'),
  back: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  full_body: require('../../media/WorkoutThumbnails/FullBodyHighlight.png'),
  legs: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  lower_body: require('../../media/WorkoutThumbnails/LowerHighlight.png'),
  upper_body: require('../../media/WorkoutThumbnails/UpperHighlight.png'),
  shoulders: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
} as const;

function estimateExerciseCount(sessionLength: number) {
  if (sessionLength <= 30) {
    return 4;
  }
  if (sessionLength <= 45) {
    return 5;
  }
  if (sessionLength <= 60) {
    return 6;
  }
  return 8;
}

export function buildAiTemplateCards(sessionLength: number): HomeTemplateCard[] {
  return WORKOUT_OPTIONS.slice(0, 3).map((option) => ({
    key: option.key,
    label: `${option.label} Day`,
    image: WORKOUT_THUMBNAILS[option.key as keyof typeof WORKOUT_THUMBNAILS],
    exerciseCount: estimateExerciseCount(sessionLength),
    durationMinutes: sessionLength,
  }));
}

export const CUSTOM_TEMPLATE_CARDS: HomeTemplateCard[] = [
  { key: 'custom_push', label: 'Custom Push', image: WORKOUT_THUMBNAILS.push, exerciseCount: 6, durationMinutes: 52 },
  { key: 'custom_pull', label: 'Upper Pull', image: WORKOUT_THUMBNAILS.pull, exerciseCount: 6, durationMinutes: 58 },
  { key: 'custom_legs', label: 'Leg Builder', image: WORKOUT_THUMBNAILS.legs, exerciseCount: 6, durationMinutes: 61 },
];
