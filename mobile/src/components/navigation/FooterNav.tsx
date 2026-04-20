import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { footerNavStyles } from './FooterNav.styles';

type TabId = 'home' | 'workout' | 'progress' | 'library' | 'profile';

type Props = {
  activeTab: TabId;
  onSelect?: (tab: TabId) => void;
};

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'workout', label: 'Workout', icon: '◉' },
  { id: 'progress', label: 'Progress', icon: '✚' },
  { id: 'library', label: 'Library', icon: '▦' },
  { id: 'profile', label: 'Profile', icon: '⬤' },
];

export function FooterNav({ activeTab, onSelect }: Props) {
  const { palette } = useTheme();

  return (
    <View
      style={[
        footerNavStyles.footerWrap,
        { backgroundColor: palette.panel, borderColor: palette.line },
      ]}
    >
      <View style={footerNavStyles.footerRow}>
        {TABS.map((tab) => {
          const active = tab.id === activeTab;

          return (
            <Pressable
              key={tab.id}
              onPress={() => onSelect?.(tab.id)}
              style={[
                footerNavStyles.footerItem,
                active ? { backgroundColor: palette.card } : null,
              ]}
            >
              <Text
                style={[
                  footerNavStyles.footerIcon,
                  { color: active ? palette.accent : palette.muted },
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  footerNavStyles.footerLabel,
                  { color: active ? palette.text : palette.muted },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
