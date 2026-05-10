import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PricingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-1 items-center justify-center px-10 gap-6">
        <IconSymbol
          name="tag.fill"
          size={56}
          color={iconColor}
          style={{ opacity: 0.3 }}
        />
        <View className="items-center gap-2">
          <ThemedText type="title" className="text-center">
            {t('pricing.title')}
          </ThemedText>
          <ThemedText className="text-center opacity-60 leading-[22px]">
            {t('pricing.subtitle')}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => router.push('/new-product')}
          className="bg-primary rounded-xl px-8 py-4 items-center"
        >
          <Text className="text-white font-semibold text-base">
            {t('pricing.newProduct')}
          </Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}
