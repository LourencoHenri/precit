import { Theme } from '@/constants/theme';

// Static light-mode color constants — single source of truth for UI colors.
// For theme-reactive colors (dark mode), use useColors() from '@/hooks/use-colors'.
export const COLORS = {
  primary: Theme.light.primary,
  onPrimary: Theme.light.onPrimary,
  primaryContainer: Theme.light.primaryContainer,
  onPrimaryContainer: Theme.light.onPrimaryContainer,
  secondary: Theme.light.secondary,
  surface: Theme.light.surface,
  surfaceVariant: Theme.light.surfaceVariant,
  surfaceContainer: Theme.light.surfaceContainer,
  surfaceContainerLow: Theme.light.surfaceContainerLow,
  onSurface: Theme.light.onSurface,
  onSurfaceVariant: Theme.light.onSurfaceVariant,
  outline: Theme.light.outline,
  outlineVariant: Theme.light.outlineVariant,
  error: Theme.light.error,
  errorContainer: Theme.light.errorContainer,
  textSecondary: Theme.light.onSurfaceVariant,
  doneLine: Theme.light.primary,
  pillActive: Theme.light.primaryContainer,
} as const;
