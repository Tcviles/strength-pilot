import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';

type TabId = 'home' | 'workout' | 'progress' | 'library' | 'profile';

type Props = {
  activeTab: TabId;
  onSelect?: (tab: TabId) => void;
};

const SIGNED_IN_TABS: Array<{ id: TabId; label: string; icon: string }> = [
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
        {SIGNED_IN_TABS.map((tab) => {
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

const footerNavStyles = StyleSheet.create({
  footerWrap: {
    width: '100%',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 58,
    borderRadius: 18,
    paddingVertical: 6,
  },
  footerIcon: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 24,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
