import { Platform } from "react-native";

export type ThemeScheme = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
};

export const Theme: { light: ThemeScheme; dark: ThemeScheme } = {
  light: {
    primary: "#415F91",
    onPrimary: "#FFFFFF",
    primaryContainer: "#D6E3FF",
    onPrimaryContainer: "#284777",
    secondary: "#565F71",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#DBE2F9",
    onSecondaryContainer: "#3F4759",
    background: "#F9F9FF",
    onBackground: "#191C20",
    surface: "#F9F9FF",
    onSurface: "#191C20",
    surfaceVariant: "#E0E2EC",
    onSurfaceVariant: "#44474E",
    outline: "#74777F",
    outlineVariant: "#C4C6D0",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F3F3FA",
    surfaceContainer: "#EDEDF4",
    surfaceContainerHigh: "#E7E8EE",
    surfaceContainerHighest: "#E2E2E9",
  },
  dark: {
    primary: "#AAC7FF",
    onPrimary: "#0A305F",
    primaryContainer: "#284777",
    onPrimaryContainer: "#D6E3FF",
    secondary: "#BEC6DC",
    onSecondary: "#283141",
    secondaryContainer: "#3F4759",
    onSecondaryContainer: "#DBE2F9",
    background: "#111318",
    onBackground: "#E2E2E9",
    surface: "#111318",
    onSurface: "#E2E2E9",
    surfaceVariant: "#44474E",
    onSurfaceVariant: "#C4C6D0",
    outline: "#8E9099",
    outlineVariant: "#44474E",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    surfaceContainerLowest: "#0C0E13",
    surfaceContainerLow: "#191C20",
    surfaceContainer: "#1D2024",
    surfaceContainerHigh: "#282A2F",
    surfaceContainerHighest: "#33353A",
  },
};

// Backward-compat shim — used by useThemeColor hook
export const Colors = {
  light: {
    text: Theme.light.onBackground,
    background: Theme.light.background,
    tint: Theme.light.primary,
    icon: Theme.light.onSurfaceVariant,
    tabIconDefault: Theme.light.onSurfaceVariant,
    tabIconSelected: Theme.light.primary,
  },
  dark: {
    text: Theme.dark.onBackground,
    background: Theme.dark.background,
    tint: Theme.dark.primary,
    icon: Theme.dark.onSurfaceVariant,
    tabIconDefault: Theme.dark.onSurfaceVariant,
    tabIconSelected: Theme.dark.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
