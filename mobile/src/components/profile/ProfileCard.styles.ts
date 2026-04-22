import { StyleSheet } from 'react-native';

export const profileCardStyles = StyleSheet.create({
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
