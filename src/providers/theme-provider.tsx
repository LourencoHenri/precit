import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import { PropsWithChildren, useEffect } from 'react';

const THEME_STORAGE_KEY = '@precit/theme';

export type AppTheme = 'light' | 'dark';

export function persistTheme(theme: AppTheme): void {
  AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          setColorScheme(saved);
        }
      })
      .catch(() => {
        // Loading a saved preference failed; keep the system default
      });
  }, [setColorScheme]);

  return <>{children}</>;
}
