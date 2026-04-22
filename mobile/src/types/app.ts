export type Goal = 'strength' | 'hypertrophy' | 'fat_loss' | 'general';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type GymType = 'commercial' | 'home' | 'hotel';
export type Crowd = 'low' | 'medium' | 'high';
export type SplitPreference = 'auto' | 'full_body' | 'split';

export type Tokens = {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
};

export type Profile = {
  userId?: string;
  email?: string;
  firstName?: string;
  goal: Goal;
  experience: Experience;
  splitPreference: SplitPreference;
  daysPerWeek: number;
  sessionLength: number;
  activeGymId: string;
  painAreas: string[];
  permanentLimitations: string[];
};

export type Gym = {
  userId?: string;
  gymId: string;
  name: string;
  type: GymType;
  equipment: Record<string, boolean>;
  dumbbellMax: number;
  hasSmith: boolean;
  hasHackSquat: boolean;
  notes: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  sets: Array<{
    setNumber: number;
    weight: number;
    reps: number;
    rir?: number;
    completedAt: string;
  }>;
};

export type WorkoutSetProgress = {
  setNumber: number;
  suggestedWeight: number;
  suggestedReps: number;
  actualWeight: string;
  actualReps: string;
  completed: boolean;
  completedAt?: string;
  feedbackScore?: number;
  feedbackDismissed?: boolean;
};

export type WorkoutExerciseProgress = {
  exerciseId: string;
  setProgress: WorkoutSetProgress[];
};

export type Workout = {
  workoutId: string;
  goal: Goal;
  durationMinutes: number;
  mood?: string;
  gymCrowdedness?: Crowd;
  limitedTime?: boolean;
  exercises: WorkoutExercise[];
};

export type Palette = {
  page: string;
  panel: string;
  card: string;
  input: string;
  badge: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  placeholder: string;
  line: string;
  error: string;
  buttonText: string;
  buttonDisabled: string;
};
