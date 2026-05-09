import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PricingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <IconSymbol name="tag.fill" size={64} color={iconColor} style={styles.icon} />
        <ThemedText type="title" style={styles.title}>
          {t('pricing.title')}
        </ThemedText>
        <ThemedText style={styles.description}>{t('pricing.comingSoon')}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  icon: {
    opacity: 0.4,
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
  },
});
