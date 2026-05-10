import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
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
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-10 gap-4">
        <IconSymbol
          name="tag.fill"
          size={64}
          color={iconColor}
          style={{ opacity: 0.4, marginBottom: 8 }}
        />
        <ThemedText type="title" className="text-center">
          {t('pricing.title')}
        </ThemedText>
        <ThemedText className="text-center opacity-60 leading-[22px]">
          {t('pricing.comingSoon')}
        </ThemedText>
      </View>
    </ThemedView>
  );
}
