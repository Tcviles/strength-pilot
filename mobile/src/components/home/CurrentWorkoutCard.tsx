import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { humanize } from '../../utils/format';
import { formatClock, formatStartedAgo } from './activeWorkoutHelpers';

type CurrentWorkoutCardProps = {
  focus: string;
  now: number;
  workoutStartedAt: string;
  workoutSeconds: number;
  restSeconds: number;
  onContinue: () => void;
};

export function CurrentWorkoutCard({
  focus,
  now,
  workoutStartedAt,
  workoutSeconds,
  restSeconds,
  onContinue,
}: CurrentWorkoutCardProps) {
  const { palette } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.panel, borderColor: palette.line }]}>
      <Text style={[styles.eyebrow, { color: palette.accent }]}>Current Workout</Text>
      <Text style={[styles.title, { color: palette.text }]}>{humanize(focus)} Session</Text>
      <Text style={[styles.meta, { color: palette.muted }]}>{formatStartedAgo(workoutStartedAt, now)}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricsInlineWrap}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: palette.input, borderColor: palette.accentSoft }]}>
              <Text style={[styles.metricIconText, { color: palette.accent }]}>◔</Text>
            </View>
            <View style={styles.metricCopy}>
              <Text style={[styles.metricValue, { color: palette.text }]}>{formatClock(workoutSeconds)}</Text>
              <Text style={[styles.metricLabel, { color: palette.muted }]}>Workout Time</Text>
            </View>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: palette.line }]} />
          <View style={styles.metricCard}>
            <View style={[styles.metricIconWrap, { backgroundColor: palette.input, borderColor: palette.accentSoft }]}>
              <Text style={[styles.metricIconText, { color: palette.accent }]}>↻</Text>
            </View>
            <View style={styles.metricCopy}>
              <Text style={[styles.metricValue, { color: palette.text }]}>
                {restSeconds > 0 ? formatClock(restSeconds) : 'GO'}
              </Text>
              <Text style={[styles.metricLabel, { color: palette.muted }]}>Rest Timer</Text>
            </View>
          </View>
        </View>
        <View style={styles.continueButtonWrap}>
          <Pressable onPress={onContinue} style={styles.continueButtonPressable}>
            <View style={[styles.continueButton, { backgroundColor: '#FF962E' }]}>
              <ImageBackground
                source={require('../../media/ButtonBackground.png')}
                resizeMode="cover"
                imageStyle={styles.continueButtonTextureImage}
                style={styles.continueButtonTexture}
              />
              <Text style={[styles.continueButtonText, { color: '#FFF6EB' }]}>Continue Workout</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 3,
    shadowColor: '#404040',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  eyebrow: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '400',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    lineHeight: 19,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  meta: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    opacity: 0.58,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricsInlineWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricDivider: {
    width: 1,
    height: 30,
    alignSelf: 'center',
    opacity: 0.5,
  },
  metricIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconText: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '600',
  },
  metricCopy: {
    gap: 1,
  },
  metricValue: {
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '400',
  },
  metricLabel: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '400',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    opacity: 0.58,
  },
  continueButtonWrap: {
    width: 96,
    justifyContent: 'center',
  },
  continueButtonPressable: {
    width: '100%',
  },
  continueButton: {
    minHeight: 40,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    shadowColor: '#F58A24',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  continueButtonTexture: {
    ...StyleSheet.absoluteFill,
    opacity: 0.9,
  },
  continueButtonTextureImage: {
    width: '118%',
    marginLeft: '-9%',
  },
  continueButtonText: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
