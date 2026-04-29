import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { ExerciseCard } from './ExerciseCard';

const MINI_LOGO = require('../../media/MiniLogo.png');

export function WorkoutCard() {
  const { palette } = useTheme();

  return (
    <View style={workoutCardStyles.screen}>
      <ExerciseCard />

      <View
        style={[
          workoutCardStyles.promoCard,
          { backgroundColor: palette.card, borderColor: palette.line },
        ]}
      >
        <View style={workoutCardStyles.promoLeft}>
          <Image source={MINI_LOGO} style={workoutCardStyles.promoLogo} resizeMode="contain" />
          <View style={workoutCardStyles.promoCopy}>
            <Text style={[workoutCardStyles.promoTitle, { color: palette.text }]}>
              Build stronger. Every day.
            </Text>
            <Text style={[workoutCardStyles.promoBody, { color: palette.muted }]}>
              Find the right movement. Train smarter.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const workoutCardStyles = StyleSheet.create({
  screen: {
    gap: 10,
  },
  promoCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoLogo: {
    width: 48,
    height: 48,
  },
  promoCopy: {
    gap: 4,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  promoBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
