import { StyleSheet } from 'react-native';

export const workoutCardStyles = StyleSheet.create({
  screen: {
    gap: 16,
  },
  stageCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  exerciseHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  exerciseType: {
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  exerciseHeaderAction: {
    borderWidth: 1,
    borderRadius: 12,
    minWidth: 54,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  exerciseHeaderActionText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  restBanner: {
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  restBannerLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  restBannerValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  restBannerGo: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  successText: {
    color: '#8fd48a',
  },
  completedCheckButton: {
    backgroundColor: '#173222',
    borderColor: '#67b77c',
  },
  completedCheckText: {
    color: '#9be2aa',
  },
  visualRow: {
    flexDirection: 'row',
    gap: 12,
  },
  visualCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    minHeight: 132,
    padding: 12,
    justifyContent: 'space-between',
  },
  visualLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  visualValue: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  visualHint: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableWrap: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  setCol: {
    width: 44,
  },
  previousCol: {
    flex: 1.2,
  },
  inputCol: {
    flex: 0.9,
  },
  checkCol: {
    width: 54,
    alignItems: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  setRowActive: {
    borderLeftWidth: 2,
  },
  setRowCompleted: {
    opacity: 0.92,
  },
  setRowText: {
    fontSize: 18,
    fontWeight: '700',
  },
  setPreviousText: {
    fontSize: 14,
    fontWeight: '600',
  },
  setInput: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  checkButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },
  nextCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  nextCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  nextLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nextName: {
    fontSize: 18,
    fontWeight: '700',
  },
  nextMeta: {
    fontSize: 14,
    fontWeight: '500',
  },
  nextHint: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 12, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  modalClose: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalBody: {
    gap: 12,
  },
  modalSection: {
    gap: 8,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  modalParagraph: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  centeredText: {
    textAlign: 'center',
  },
  modalListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  modalListBullet: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  modalAlternativeCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  modalAlternativeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalAlternativeMeta: {
    fontSize: 13,
    fontWeight: '500',
  },
  feedbackPrompt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  feedbackOption: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  feedbackOptionIndex: {
    width: 26,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  feedbackOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackFooter: {
    gap: 10,
  },
  workoutActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
