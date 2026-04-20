import { StyleSheet } from 'react-native';

export const footerNavStyles = StyleSheet.create({
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
