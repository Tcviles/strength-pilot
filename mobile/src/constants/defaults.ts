import { CONFIG } from '../config/appConfig';
import type { Gym, GymType, Profile } from '../types/app';

export const DEFAULT_PROFILE: Profile = {
  firstName: '',
  goal: 'strength',
  experience: 'intermediate',
  daysPerWeek: 4,
  sessionLength: 60,
  activeGymId: CONFIG.gymId,
  painAreas: [],
  permanentLimitations: [],
};

export const DEFAULT_GYM: Gym = {
  gymId: CONFIG.gymId,
  name: 'Main Gym',
  type: 'commercial',
  equipment: {
    barbell: true,
    bench: true,
    rack: true,
    dumbbell: true,
    cable: true,
    machine: true,
    pull_up_bar: true,
  },
  dumbbellMax: 100,
  hasSmith: true,
  hasHackSquat: false,
  notes: 'Busy after work',
};

const GYM_PRESETS: Record<GymType, Pick<Gym, 'name' | 'equipment' | 'dumbbellMax' | 'hasSmith' | 'hasHackSquat' | 'notes'>> = {
  commercial: {
    name: 'Main Gym',
    equipment: {
      barbell: true,
      bench: true,
      rack: true,
      dumbbell: true,
      cable: true,
      machine: true,
      pull_up_bar: true,
    },
    dumbbellMax: 100,
    hasSmith: true,
    hasHackSquat: false,
    notes: 'Busy after work',
  },
  home: {
    name: 'Home Gym',
    equipment: {
      barbell: true,
      bench: true,
      rack: true,
      dumbbell: true,
      cable: false,
      machine: false,
      pull_up_bar: true,
    },
    dumbbellMax: 60,
    hasSmith: false,
    hasHackSquat: false,
    notes: 'Built for consistency',
  },
  hotel: {
    name: 'Hotel Gym',
    equipment: {
      barbell: false,
      bench: true,
      rack: false,
      dumbbell: true,
      cable: false,
      machine: true,
      pull_up_bar: false,
    },
    dumbbellMax: 50,
    hasSmith: false,
    hasHackSquat: false,
    notes: 'Limited tools, stay on course',
  },
};

export function buildGymFromType(type: GymType, currentGym?: Gym): Gym {
  const preset = GYM_PRESETS[type];

  return {
    ...(currentGym || DEFAULT_GYM),
    gymId: CONFIG.gymId,
    type,
    name: preset.name,
    equipment: preset.equipment,
    dumbbellMax: preset.dumbbellMax,
    hasSmith: preset.hasSmith,
    hasHackSquat: preset.hasHackSquat,
    notes: preset.notes,
  };
}
