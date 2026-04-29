import type { Experience } from '../types/app';

const EXERCISE_NAMES: Record<string, string> = {
  bb_bench_press: 'Barbell Bench Press',
  db_bench_press: 'Dumbbell Bench Press',
  incline_db_press: 'Incline Dumbbell Press',
  machine_chest_press: 'Machine Chest Press',
  cable_fly: 'Cable Chest Fly',
  push_up: 'Push-Up',
  deadlift: 'Barbell Deadlift',
  pull_up: 'Pull-Up',
  lat_pulldown: 'Lat Pulldown',
  barbell_row: 'Barbell Row',
  db_row: 'Dumbbell Row',
  seated_cable_row: 'Seated Cable Row',
  face_pull: 'Face Pull',
  ohp: 'Overhead Press',
  db_shoulder_press: 'Dumbbell Shoulder Press',
  lateral_raise: 'Lateral Raise',
  rear_delt_fly: 'Rear Delt Fly',
  bb_curl: 'Barbell Curl',
  db_curl: 'Dumbbell Curl',
  hammer_curl: 'Hammer Curl',
  tricep_pushdown: 'Cable Tricep Pushdown',
  overhead_tricep_ext: 'Overhead Tricep Extension',
  close_grip_bench: 'Close-Grip Bench Press',
  back_squat: 'Barbell Back Squat',
  front_squat: 'Barbell Front Squat',
  leg_press: 'Leg Press',
  hack_squat: 'Hack Squat',
  bulgarian_split_squat: 'Bulgarian Split Squat',
  rdl: 'Romanian Deadlift',
  leg_curl: 'Leg Curl',
  hip_thrust: 'Barbell Hip Thrust',
  standing_calf_raise: 'Standing Calf Raise',
  seated_calf_raise: 'Seated Calf Raise',
  plank: 'Plank',
  hanging_leg_raise: 'Hanging Leg Raise',
  cable_crunch: 'Cable Crunch',
};

type ExerciseMeta = {
  equipment: string;
  compound: boolean;
  baseWeight: number;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tips: string[];
  alternatives: string[];
};

type ExerciseFamilyMeta = {
  familyId: string;
  familyName: string;
  variantLabel?: string;
};

const DEFAULT_META: ExerciseMeta = {
  equipment: 'Machine',
  compound: false,
  baseWeight: 70,
  primaryMuscles: ['Target muscle group'],
  secondaryMuscles: ['Stabilizers'],
  tips: [
    'Move with control and own the bottom position.',
    'Keep your torso braced and finish each rep cleanly.',
    'Use the prescribed tempo instead of chasing momentum.',
  ],
  alternatives: [],
};

const EXERCISE_FAMILY_META: Record<string, ExerciseFamilyMeta> = {
  bb_bench_press: { familyId: 'bench_press', familyName: 'Bench Press', variantLabel: 'Barbell' },
  db_bench_press: { familyId: 'bench_press', familyName: 'Bench Press', variantLabel: 'Dumbbell' },
  incline_db_press: { familyId: 'incline_press', familyName: 'Incline Press', variantLabel: 'Dumbbell' },
  cable_fly: { familyId: 'chest_fly', familyName: 'Chest Fly', variantLabel: 'Cable' },
  pull_up: { familyId: 'pull_up', familyName: 'Pull-Up', variantLabel: 'Bodyweight' },
  ohp: { familyId: 'shoulder_press', familyName: 'Shoulder Press', variantLabel: 'Barbell' },
  db_shoulder_press: { familyId: 'shoulder_press', familyName: 'Shoulder Press', variantLabel: 'Dumbbell' },
  lateral_raise: { familyId: 'lateral_raise', familyName: 'Lateral Raise', variantLabel: 'Dumbbell' },
  bb_curl: { familyId: 'curl', familyName: 'Curl', variantLabel: 'Barbell' },
  db_curl: { familyId: 'curl', familyName: 'Curl', variantLabel: 'Dumbbell' },
  hammer_curl: { familyId: 'hammer_curl', familyName: 'Hammer Curl', variantLabel: 'Dumbbell' },
  standing_calf_raise: { familyId: 'calf_raise', familyName: 'Calf Raise', variantLabel: 'Standing' },
  seated_calf_raise: { familyId: 'calf_raise', familyName: 'Calf Raise', variantLabel: 'Seated' },
};

const EXERCISE_META: Record<string, ExerciseMeta> = {
  bb_bench_press: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 135,
    primaryMuscles: ['Chest', 'Front delts'],
    secondaryMuscles: ['Triceps', 'Upper back'],
    tips: [
      'Set your upper back first and press from a stable base.',
      'Touch low on the chest and drive back toward the rack.',
      'Keep your wrists stacked over your elbows.',
    ],
    alternatives: ['db_bench_press', 'machine_chest_press'],
  },
  deadlift: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 185,
    primaryMuscles: ['Glutes', 'Hamstrings'],
    secondaryMuscles: ['Lats', 'Spinal erectors'],
    tips: [
      'Wedge yourself into the bar before you break the floor.',
      'Keep the bar close and push the floor away.',
      'Finish tall without leaning back.',
    ],
    alternatives: ['rdl', 'hip_thrust'],
  },
  ohp: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 85,
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper chest'],
    tips: [
      'Squeeze your glutes and ribs down before each rep.',
      'Press straight up and move your head through at lockout.',
      'Avoid turning it into a standing incline press.',
    ],
    alternatives: ['db_shoulder_press', 'machine_chest_press'],
  },
  back_squat: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 185,
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Adductors', 'Core'],
    tips: [
      'Brace before you descend and keep the bar over mid-foot.',
      'Drive your traps into the bar as you stand.',
      'Let your knees and hips break together.',
    ],
    alternatives: ['front_squat', 'hack_squat'],
  },
  front_squat: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 135,
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Upper back', 'Core'],
    tips: [
      'Keep your elbows high to hold the rack position.',
      'Stay tall and let the knees travel forward naturally.',
      'Drive straight up instead of folding over.',
    ],
    alternatives: ['back_squat', 'leg_press'],
  },
  leg_press: {
    equipment: 'Machine',
    compound: true,
    baseWeight: 270,
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings'],
    tips: [
      'Control the lowering phase and avoid bouncing the sled.',
      'Keep your lower back pinned to the pad.',
      'Drive through the full foot instead of just the toes.',
    ],
    alternatives: ['hack_squat', 'back_squat'],
  },
  hack_squat: {
    equipment: 'Machine',
    compound: true,
    baseWeight: 180,
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    tips: [
      'Stay locked into the pad and let the knees travel forward.',
      'Lower under control and keep tension through the bottom.',
      'Drive up through the mid-foot.',
    ],
    alternatives: ['leg_press', 'back_squat'],
  },
  bulgarian_split_squat: {
    equipment: 'Dumbbell',
    compound: true,
    baseWeight: 35,
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Adductors', 'Core'],
    tips: [
      'Stay tall and let the front leg do the work.',
      'Reach the back leg only as far as you can control.',
      'Use a smooth touch-and-go rhythm.',
    ],
    alternatives: ['back_squat', 'leg_press'],
  },
  rdl: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 155,
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lats', 'Spinal erectors'],
    tips: [
      'Push the hips back and keep the bar grazing the thighs.',
      'Stop when hamstring tension is maxed, not when the plates touch.',
      'Stay long through the spine.',
    ],
    alternatives: ['deadlift', 'hip_thrust'],
  },
  hip_thrust: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 185,
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    tips: [
      'Tuck the ribs slightly and finish with the glutes, not the low back.',
      'Pause at lockout for a clean contraction.',
      'Keep your chin tucked and eyes forward.',
    ],
    alternatives: ['rdl', 'back_squat'],
  },
  pull_up: {
    equipment: 'Bodyweight',
    compound: true,
    baseWeight: 0,
    primaryMuscles: ['Lats', 'Upper back'],
    secondaryMuscles: ['Biceps', 'Core'],
    tips: [
      'Start from a dead hang and drive the elbows down.',
      'Keep your ribs tucked so it stays a pull, not a swing.',
      'Own the lowering phase.',
    ],
    alternatives: ['lat_pulldown', 'seated_cable_row'],
  },
  lat_pulldown: {
    equipment: 'Machine',
    compound: true,
    baseWeight: 100,
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps', 'Mid back'],
    tips: [
      'Pull the bar to the upper chest and keep the chest proud.',
      'Drive elbows into your back pockets.',
      'Avoid turning the first third of the rep into a lean-back row.',
    ],
    alternatives: ['pull_up', 'seated_cable_row'],
  },
  barbell_row: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 115,
    primaryMuscles: ['Mid back', 'Lats'],
    secondaryMuscles: ['Rear delts', 'Biceps'],
    tips: [
      'Own your torso angle before you start rowing.',
      'Drive elbows back instead of yanking with the hands.',
      'Keep the bar close and the brace locked in.',
    ],
    alternatives: ['db_row', 'seated_cable_row'],
  },
  db_row: {
    equipment: 'Dumbbell',
    compound: true,
    baseWeight: 60,
    primaryMuscles: ['Lats', 'Mid back'],
    secondaryMuscles: ['Biceps', 'Rear delts'],
    tips: [
      'Brace hard through the support arm.',
      'Pull the elbow toward the hip for a lat bias.',
      'Pause briefly at the top instead of twisting through the torso.',
    ],
    alternatives: ['barbell_row', 'seated_cable_row'],
  },
  seated_cable_row: {
    equipment: 'Machine',
    compound: true,
    baseWeight: 100,
    primaryMuscles: ['Mid back', 'Lats'],
    secondaryMuscles: ['Rear delts', 'Biceps'],
    tips: [
      'Pull your elbows back, squeezing your shoulder blades together.',
      'Keep your chest up and avoid rounding your back.',
      'Control the movement and squeeze at the peak.',
    ],
    alternatives: ['lat_pulldown', 'db_row'],
  },
  machine_chest_press: {
    equipment: 'Machine',
    compound: true,
    baseWeight: 110,
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front delts', 'Triceps'],
    tips: [
      'Set the seat height so your hands press from mid-chest.',
      'Keep shoulder blades pinned down and back.',
      'Finish each rep without smashing the stack.',
    ],
    alternatives: ['bb_bench_press', 'db_bench_press'],
  },
  db_bench_press: {
    equipment: 'Dumbbell',
    compound: true,
    baseWeight: 55,
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front delts', 'Triceps'],
    tips: [
      'Lower with control and keep the elbows stacked under the wrists.',
      'Let the dumbbells travel naturally instead of forcing a bar path.',
      'Press back toward the shoulders at lockout.',
    ],
    alternatives: ['bb_bench_press', 'machine_chest_press'],
  },
  incline_db_press: {
    equipment: 'Dumbbell',
    compound: true,
    baseWeight: 45,
    primaryMuscles: ['Upper chest'],
    secondaryMuscles: ['Front delts', 'Triceps'],
    tips: [
      'Use a moderate incline to keep the upper chest loaded.',
      'Keep the shoulders down as you press.',
      'Press through a smooth arc, not straight forward.',
    ],
    alternatives: ['db_bench_press', 'machine_chest_press'],
  },
  close_grip_bench: {
    equipment: 'Barbell',
    compound: true,
    baseWeight: 115,
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest', 'Front delts'],
    tips: [
      'Tuck the elbows enough to keep the triceps loaded.',
      'Use a close grip, not a hands-touching grip.',
      'Press with the same upper-back tightness as a normal bench.',
    ],
    alternatives: ['tricep_pushdown', 'overhead_tricep_ext'],
  },
  db_shoulder_press: {
    equipment: 'Dumbbell',
    compound: true,
    baseWeight: 40,
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper chest'],
    tips: [
      'Keep your forearms vertical throughout the press.',
      'Avoid flaring too wide or tucking too narrow.',
      'Own the last third of the lowering phase.',
    ],
    alternatives: ['ohp', 'machine_chest_press'],
  },
  lateral_raise: {
    equipment: 'Dumbbell',
    compound: false,
    baseWeight: 15,
    primaryMuscles: ['Lateral delts'],
    secondaryMuscles: ['Upper traps'],
    tips: [
      'Lead with the elbows and stop before momentum takes over.',
      'Keep a soft bend in the elbows.',
      'Think wide, not high.',
    ],
    alternatives: ['rear_delt_fly', 'db_shoulder_press'],
  },
  rear_delt_fly: {
    equipment: 'Dumbbell',
    compound: false,
    baseWeight: 15,
    primaryMuscles: ['Rear delts'],
    secondaryMuscles: ['Mid back'],
    tips: [
      'Keep the torso fixed and sweep the arms wide.',
      'Think of spreading the room apart with your hands.',
      'Control the top instead of bouncing.',
    ],
    alternatives: ['face_pull', 'lateral_raise'],
  },
  face_pull: {
    equipment: 'Cable',
    compound: false,
    baseWeight: 50,
    primaryMuscles: ['Rear delts', 'Upper back'],
    secondaryMuscles: ['Rotator cuff'],
    tips: [
      'Pull toward the face with elbows high.',
      'Finish with hands slightly outside the temples.',
      'Use a rope length that lets the shoulders move freely.',
    ],
    alternatives: ['rear_delt_fly', 'seated_cable_row'],
  },
  bb_curl: {
    equipment: 'Barbell',
    compound: false,
    baseWeight: 50,
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    tips: [
      'Keep elbows quiet and squeeze hard at the top.',
      'Avoid using a hip pop to start the rep.',
      'Lower slower than you lift.',
    ],
    alternatives: ['db_curl', 'hammer_curl'],
  },
  db_curl: {
    equipment: 'Dumbbell',
    compound: false,
    baseWeight: 25,
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    tips: [
      'Let the dumbbell fully lengthen the biceps at the bottom.',
      'Turn the pinky slightly up as you curl.',
      'Control both arms independently.',
    ],
    alternatives: ['bb_curl', 'hammer_curl'],
  },
  hammer_curl: {
    equipment: 'Dumbbell',
    compound: false,
    baseWeight: 30,
    primaryMuscles: ['Brachialis', 'Biceps'],
    secondaryMuscles: ['Forearms'],
    tips: [
      'Keep the wrist neutral and elbows pinned.',
      'Curl up in a straight line instead of across the body.',
      'Pause just short of the shoulder.',
    ],
    alternatives: ['db_curl', 'bb_curl'],
  },
  tricep_pushdown: {
    equipment: 'Cable',
    compound: false,
    baseWeight: 60,
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    tips: [
      'Pin the elbows and press through the palm.',
      'Finish by fully extending without rolling the shoulders forward.',
      'Let the rope separate at the bottom if available.',
    ],
    alternatives: ['overhead_tricep_ext', 'close_grip_bench'],
  },
  overhead_tricep_ext: {
    equipment: 'Cable',
    compound: false,
    baseWeight: 45,
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    tips: [
      'Keep elbows pointed forward and stable.',
      'Stay tall and let the long head stretch at the bottom.',
      'Avoid arching just to get the handle overhead.',
    ],
    alternatives: ['tricep_pushdown', 'close_grip_bench'],
  },
  leg_curl: {
    equipment: 'Machine',
    compound: false,
    baseWeight: 85,
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    tips: [
      'Curl under control and pause briefly in the squeeze.',
      'Keep hips pinned to the pad.',
      'Avoid crashing the stack on the way down.',
    ],
    alternatives: ['rdl', 'hip_thrust'],
  },
  standing_calf_raise: {
    equipment: 'Machine',
    compound: false,
    baseWeight: 140,
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Foot stabilizers'],
    tips: [
      'Use full range and pause at the top.',
      'Lower until the calves are fully stretched.',
      'Stay centered over the big toe and second toe.',
    ],
    alternatives: ['seated_calf_raise'],
  },
  seated_calf_raise: {
    equipment: 'Machine',
    compound: false,
    baseWeight: 90,
    primaryMuscles: ['Soleus'],
    secondaryMuscles: ['Calves'],
    tips: [
      'Keep the shin vertical and move only through the ankle.',
      'Pause hard at the top.',
      'Use a patient stretch at the bottom.',
    ],
    alternatives: ['standing_calf_raise'],
  },
  plank: {
    equipment: 'Bodyweight',
    compound: false,
    baseWeight: 0,
    primaryMuscles: ['Abs', 'Obliques'],
    secondaryMuscles: ['Glutes', 'Serratus'],
    tips: [
      'Brace like someone is about to punch you.',
      'Keep the glutes engaged and ribs tucked.',
      'Make it a hard short set, not a loose long one.',
    ],
    alternatives: ['cable_crunch', 'hanging_leg_raise'],
  },
  hanging_leg_raise: {
    equipment: 'Bodyweight',
    compound: false,
    baseWeight: 0,
    primaryMuscles: ['Abs', 'Hip flexors'],
    secondaryMuscles: ['Grip', 'Lats'],
    tips: [
      'Posteriorly tilt the pelvis as the legs rise.',
      'Avoid swinging between reps.',
      'Exhale hard at the top.',
    ],
    alternatives: ['plank', 'cable_crunch'],
  },
  cable_crunch: {
    equipment: 'Cable',
    compound: false,
    baseWeight: 70,
    primaryMuscles: ['Abs'],
    secondaryMuscles: ['Obliques'],
    tips: [
      'Curl through the spine instead of hinging at the hips.',
      'Keep tension by staying slightly rounded between reps.',
      'Drive the rib cage toward the pelvis.',
    ],
    alternatives: ['plank', 'hanging_leg_raise'],
  },
  push_up: {
    equipment: 'Bodyweight',
    compound: true,
    baseWeight: 0,
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front delts'],
    tips: [
      'Keep the body straight from heels to head.',
      'Reach the floor with the chest, not the face.',
      'Push away hard at the top.',
    ],
    alternatives: ['bb_bench_press', 'db_bench_press'],
  },
  cable_fly: {
    equipment: 'Cable',
    compound: false,
    baseWeight: 35,
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front delts'],
    tips: [
      'Keep a soft elbow bend and hug the midline.',
      'Think about moving through the chest, not the hands.',
      'Control the stretch on the way back.',
    ],
    alternatives: ['machine_chest_press', 'db_bench_press'],
  },
};

const EXPERIENCE_MULTIPLIER: Record<Experience, number> = {
  beginner: 0.75,
  intermediate: 1,
  advanced: 1.2,
};

export function getExerciseMeta(exerciseId: string) {
  const meta = EXERCISE_META[exerciseId] || DEFAULT_META;
  const rawName = EXERCISE_NAMES[exerciseId] || exerciseId.replace(/_/g, ' ');
  const familyMeta = EXERCISE_FAMILY_META[exerciseId] || {
    familyId: exerciseId,
    familyName: rawName,
    variantLabel: '',
  };

  const variants = Object.keys(EXERCISE_NAMES)
    .filter((candidateId) => {
      const candidateRawName = EXERCISE_NAMES[candidateId] || candidateId.replace(/_/g, ' ');
      const candidateFamily = EXERCISE_FAMILY_META[candidateId] || {
        familyId: candidateId,
        familyName: candidateRawName,
        variantLabel: '',
      };
      return candidateFamily.familyId === familyMeta.familyId;
    })
    .sort((leftId, rightId) => {
      const leftMeta = EXERCISE_FAMILY_META[leftId];
      const rightMeta = EXERCISE_FAMILY_META[rightId];
      return (leftMeta?.variantLabel || '').localeCompare(rightMeta?.variantLabel || '');
    })
    .map((candidateId) => {
      const candidateMeta = EXERCISE_META[candidateId] || DEFAULT_META;
      const candidateRawName = EXERCISE_NAMES[candidateId] || candidateId.replace(/_/g, ' ');
      const candidateFamily = EXERCISE_FAMILY_META[candidateId] || {
        familyId: candidateId,
        familyName: candidateRawName,
        variantLabel: '',
      };

      return {
        exerciseId: candidateId,
        name: candidateRawName,
        displayName: candidateFamily.variantLabel
          ? `${candidateFamily.familyName} (${candidateFamily.variantLabel})`
          : candidateFamily.familyName,
        familyId: candidateFamily.familyId,
        familyName: candidateFamily.familyName,
        variantLabel: candidateFamily.variantLabel || '',
        equipment: candidateMeta.equipment,
        primaryMuscles: candidateMeta.primaryMuscles,
        secondaryMuscles: candidateMeta.secondaryMuscles,
        tips: candidateMeta.tips,
        alternatives: candidateMeta.alternatives.map((alternativeId) => {
          const alternativeName = EXERCISE_NAMES[alternativeId] || alternativeId.replace(/_/g, ' ');
          const alternativeFamily = EXERCISE_FAMILY_META[alternativeId] || {
            familyId: alternativeId,
            familyName: alternativeName,
            variantLabel: '',
          };
          return {
            exerciseId: alternativeId,
            name: alternativeFamily.familyName,
            displayName: alternativeFamily.variantLabel
              ? `${alternativeFamily.familyName} (${alternativeFamily.variantLabel})`
              : alternativeFamily.familyName,
            equipment: (EXERCISE_META[alternativeId] || DEFAULT_META).equipment,
          };
        }),
      };
    });

  return {
    name: rawName,
    displayName: familyMeta.variantLabel
      ? `${familyMeta.familyName} (${familyMeta.variantLabel})`
      : familyMeta.familyName,
    familyId: familyMeta.familyId,
    familyName: familyMeta.familyName,
    variantLabel: familyMeta.variantLabel || '',
    equipment: meta.equipment,
    compound: meta.compound,
    primaryMuscles: meta.primaryMuscles,
    secondaryMuscles: meta.secondaryMuscles,
    tips: meta.tips,
    variants,
    alternatives: meta.alternatives.map((alternativeId) => {
      const alternativeName = EXERCISE_NAMES[alternativeId] || alternativeId.replace(/_/g, ' ');
      const alternativeFamily = EXERCISE_FAMILY_META[alternativeId] || {
        familyId: alternativeId,
        familyName: alternativeName,
        variantLabel: '',
      };
      return {
        exerciseId: alternativeId,
        name: alternativeFamily.familyName,
        displayName: alternativeFamily.variantLabel
          ? `${alternativeFamily.familyName} (${alternativeFamily.variantLabel})`
          : alternativeFamily.familyName,
        equipment: (EXERCISE_META[alternativeId] || DEFAULT_META).equipment,
      };
    }),
  };
}

export function getSuggestedWeight(exerciseId: string, experience: Experience) {
  const meta = EXERCISE_META[exerciseId] || DEFAULT_META;
  const baseWeight = meta.baseWeight * EXPERIENCE_MULTIPLIER[experience];

  if (meta.baseWeight === 0) {
    return 0;
  }

  if (baseWeight < 20) {
    return Math.round(baseWeight / 5) * 5;
  }

  return Math.round(baseWeight / 5) * 5;
}

export function isCompoundExercise(exerciseId: string) {
  return (EXERCISE_META[exerciseId] || DEFAULT_META).compound;
}
