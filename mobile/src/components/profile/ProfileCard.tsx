import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';

export function ProfileCard() {
  const { palette } = useTheme();
  const { profile } = useAppState();
  const { signOut } = useAuth();

  return (
    <View style={profileCardStyles.screen}>
      <View style={[profileCardStyles.card, { backgroundColor: palette.card, borderColor: palette.line }]}>
        <Text style={[profileCardStyles.eyebrow, { color: palette.accent }]}>PROFILE</Text>
        <Text style={[profileCardStyles.title, { color: palette.text }]}>
          {profile?.firstName?.trim() ? `${profile.firstName}'s account` : 'Your account'}
        </Text>
        <Text style={[profileCardStyles.body, { color: palette.muted }]}>
          Signed in mode unlocks your saved profile, adaptive recommendations, workout history, and anything else we stack on top next.
        </Text>
        {profile?.email ? (
          <View style={[profileCardStyles.metaCard, { backgroundColor: palette.panel, borderColor: palette.line }]}>
            <Text style={[profileCardStyles.metaLabel, { color: palette.muted }]}>Email</Text>
            <Text style={[profileCardStyles.metaValue, { color: palette.text }]}>{profile.email}</Text>
          </View>
        ) : null}
        <ActionButton label="Sign Out" onPress={signOut} />
      </View>
    </View>
  );
}

const profileCardStyles = StyleSheet.create({
  screen: {
    gap: 20,
  },
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
  metaCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
});
