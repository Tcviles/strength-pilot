import React, { createContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette } from '../theme/palette';
import type { Palette } from '../types/app';

type ThemeContextValue = {
  isDarkMode: boolean;
  palette: Palette;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useColorScheme() !== 'light';
  const palette = isDarkMode ? darkPalette : lightPalette;

  const value = useMemo(
    () => ({
      isDarkMode,
      palette,
    }),
    [isDarkMode, palette],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
