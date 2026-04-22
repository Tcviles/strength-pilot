import type { Goal, Workout } from '../types/app';

export type GuestWorkoutCategory =
  | 'push'
  | 'pull'
  | 'legs'
  | 'upper_body'
  | 'lower_body'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'abs'
  | 'full_body';

type GuestWorkoutTemplate = {
  title: string;
  goal: Goal;
  durationMinutes: number;
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: string;
    restSeconds: number;
  }>;
};

export const GUEST_WORKOUT_CATEGORIES: Array<{
  id: GuestWorkoutCategory;
  title: string;
  detail: string;
}> = [
  { id: 'push', title: 'Push', detail: 'Chest, shoulders, and triceps' },
  { id: 'pull', title: 'Pull', detail: 'Back, rear delts, and biceps' },
  { id: 'legs', title: 'Legs', detail: 'Quads, glutes, hams, and calves' },
  { id: 'upper_body', title: 'Upper Body', detail: 'Balanced upper session' },
  { id: 'lower_body', title: 'Lower Body', detail: 'Lower body strength and volume' },
  { id: 'chest', title: 'Chest', detail: 'Chest-focused push session' },
  { id: 'back', title: 'Back', detail: 'Back thickness and width' },
  { id: 'shoulders', title: 'Shoulders', detail: 'Pressing and delt isolation' },
  { id: 'arms', title: 'Arms', detail: 'Biceps and triceps pump day' },
  { id: 'abs', title: 'Abs', detail: 'Core circuit and trunk work' },
  { id: 'full_body', title: 'Full Body', detail: 'Simple total-body session' },
];

const GUEST_WORKOUT_TEMPLATES: Record<GuestWorkoutCategory, GuestWorkoutTemplate> = {
  push: {
    title: 'Push Session',
    goal: 'hypertrophy',
    durationMinutes: 55,
    exercises: [
      { exerciseId: 'bb_bench_press', targetSets: 3, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'incline_db_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'ohp', targetSets: 3, targetReps: '6-8', restSeconds: 105 },
      { exerciseId: 'lateral_raise', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'tricep_pushdown', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
    ],
  },
  pull: {
    title: 'Pull Session',
    goal: 'hypertrophy',
    durationMinutes: 55,
    exercises: [
      { exerciseId: 'pull_up', targetSets: 3, targetReps: '6-10', restSeconds: 105 },
      { exerciseId: 'barbell_row', targetSets: 3, targetReps: '8-10', restSeconds: 105 },
      { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'hammer_curl', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
    ],
  },
  legs: {
    title: 'Leg Day',
    goal: 'strength',
    durationMinutes: 60,
    exercises: [
      { exerciseId: 'back_squat', targetSets: 4, targetReps: '5-6', restSeconds: 150 },
      { exerciseId: 'rdl', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
      { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
      { exerciseId: 'leg_curl', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
      { exerciseId: 'standing_calf_raise', targetSets: 3, targetReps: '12-18', restSeconds: 45 },
    ],
  },
  upper_body: {
    title: 'Upper Body',
    goal: 'general',
    durationMinutes: 55,
    exercises: [
      { exerciseId: 'bb_bench_press', targetSets: 3, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'barbell_row', targetSets: 3, targetReps: '8-10', restSeconds: 105 },
      { exerciseId: 'ohp', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'tricep_pushdown', targetSets: 2, targetReps: '10-14', restSeconds: 60 },
      { exerciseId: 'db_curl', targetSets: 2, targetReps: '10-14', restSeconds: 60 },
    ],
  },
  lower_body: {
    title: 'Lower Body',
    goal: 'general',
    durationMinutes: 55,
    exercises: [
      { exerciseId: 'front_squat', targetSets: 3, targetReps: '5-6', restSeconds: 135 },
      { exerciseId: 'rdl', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
      { exerciseId: 'hack_squat', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
      { exerciseId: 'leg_curl', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
      { exerciseId: 'seated_calf_raise', targetSets: 3, targetReps: '12-18', restSeconds: 45 },
    ],
  },
  chest: {
    title: 'Chest Focus',
    goal: 'hypertrophy',
    durationMinutes: 50,
    exercises: [
      { exerciseId: 'bb_bench_press', targetSets: 3, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'incline_db_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'machine_chest_press', targetSets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'cable_fly', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
      { exerciseId: 'push_up', targetSets: 2, targetReps: '12-20', restSeconds: 45 },
    ],
  },
  back: {
    title: 'Back Focus',
    goal: 'hypertrophy',
    durationMinutes: 50,
    exercises: [
      { exerciseId: 'deadlift', targetSets: 3, targetReps: '4-6', restSeconds: 150 },
      { exerciseId: 'pull_up', targetSets: 3, targetReps: '6-10', restSeconds: 105 },
      { exerciseId: 'barbell_row', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'face_pull', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
    ],
  },
  shoulders: {
    title: 'Shoulders',
    goal: 'hypertrophy',
    durationMinutes: 45,
    exercises: [
      { exerciseId: 'ohp', targetSets: 3, targetReps: '6-8', restSeconds: 105 },
      { exerciseId: 'db_shoulder_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'lateral_raise', targetSets: 4, targetReps: '12-15', restSeconds: 45 },
      { exerciseId: 'rear_delt_fly', targetSets: 3, targetReps: '12-15', restSeconds: 45 },
      { exerciseId: 'face_pull', targetSets: 3, targetReps: '12-15', restSeconds: 45 },
    ],
  },
  arms: {
    title: 'Arms',
    goal: 'hypertrophy',
    durationMinutes: 45,
    exercises: [
      { exerciseId: 'close_grip_bench', targetSets: 3, targetReps: '6-8', restSeconds: 105 },
      { exerciseId: 'tricep_pushdown', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
      { exerciseId: 'overhead_tricep_ext', targetSets: 3, targetReps: '10-14', restSeconds: 60 },
      { exerciseId: 'bb_curl', targetSets: 3, targetReps: '8-10', restSeconds: 60 },
      { exerciseId: 'hammer_curl', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
    ],
  },
  abs: {
    title: 'Abs',
    goal: 'general',
    durationMinutes: 30,
    exercises: [
      { exerciseId: 'plank', targetSets: 3, targetReps: '45-60', restSeconds: 45 },
      { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '10-15', restSeconds: 45 },
      { exerciseId: 'cable_crunch', targetSets: 3, targetReps: '12-18', restSeconds: 45 },
    ],
  },
  full_body: {
    title: 'Full Body',
    goal: 'general',
    durationMinutes: 60,
    exercises: [
      { exerciseId: 'back_squat', targetSets: 3, targetReps: '5-6', restSeconds: 135 },
      { exerciseId: 'bb_bench_press', targetSets: 3, targetReps: '6-8', restSeconds: 120 },
      { exerciseId: 'barbell_row', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
      { exerciseId: 'rdl', targetSets: 3, targetReps: '8-10', restSeconds: 105 },
      { exerciseId: 'db_shoulder_press', targetSets: 2, targetReps: '10-12', restSeconds: 75 },
      { exerciseId: 'cable_crunch', targetSets: 2, targetReps: '12-18', restSeconds: 45 },
    ],
  },
};

export function buildGuestWorkout(category: GuestWorkoutCategory): { workout: Workout; focus: string; title: string } {
  const template = GUEST_WORKOUT_TEMPLATES[category];

  return {
    focus: category,
    title: template.title,
    workout: {
      workoutId: `guest-${category}-${Date.now()}`,
      goal: template.goal,
      durationMinutes: template.durationMinutes,
      exercises: template.exercises.map((exercise) => ({
        ...exercise,
        sets: [],
      })),
    },
  };
}
