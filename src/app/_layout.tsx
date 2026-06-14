import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n, { LANGUAGE_STORAGE_KEY } from "@/i18n";
import { AppThemeProvider } from "@/providers/theme-provider";

import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((lang) => {
        if (lang && lang !== i18n.language) {
          i18n.changeLanguage(lang);
        }
      })
      .catch(() => {
        // Loading a saved language failed; keep the default (pt-BR)
      });
  }, []);

  return (
    <AppThemeProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: t("settings.title") }}
          />
          <Stack.Screen
            name="new-material"
            options={{ title: t("materials.newMaterial") }}
          />
          <Stack.Screen
            name="new-product"
            options={{ title: t("pricing.newProduct") }}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppThemeProvider>
  );
}
