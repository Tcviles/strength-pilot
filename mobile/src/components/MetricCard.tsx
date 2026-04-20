import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';

type Props = {
  palette: Palette;
  label: string;
  value: string;
};

export function MetricCard({ palette, label, value }: Props) {
  return (
    <View style={[styles.metricCard, { backgroundColor: palette.panel, borderColor: palette.line }]}>
      <Text style={[styles.metricLabel, { color: palette.muted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: palette.text }]}>{value}</Text>
    </View>
  );
}
