import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { chrome } from '../../theme/styles';
import { humanize } from '../../utils/format';
import { WorkoutMenuModal } from './WorkoutMenuModal';

function formatClock(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function WorkoutTopBar() {
  const { palette } = useTheme();
  const { workout, workoutStartedAt, activeExerciseIndex, focus, saveWorkout, cancelWorkout } = useAppState();
  const [now, setNow] = useState(Date.now());
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeExercise = workout?.exercises[activeExerciseIndex];

  if (!workout || !activeExercise) {
    return null;
  }

  const elapsed = workoutStartedAt
    ? formatClock(Math.floor((now - new Date(workoutStartedAt).getTime()) / 1000))
    : '00:00';

  return (
    <View style={workoutTopBarStyles.barWrap}>
      <View style={[workoutTopBarStyles.bar, { backgroundColor: palette.panel, borderColor: palette.line }]}>
        <View style={workoutTopBarStyles.topRow}>
          <View style={workoutTopBarStyles.left}>
            <View style={workoutTopBarStyles.clockRow}>
              <Image
                source={require('../../media/MiniLogo.png')}
                style={workoutTopBarStyles.logoImage}
                resizeMode="contain"
              />
              <View style={workoutTopBarStyles.copyBlock}>
                <Text style={[workoutTopBarStyles.timerValue, { color: palette.text }]}>{elapsed}</Text>
                <Text style={[workoutTopBarStyles.timerLabel, { color: palette.muted }]}>workout time</Text>
              </View>
              <Text style={[workoutTopBarStyles.pulse, { color: palette.accent }]}>〰</Text>
            </View>
          </View>
          <View style={workoutTopBarStyles.right}>
            <Text style={[workoutTopBarStyles.eyebrow, { color: palette.accent }]}>
              {humanize(focus)} session
            </Text>
            <Text style={[workoutTopBarStyles.subtitle, { color: palette.muted }]}>
              Exercise {activeExerciseIndex + 1} of {workout.exercises.length}
            </Text>
          </View>
        </View>

        <View style={workoutTopBarStyles.actionRow}>
          <Pressable
            onPress={() => setShowMenu(true)}
            style={[
              workoutTopBarStyles.headerButton,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <Text style={[workoutTopBarStyles.planIcon, { color: palette.accent }]}>☰</Text>
            <Text style={[workoutTopBarStyles.actionTitle, { color: palette.text }]}>View</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Discard workout?',
                'This will cancel the current workout and remove your in-progress changes.',
                [
                  { text: 'Keep Workout', style: 'cancel' },
                  { text: 'Discard', style: 'destructive', onPress: cancelWorkout },
                ],
              )
            }
            style={[
              workoutTopBarStyles.headerButton,
              { backgroundColor: palette.panel, borderColor: palette.line },
            ]}
          >
            <Text style={[workoutTopBarStyles.secondaryIcon, { color: palette.text }]}>✕</Text>
            <Text style={[workoutTopBarStyles.actionTitle, { color: palette.text }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Save your workout?',
                'We’ll save this session and return you to the home screen.',
                [
                  { text: 'Keep Training', style: 'cancel' },
                  { text: 'Save Workout', onPress: saveWorkout },
                ],
              )
            }
            style={[
              workoutTopBarStyles.headerButton,
              { borderColor: palette.accent },
            ]}
          >
            <View
              style={[
                workoutTopBarStyles.saveButtonFill,
                { backgroundColor: palette.accent },
              ]}
            >
              <ImageBackground
                source={require('../../media/ButtonBackground.png')}
                resizeMode="cover"
                imageStyle={workoutTopBarStyles.saveButtonTextureImage}
                style={workoutTopBarStyles.saveButtonTexture}
              />
              <Text style={[workoutTopBarStyles.primaryIcon, { color: palette.buttonText }]}>✓</Text>
              <Text style={[workoutTopBarStyles.primaryTitle, { color: palette.buttonText }]}>Save</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <WorkoutMenuModal visible={showMenu} onClose={() => setShowMenu(false)} />
    </View>
  );
}

const workoutTopBarStyles = StyleSheet.create({
  barWrap: {
    paddingHorizontal: chrome.screenPadding,
    paddingTop: chrome.screenPadding,
    paddingBottom: 2,
  },
  bar: {
    borderWidth: 1,
    borderRadius: chrome.cardRadius,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  logoImage: {
    width: 52,
    height: 52,
  },
  copyBlock: {
    gap: 0,
  },
  pulse: {
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 4,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: chrome.metaFontSize,
    lineHeight: chrome.metaLineHeight,
    fontWeight: '500',
    opacity: chrome.metaOpacity,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
    paddingTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    flex: 1,
    flexBasis: 0,
    borderWidth: 1,
    borderRadius: chrome.buttonRadius,
    minHeight: 46,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    overflow: 'hidden',
  },
  saveButtonFill: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    overflow: 'hidden',
  },
  saveButtonTexture: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  saveButtonTextureImage: {
    borderRadius: chrome.buttonRadius,
    transform: [{ scaleX: 1.12 }, { scaleY: 1.04 }],
  },
  planIcon: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  secondaryIcon: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  primaryIcon: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 20,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 16,
  },
  primaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 16,
  },
  timerValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: chrome.metaOpacity,
  },
});
