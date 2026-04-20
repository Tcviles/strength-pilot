import React from 'react';
import { Text, TextInput, View } from 'react-native';

import type { Experience, Goal, Gym, GymType, Palette, Profile } from '../types/app';
import { humanize } from '../utils/format';
import { ActionButton } from './ActionButton';
import { BooleanChip } from './BooleanChip';
import { OptionRow } from './OptionRow';
import { SectionHeading } from './SectionHeading';
import { styles } from '../theme/styles';

type Props = {
  palette: Palette;
  profile: Profile;
  gym: Gym;
  loading: boolean;
  onProfileChange: (value: Profile) => void;
  onGymChange: (value: Gym) => void;
  onSave: () => void;
};

export function OnboardingCard({
  palette,
  profile,
  gym,
  loading,
  onProfileChange,
  onGymChange,
  onSave,
}: Props) {
  const setEquipment = (key: string) => {
    onGymChange({
      ...gym,
      equipment: {
        ...gym.equipment,
        [key]: !gym.equipment[key],
      },
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <SectionHeading palette={palette} eyebrow="Onboarding" title="Build your training baseline" />
      <Text style={[styles.helperText, { color: palette.muted }]}>
        Goal, frequency, and equipment drive the workout engine.
      </Text>

      <OptionRow
        palette={palette}
        label="Goal"
        options={['strength', 'hypertrophy', 'fat_loss', 'general']}
        selected={profile.goal}
        onSelect={(goal) => onProfileChange({ ...profile, goal: goal as Goal })}
      />
      <OptionRow
        palette={palette}
        label="Experience"
        options={['beginner', 'intermediate', 'advanced']}
        selected={profile.experience}
        onSelect={(experience) => onProfileChange({ ...profile, experience: experience as Experience })}
      />
      <OptionRow
        palette={palette}
        label="Days per week"
        options={['3', '4', '5', '6']}
        selected={String(profile.daysPerWeek)}
        onSelect={(value) => onProfileChange({ ...profile, daysPerWeek: Number(value) })}
      />
      <OptionRow
        palette={palette}
        label="Session length"
        options={['30', '45', '60', '90']}
        selected={String(profile.sessionLength)}
        onSelect={(value) => onProfileChange({ ...profile, sessionLength: Number(value) })}
      />
      <OptionRow
        palette={palette}
        label="Gym type"
        options={['commercial', 'home', 'hotel']}
        selected={gym.type}
        onSelect={(value) => onGymChange({ ...gym, type: value as GymType })}
      />

      <Text style={[styles.subheading, { color: palette.text }]}>Equipment</Text>
      <View style={styles.pillGrid}>
        {Object.entries(gym.equipment).map(([key, enabled]) => (
          <BooleanChip
            key={key}
            palette={palette}
            label={humanize(key)}
            active={enabled}
            onPress={() => setEquipment(key)}
          />
        ))}
      </View>

      <TextInput
        keyboardType="numeric"
        placeholder="Max dumbbell weight"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={String(gym.dumbbellMax)}
        onChangeText={(value) =>
          onGymChange({ ...gym, dumbbellMax: Number(value.replace(/[^0-9]/g, '')) || 0 })
        }
      />
      <TextInput
        placeholder="Gym notes"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={gym.notes}
        onChangeText={(value) => onGymChange({ ...gym, notes: value })}
      />

      <View style={styles.dualRow}>
        <BooleanChip
          palette={palette}
          label="Smith machine"
          active={gym.hasSmith}
          onPress={() => onGymChange({ ...gym, hasSmith: !gym.hasSmith })}
        />
        <BooleanChip
          palette={palette}
          label="Hack squat"
          active={gym.hasHackSquat}
          onPress={() => onGymChange({ ...gym, hasHackSquat: !gym.hasHackSquat })}
        />
      </View>

      <ActionButton
        palette={palette}
        label="Save And Continue"
        disabled={loading}
        onPress={onSave}
      />
    </View>
  );
}
