const MUSCLE_THUMBNAILS: Record<string, any> = {
  abs: require('../../media/WorkoutThumbnails/AbHighlight.png'),
  core: require('../../media/WorkoutThumbnails/AbHighlight.png'),
  arms: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  biceps: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  triceps: require('../../media/WorkoutThumbnails/ArmsHighlight.png'),
  chest: require('../../media/WorkoutThumbnails/ChestHighlight.png'),
  back: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  lats: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  upper_back: require('../../media/WorkoutThumbnails/BackHighlight.png'),
  shoulders: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
  front_delts: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
  side_delts: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
  rear_delts: require('../../media/WorkoutThumbnails/ShoulderHighlight.png'),
  legs: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  quads: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  glutes: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
  hamstrings: require('../../media/WorkoutThumbnails/LegsHighlight.png'),
};

export function formatClock(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatStartedAgo(startedAt: string, now: number) {
  const elapsedMinutes = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 60000));
  if (elapsedMinutes < 1) {
    return 'Started just now';
  }
  if (elapsedMinutes < 60) {
    return `Started ${elapsedMinutes}m ago`;
  }
  const hours = Math.floor(elapsedMinutes / 60);
  const minutes = elapsedMinutes % 60;
  if (minutes === 0) {
    return `Started ${hours}h ago`;
  }
  return `Started ${hours}h ${minutes}m ago`;
}

export function getThumbnailForExercise(primaryMuscles: string[]) {
  for (const muscle of primaryMuscles) {
    const key = muscle.trim().toLowerCase().replace(/\s+/g, '_');
    if (MUSCLE_THUMBNAILS[key]) {
      return MUSCLE_THUMBNAILS[key];
    }
  }

  return require('../../media/WorkoutThumbnails/FullBodyHighlight.png');
}
