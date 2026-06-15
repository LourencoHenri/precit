import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Bell, Database, Info, Shield } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { COLORS } from "@/constants/design";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import i18n, {
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
} from "@/i18n";
import { AppTheme } from "@/providers/theme-provider";

const APP_VERSION = "1.0.0";

function SectionHeader({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        color: COLORS.textSecondary,
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 6,
      }}
    >
      {label.toUpperCase()}
    </Text>
  );
}

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  cardBg: string;
  dividerColor: string;
  textColor: string;
  last?: boolean;
};

function OptionRow({
  label,
  selected,
  onPress,
  cardBg,
  dividerColor,
  textColor,
  last,
}: OptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: cardBg,
        opacity: pressed ? 0.7 : 1,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: dividerColor,
      })}
    >
      <Text
        style={{
          fontSize: 15,
          color: selected ? COLORS.primary : textColor,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </Text>
      {selected && (
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
            }}
          />
        </View>
      )}
    </Pressable>
  );
}

type ActionRowProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  badge?: string;
  cardBg: string;
  dividerColor: string;
  textColor: string;
  last?: boolean;
};

function ActionRow({
  icon,
  label,
  value,
  onPress,
  badge,
  cardBg,
  dividerColor,
  textColor,
  last,
}: ActionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        backgroundColor: cardBg,
        opacity: pressed && !!onPress ? 0.7 : 1,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: dividerColor,
      })}
    >
      {icon && <View style={{ width: 24, alignItems: "center" }}>{icon}</View>}
      <Text style={{ flex: 1, fontSize: 15, color: textColor }}>{label}</Text>
      {badge ? (
        <View
          style={{
            backgroundColor: COLORS.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: COLORS.textSecondary,
              fontWeight: "500",
            }}
          >
            {badge}
          </Text>
        </View>
      ) : value ? (
        <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
          {value}
        </Text>
      ) : onPress ? (
        <IconSymbol
          name="chevron-right"
          size={16}
          color={COLORS.textSecondary}
        />
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colorScheme, setTheme } = useAppTheme();
  const currentLang = i18n.language as SupportedLanguageCode;

  const cardBg = useThemeColor(
    { light: COLORS.surface, dark: "#1e2122" },
    "text",
  );
  const textColor = useThemeColor({}, "text");
  const dividerColor = useThemeColor(
    { light: COLORS.outlineVariant, dark: "#2d3133" },
    "text",
  );

  const rowProps = { cardBg, textColor, dividerColor };

  const handleTheme = (theme: AppTheme) => setTheme(theme);

  const handleLanguage = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  const comingSoon = () =>
    Alert.alert(t("settings.comingSoon"), "", [{ text: "OK" }]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <AppHeader title={t("settings.title")} onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* Aparência */}
        <SectionHeader label={t("settings.appearance")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          <OptionRow
            {...rowProps}
            label={t("settings.light")}
            selected={colorScheme === "light"}
            onPress={() => handleTheme("light")}
          />
          <OptionRow
            {...rowProps}
            label={t("settings.dark")}
            selected={colorScheme === "dark"}
            onPress={() => handleTheme("dark")}
            last
          />
        </View>

        {/* Idioma */}
        <SectionHeader label={t("settings.language")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          {SUPPORTED_LANGUAGES.map((lang, idx) => (
            <OptionRow
              key={lang.code}
              {...rowProps}
              label={lang.label}
              selected={currentLang === lang.code}
              onPress={() => handleLanguage(lang.code)}
              last={idx === SUPPORTED_LANGUAGES.length - 1}
            />
          ))}
        </View>

        {/* Notificações */}
        <SectionHeader label={t("settings.notifications")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          <ActionRow
            {...rowProps}
            icon={
              <Bell
                size={20}
                color={COLORS.onSurfaceVariant}
                strokeWidth={1.75}
              />
            }
            label={t("settings.notificationsDesc")}
            onPress={comingSoon}
            badge={t("settings.comingSoon")}
            last
          />
        </View>

        {/* Segurança */}
        <SectionHeader label={t("settings.security")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          <ActionRow
            {...rowProps}
            icon={
              <Shield
                size={20}
                color={COLORS.onSurfaceVariant}
                strokeWidth={1.75}
              />
            }
            label={t("settings.securityDesc")}
            onPress={comingSoon}
            badge={t("settings.comingSoon")}
            last
          />
        </View>

        {/* Dados e privacidade */}
        <SectionHeader label={t("settings.data")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          <ActionRow
            {...rowProps}
            icon={
              <Database
                size={20}
                color={COLORS.onSurfaceVariant}
                strokeWidth={1.75}
              />
            }
            label={t("settings.exportData")}
            onPress={comingSoon}
            badge={t("settings.comingSoon")}
          />
          <ActionRow
            {...rowProps}
            icon={
              <Database
                size={20}
                color={COLORS.onSurfaceVariant}
                strokeWidth={1.75}
              />
            }
            label={t("settings.clearData")}
            onPress={comingSoon}
            badge={t("settings.comingSoon")}
            last
          />
        </View>

        {/* Sobre */}
        <SectionHeader label={t("settings.about")} />
        <View
          style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
        >
          <ActionRow
            {...rowProps}
            icon={
              <Info
                size={20}
                color={COLORS.onSurfaceVariant}
                strokeWidth={1.75}
              />
            }
            label={t("settings.version")}
            value={APP_VERSION}
          />
          <ActionRow
            {...rowProps}
            label={t("settings.terms")}
            onPress={comingSoon}
          />
          <ActionRow
            {...rowProps}
            label={t("settings.privacy")}
            onPress={comingSoon}
            last
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
