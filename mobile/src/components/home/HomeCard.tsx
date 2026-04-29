import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { PreferencesButton } from '../shared/PreferencesButton';
import { WorkoutPreferencesModal } from '../shared/WorkoutPreferencesModal';
import { ActiveWorkoutSection } from './ActiveWorkoutSection';
import { buildAiTemplateCards, CUSTOM_TEMPLATE_CARDS, HomeMode, WORKOUT_OPTIONS, WORKOUT_THUMBNAILS } from './homeData';
import { HomeTemplateSection } from './HomeTemplateSection';

type HomeCardProps = {
  mode?: HomeMode;
};

export function HomeCard({ mode = 'signedIn' }: HomeCardProps) {
  const { palette } = useTheme();
  const {
    workout,
    focus,
    loading,
    workoutStartedAt,
    draftProfile,
    draftGym,
    crowd,
    mood,
    setDraftProfile,
    setDraftGym,
    setCrowd,
    setMood,
    startWorkout,
    createCustomWorkout,
    generateGuestWorkout,
    generateWorkout,
    navigateToScreen,
  } = useAppState();
  const [showPreferences, setShowPreferences] = useState(false);
  const isGuest = mode === 'guest';
  const aiTemplateCards = buildAiTemplateCards(draftProfile.sessionLength);

  const handleTemplatePress = (key: string) => {
    if (isGuest) {
      generateGuestWorkout(key).catch(() => undefined);
      return;
    }

    generateWorkout({ openWorkout: false, startOnComplete: false, focus: key }).catch(() => undefined);
  };

  const handleCustomTemplatePress = () => {
    createCustomWorkout();
  };

  return (
    <>
      <View style={homeCardStyles.screen}>
        <View style={homeCardStyles.heroTopRow}>
          <View style={homeCardStyles.heroTopSpacer} />
          <View style={homeCardStyles.brandWrap}>
            <Image
              source={require('../../media/MiniLogo.png')}
              resizeMode="contain"
              style={homeCardStyles.brandLogo}
            />
          </View>
          <View style={homeCardStyles.heroActions}>
            <PreferencesButton compact onPress={() => setShowPreferences(true)} />
          </View>
        </View>

        {workout && !workoutStartedAt ? (
          <View style={[homeCardStyles.activeGuestCard, { backgroundColor: palette.panel }]}>
            <Text style={[homeCardStyles.activeGuestEyebrow, { color: palette.accent }]}>READY TO GO</Text>
            <Text style={[homeCardStyles.activeGuestTitle, { color: palette.text }]}>
              {focus || 'Workout'}
            </Text>
            <Text style={[homeCardStyles.activeGuestMeta, { color: palette.muted }]}>
              {workout.exercises.length} movements · {workout.durationMinutes} minutes
            </Text>
            <ActionButton
              label="Open Workout"
              disabled={loading}
              onPress={() => startWorkout().catch(() => undefined)}
            />
          </View>
        ) : null}

        {workoutStartedAt && workout ? (
          <ActiveWorkoutSection />
        ) : (
          <Pressable
            onPress={createCustomWorkout}
            style={[homeCardStyles.createCustomCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
          >
            <View style={[homeCardStyles.createCustomIconWrap, { backgroundColor: palette.input, borderColor: palette.line }]}>
              <Text style={[homeCardStyles.createCustomIcon, { color: palette.accent }]}>+</Text>
            </View>
            <View style={homeCardStyles.createCustomCopy}>
              <Text style={[homeCardStyles.createCustomTitle, { color: palette.text }]}>Create Your Own Workout</Text>
              <Text style={[homeCardStyles.createCustomBody, { color: palette.muted }]}>
                Build a custom workout and track as you go.
              </Text>
            </View>
            <Text style={[homeCardStyles.createCustomChevron, { color: palette.accent }]}>›</Text>
          </Pressable>
        )}

        <View style={homeCardStyles.secondarySection}>
          <HomeTemplateSection
            title="AI Generated Templates"
            cards={aiTemplateCards}
            onPressCard={handleTemplatePress}
          />

          {!workoutStartedAt ? (
            <View style={homeCardStyles.optionList}>
              {WORKOUT_OPTIONS.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => handleTemplatePress(option.key)}
                  style={[homeCardStyles.optionRowCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
                >
                  <View style={[homeCardStyles.optionArt, { backgroundColor: palette.input, borderColor: palette.line }]}>
                    {Object.prototype.hasOwnProperty.call(WORKOUT_THUMBNAILS, option.key) ? (
                      <Image
                        source={WORKOUT_THUMBNAILS[option.key as keyof typeof WORKOUT_THUMBNAILS]}
                        style={homeCardStyles.optionThumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={[homeCardStyles.optionArtLabel, { color: palette.accent }]}>
                        {option.label.slice(0, 1)}
                      </Text>
                    )}
                  </View>
                  <View style={homeCardStyles.optionCopy}>
                    <View style={homeCardStyles.optionTitleRow}>
                      <Text style={[homeCardStyles.optionLabel, { color: palette.text }]}>{option.label}</Text>
                      {option.emphasis ? (
                        <View style={[homeCardStyles.optionBadge, { backgroundColor: palette.badge, borderColor: palette.line }]}>
                          <Text style={[homeCardStyles.optionBadgeText, { color: palette.accent }]}>
                            {option.emphasis}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={[homeCardStyles.optionDetail, { color: palette.muted }]}>{option.detail}</Text>
                  </View>
                  <Text style={[homeCardStyles.optionChevron, { color: palette.muted }]}>›</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {isGuest ? (
            <Pressable
              onPress={() => navigateToScreen('profile')}
              style={[homeCardStyles.supportCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
            >
              <View style={[homeCardStyles.supportIconWrap, { backgroundColor: palette.input }]}>
                <Text style={[homeCardStyles.supportIcon, { color: palette.accent }]}>⛨</Text>
              </View>
              <View style={homeCardStyles.supportCopy}>
                <Text style={[homeCardStyles.supportTitle, { color: palette.text }]}>You're in Guest Mode</Text>
                <Text style={[homeCardStyles.supportBody, { color: palette.muted }]}>
                  Sign in to save templates, see progress, and sync across devices.
                </Text>
              </View>
              <Text style={[homeCardStyles.supportAction, { color: palette.accent }]}>Sign in  ›</Text>
            </Pressable>
          ) : (
            <HomeTemplateSection
              title="Custom Templates"
              cards={CUSTOM_TEMPLATE_CARDS}
              onPressCard={handleCustomTemplatePress}
            />
          )}
        </View>
      </View>

      <WorkoutPreferencesModal
        visible={showPreferences}
        loading={loading}
        draftProfile={draftProfile}
        draftGym={draftGym}
        crowd={crowd}
        mood={mood}
        onClose={() => setShowPreferences(false)}
        onSave={() => setShowPreferences(false)}
        setDraftProfile={setDraftProfile}
        setDraftGym={setDraftGym}
        setCrowd={setCrowd}
        setMood={setMood}
      />
    </>
  );
}

const homeCardStyles = StyleSheet.create({
  screen: {
    gap: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
  },
  heroTopSpacer: {
    width: '33.333%',
  },
  brandWrap: {
    width: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActions: {
    width: '33.333%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  brandLogo: {
    height: 50,
  },
  activeGuestCard: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
    shadowColor: '#F58A24',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1,
  },
  activeGuestEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.6,
  },
  activeGuestTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '700',
  },
  activeGuestMeta: {
    fontSize: 15,
    lineHeight: 20,
  },
  createCustomCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#F58A24',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  createCustomIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createCustomIcon: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '300',
  },
  createCustomCopy: {
    flex: 1,
    gap: 2,
  },
  createCustomTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  createCustomBody: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    opacity: 0.68,
  },
  createCustomChevron: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '400',
  },
  templateSection: {
    gap: 10,
  },
  templateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  templateTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  templateViewAll: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  },
  optionThumbnail: {
    width: '100%',
    height: '100%',
  },
  optionList: {
    gap: 10,
  },
  optionRowCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#F58A24',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  optionArt: {
    width: 58,
    height: 58,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionArtLabel: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  optionCopy: {
    flex: 1,
    gap: 2,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  optionBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  optionBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  optionDetail: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.68,
  },
  optionChevron: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  supportCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#F58A24',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  secondarySection: {
    gap: 18,
  },
  supportIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportIcon: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '800',
  },
  supportCopy: {
    flex: 1,
    gap: 2,
  },
  supportTitle: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
  },
  supportBody: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    opacity: 0.68,
  },
  supportAction: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '600',
  },
});
