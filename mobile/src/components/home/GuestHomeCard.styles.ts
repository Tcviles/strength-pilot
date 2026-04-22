import { StyleSheet } from 'react-native';

export const guestHomeCardStyles = StyleSheet.create({
  screen: {
    gap: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTopSpacer: {
    width: 52,
  },
  timerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRing: {
    width: 138,
    height: 138,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  timerHalo: {
    width: 138,
    height: 138,
  },
  timerValue: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '300',
    letterSpacing: -1.2,
  },
  timerSubtext: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  heroActions: {
    alignItems: 'flex-end',
    paddingTop: 6,
  },
  heroCopyBlock: {
    gap: 4,
    marginTop: -2,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
  },
  heroBody: {
    fontSize: 16,
    lineHeight: 22,
  },
  activeGuestCard: {
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 10,
  },
  activeGuestEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
  activeGuestTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '900',
  },
  activeGuestMeta: {
    fontSize: 15,
    lineHeight: 20,
  },
  optionList: {
    gap: 8,
  },
  optionRowCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  optionThumbnail: {
    width: '100%',
    height: '100%',
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
    fontWeight: '800',
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
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  optionDetail: {
    fontSize: 12,
    lineHeight: 16,
  },
  optionChevron: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 24,
  },
  modalScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
  },
  preferencesCard: {
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 14,
  },
  preferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferencesTitle: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
  },
  preferencesCloseButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preferencesCloseText: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '300',
  },
});
