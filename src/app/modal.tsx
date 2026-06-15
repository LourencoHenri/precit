import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppTheme } from "@/hooks/use-app-theme";
import i18n, {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
} from "@/i18n";
import { AppTheme } from "@/providers/theme-provider";

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionRow({ label, selected, onPress }: OptionRowProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between px-4 py-3.5 border-b border-zinc-200 dark:border-[#2d3133]"
      onPress={onPress}
    >
      <ThemedText
        className={
          selected ? "text-primary dark:text-primary font-semibold" : undefined
        }
      >
        {label}
      </ThemedText>
      {selected && (
        <IconSymbol name="chevron-right" size={16} color="#0a7ea4" />
      )}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colorScheme, setTheme } = useAppTheme();
  const currentLang = i18n.language as SupportedLanguageCode;

  const handleTheme = (theme: AppTheme) => setTheme(theme);

  const handleLanguage = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  return (
    <ThemedView
      className="flex-1 p-5 gap-6"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="gap-2">
        <ThemedText className="text-xs font-semibold tracking-wide ml-1 text-[#687076] dark:text-[#9ba1a6]">
          {t("settings.theme").toUpperCase()}
        </ThemedText>
        <View className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-[#1e2122]">
          <OptionRow
            label={t("settings.light")}
            selected={colorScheme === "light"}
            onPress={() => handleTheme("light")}
          />
          <OptionRow
            label={t("settings.dark")}
            selected={colorScheme === "dark"}
            onPress={() => handleTheme("dark")}
          />
        </View>
      </View>

      <View className="gap-2">
        <ThemedText className="text-xs font-semibold tracking-wide ml-1 text-[#687076] dark:text-[#9ba1a6]">
          {t("settings.language").toUpperCase()}
        </ThemedText>
        <View className="rounded-xl overflow-hidden bg-zinc-50 dark:bg-[#1e2122]">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <OptionRow
              key={lang.code}
              label={lang.label}
              selected={currentLang === lang.code}
              onPress={() => handleLanguage(lang.code)}
            />
          ))}
        </View>
      </View>
    </ThemedView>
  );
}
