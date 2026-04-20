import React from 'react';
import { TextInput, View } from 'react-native';

import { styles } from '../theme/styles';
import type { Crowd, Gym, Palette, Profile } from '../types/app';
import { humanize } from '../utils/format';
import { ActionButton } from './ActionButton';
import { MetricCard } from './MetricCard';
import { OptionRow } from './OptionRow';
import { SectionHeading } from './SectionHeading';

type Props = {
  palette: Palette;
  profile: Profile;
  gym: Gym;
  crowd: Crowd;
  mood: string;
  equipmentCount: number;
  loading: boolean;
  onCrowdChange: (value: Crowd) => void;
  onMoodChange: (value: string) => void;
  onGenerate: () => void;
};

export function HomeCard({
  palette,
  profile,
  gym,
  crowd,
  mood,
  equipmentCount,
  loading,
  onCrowdChange,
  onMoodChange,
  onGenerate,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <SectionHeading palette={palette} eyebrow="Today" title="Suggested training run" />
      <View style={styles.metricRow}>
        <MetricCard palette={palette} label="Goal" value={humanize(profile.goal)} />
        <MetricCard palette={palette} label="Split" value={`${profile.daysPerWeek} days`} />
        <MetricCard palette={palette} label="Window" value={`${profile.sessionLength} min`} />
      </View>
      <View style={styles.metricRow}>
        <MetricCard palette={palette} label="Gym" value={humanize(gym.type)} />
        <MetricCard palette={palette} label="Tools" value={`${equipmentCount} ready`} />
        <MetricCard palette={palette} label="Focus" value={humanize(profile.experience)} />
      </View>

      <OptionRow
        palette={palette}
        label="Crowd"
        options={['low', 'medium', 'high']}
        selected={crowd}
        onSelect={(value) => onCrowdChange(value as Crowd)}
      />

      <TextInput
        placeholder="How do you feel walking in?"
        placeholderTextColor={palette.placeholder}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.input }]}
        value={mood}
        onChangeText={onMoodChange}
      />

      <ActionButton
        palette={palette}
        label={loading ? 'Building...' : 'Start Suggested Workout'}
        disabled={loading}
        onPress={onGenerate}
      />
    </View>
  );
}
