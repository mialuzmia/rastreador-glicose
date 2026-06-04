import { MaxContentWidth, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
    width: '100%',
    gap: Spacing.three,

    maxWidth: MaxContentWidth,
  },
});
