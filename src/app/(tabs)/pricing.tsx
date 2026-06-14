import { Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/design';

export default function PricingScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const benefits = [
    t('pricing.benefit1'),
    t('pricing.benefit2'),
    t('pricing.benefit3'),
  ];

  return (
    <ThemedView className="flex-1">
      <AppHeader title={t('nav.pricing')} />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          gap: 32,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primaryContainer,
            borderRadius: 28,
            width: 112,
            height: 112,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconSymbol name="tag" size={52} color={COLORS.primary} />
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <ThemedText type="title" className="text-center">
            {t('pricing.title')}
          </ThemedText>
          <ThemedText className="text-center opacity-60 leading-[22px]">
            {t('pricing.subtitle')}
          </ThemedText>
        </View>

        <View style={{ gap: 14, width: '100%' }}>
          {benefits.map((benefit) => (
            <View
              key={benefit}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: COLORS.primaryContainer,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={14} color={COLORS.primary} strokeWidth={2.5} />
              </View>
              <ThemedText style={{ fontSize: 15, flex: 1 }}>{benefit}</ThemedText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/new-product')}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            paddingHorizontal: 32,
            paddingVertical: 16,
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, letterSpacing: 0.3 }}>
            {t('pricing.newProduct')}
          </Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}
