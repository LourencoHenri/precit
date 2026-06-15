import { Theme, ThemeScheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useColors(): ThemeScheme {
  const { colorScheme } = useColorScheme();
  return Theme[colorScheme ?? 'light'];
}
