import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';

type Props = {
  label: string;
  value: string;
};

export function MetricCard({ label, value }: Props) {
  const { palette } = useTheme();

  return (
    <View style={[styles.metricCard, { backgroundColor: palette.panel, borderColor: palette.line }]}>
      <Text style={[styles.metricLabel, { color: palette.muted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: palette.text }]}>{value}</Text>
    </View>
  );
}
