import React from 'react';
import { Text, View } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useAppState } from '../../hooks/useAppState';
import { useTheme } from '../../hooks/useTheme';
import { ActionButton } from '../shared/ActionButton';
import { profileCardStyles } from './ProfileCard.styles';

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
