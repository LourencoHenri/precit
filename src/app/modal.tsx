import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import i18n, { LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/i18n';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { AppTheme } from '@/providers/theme-provider';

type OptionRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function OptionRow({ label, selected, onPress }: OptionRowProps) {
  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2d3133' }, 'icon');
  const activeColor = '#0a7ea4';

  return (
    <Pressable
      style={[styles.optionRow, { borderBottomColor: borderColor }]}
      onPress={onPress}
    >
      <ThemedText style={selected ? { color: activeColor, fontWeight: '600' } : undefined}>
        {label}
      </ThemedText>
      {selected && <IconSymbol name="chevron.right" size={16} color={activeColor} />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colorScheme, setTheme } = useAppTheme();
  const sectionBg = useThemeColor({ light: '#f9fafb', dark: '#1e2122' }, 'background');
  const sectionLabel = useThemeColor({ light: '#687076', dark: '#9ba1a6' }, 'icon');

  const currentLang = i18n.language as SupportedLanguageCode;

  const handleTheme = (theme: AppTheme) => {
    setTheme(theme);
  };

  const handleLanguage = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  };

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: sectionLabel }]}>
          {t('settings.theme').toUpperCase()}
        </ThemedText>
        <View style={[styles.sectionBox, { backgroundColor: sectionBg }]}>
          <OptionRow
            label={t('settings.light')}
            selected={colorScheme === 'light'}
            onPress={() => handleTheme('light')}
          />
          <OptionRow
            label={t('settings.dark')}
            selected={colorScheme === 'dark'}
            onPress={() => handleTheme('dark')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={[styles.sectionLabel, { color: sectionLabel }]}>
          {t('settings.language').toUpperCase()}
        </ThemedText>
        <View style={[styles.sectionBox, { backgroundColor: sectionBg }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  sectionBox: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
