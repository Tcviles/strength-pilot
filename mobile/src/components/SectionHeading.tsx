import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../theme/styles';
import type { Palette } from '../types/app';

type Props = {
  palette: Palette;
  eyebrow: string;
  title: string;
};

export function SectionHeading({ palette, eyebrow, title }: Props) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
    </View>
  );
}
