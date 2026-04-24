import { StyleSheet } from 'react-native';

export const exerciseInfoModalStyles = StyleSheet.create({
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    flex: 1,
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
  modalScrollContent: {
    gap: 12,
    paddingBottom: 8,
  },
  diagramCard: {
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  diagramImage: {
    width: '100%',
    height: 220,
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
  modalListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    width: '100%',
  },
  modalListBullet: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
    width: 12,
  },
  modalListText: {
    flex: 1,
    flexShrink: 1,
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
  modalDeleteCardLoading: {
    opacity: 0.6,
  },
  modalDeleteTitle: {
    color: '#ff7a6f',
  },
});
