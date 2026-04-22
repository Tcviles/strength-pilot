import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { featurePlaceholderCardStyles } from './FeaturePlaceholderCard.styles';

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
