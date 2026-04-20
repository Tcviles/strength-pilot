import { CONFIG } from '../config/appConfig';
import type { Gym, Profile } from '../types/app';

export const DEFAULT_PROFILE: Profile = {
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
