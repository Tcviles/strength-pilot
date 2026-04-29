import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { HomeTemplateCard } from './homeData';

type HomeTemplateSectionProps = {
  title: string;
  cards: HomeTemplateCard[];
  onPressCard: (key: string) => void;
  viewAllLabel?: string;
};

export function HomeTemplateSection({
  title,
  cards,
  onPressCard,
  viewAllLabel = 'View all ›',
}: HomeTemplateSectionProps) {
  const { palette } = useTheme();

  return (
    <View style={homeTemplateSectionStyles.templateSection}>
      <View style={homeTemplateSectionStyles.templateHeaderRow}>
        <Text style={[homeTemplateSectionStyles.templateTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[homeTemplateSectionStyles.templateViewAll, { color: palette.accent }]}>
          {viewAllLabel}
        </Text>
      </View>

      <View style={homeTemplateSectionStyles.compactTemplateRow}>
        {cards.slice(0, 3).map((card) => (
          <Pressable
            key={card.key}
            onPress={() => onPressCard(card.key)}
            style={[homeTemplateSectionStyles.compactTemplateCard, { backgroundColor: palette.panel, borderColor: palette.line }]}
          >
            <View style={[homeTemplateSectionStyles.compactTemplateArt, { backgroundColor: palette.input, borderColor: palette.line }]}>
              <Image source={card.image} style={homeTemplateSectionStyles.optionThumbnail} resizeMode="cover" />
            </View>
            <View style={homeTemplateSectionStyles.compactTemplateCopy}>
              <Text style={[homeTemplateSectionStyles.compactTemplateTitle, { color: palette.text }]} numberOfLines={1}>
                {card.label}
              </Text>
              <Text style={[homeTemplateSectionStyles.compactTemplateMeta, { color: palette.muted }]}>
                {card.exerciseCount} exercises
              </Text>
              <Text style={[homeTemplateSectionStyles.compactTemplateMeta, { color: palette.muted }]}>
                ◔ {card.durationMinutes} min
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const homeTemplateSectionStyles = StyleSheet.create({
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
  compactTemplateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compactTemplateCard: {
    flex: 1,
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(16, 21, 27, 0.92)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  compactTemplateArt: {
    width: 42,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionThumbnail: {
    width: '100%',
    height: '100%',
  },
  compactTemplateCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  compactTemplateTitle: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '700',
  },

  compactTemplateMeta: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '500',
    opacity: 0.62,
  },
});
