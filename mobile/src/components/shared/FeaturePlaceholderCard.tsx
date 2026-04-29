import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

type Props = {
  eyebrow: string;
  title: string;
  body: string;
};

export function FeaturePlaceholderCard({ eyebrow, title, body }: Props) {
  const { palette } = useTheme();

  return (
    <View style={[featurePlaceholderCardStyles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
      <Text style={[featurePlaceholderCardStyles.eyebrow, { color: palette.accent }]}>{eyebrow}</Text>
      <Text style={[featurePlaceholderCardStyles.title, { color: palette.text }]}>{title}</Text>
      <Text style={[featurePlaceholderCardStyles.body, { color: palette.muted }]}>{body}</Text>
    </View>
  );
}

const featurePlaceholderCardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingVertical: 24,
    gap: 14,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
