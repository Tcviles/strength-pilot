import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { styles } from '../../theme/styles';

type Props = {
  eyebrow: string;
  title: string;
};

export function SectionHeading({ eyebrow, title }: Props) {
  const { palette } = useTheme();

  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text>
      <Text style={[styles.sectionTitle, { color: palette.text }]}>{title}</Text>
    </View>
  );
}
