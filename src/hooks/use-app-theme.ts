import { useColorScheme } from 'nativewind';

import { AppTheme, persistTheme } from '@/providers/theme-provider';

export function useAppTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const setTheme = (theme: AppTheme) => {
    setColorScheme(theme);
    persistTheme(theme);
  };

  return { colorScheme, setTheme };
}
