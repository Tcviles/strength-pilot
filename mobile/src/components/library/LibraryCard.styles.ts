import { StyleSheet } from 'react-native';

export const libraryCardStyles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  list: {
    gap: 10,
  },
  row: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowCopy: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  rowMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  rowChevron: {
    fontSize: 20,
    fontWeight: '700',
  },
});
