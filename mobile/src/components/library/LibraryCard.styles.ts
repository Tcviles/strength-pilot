import { StyleSheet } from 'react-native';

export const libraryCardStyles = StyleSheet.create({
  card: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 0,
    gap: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandMiniLogo: {
    width: 42,
    height: 42,
  },
  brandTextLogo: {
    width: 178,
    height: 24,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  addButtonWrap: {
    alignItems: 'center',
    gap: 6,
    width: 68,
    paddingTop: 2,
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPlus: {
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
    marginTop: -3,
  },
  addButtonLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 10,
    maxWidth: '82%',
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  body: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '400',
  },
  list: {
    gap: 10,
    paddingBottom: 6,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 14,
  },
  sectionCopy: {
    gap: 2,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionCountBadge: {
    minWidth: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sectionCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionChevron: {
    fontSize: 22,
    fontWeight: '700',
  },
  sectionList: {
    gap: 8,
    paddingHorizontal: 6,
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
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  emptyStateBody: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  promoCard: {
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  promoLogo: {
    width: 48,
    height: 48,
  },
  promoCopy: {
    gap: 4,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  promoBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
