import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';
import { useThemeColor } from '@/hooks/use-theme-color';
import { FormState } from '@/types/pricing-form';
import { ProductMaterial } from '@/types/product';
import { fmt } from '@/utils/format';

type Props = {
  form: FormState;
  productMaterials: ProductMaterial[];
  totalMaterialCost: number;
  laborCost: number;
  otherCosts: number;
  totalCost: number;
  totalFeesPercent: number;
  suggestedPrice: number;
  profitValue: number;
  profitMarginPercent: number;
  finalPriceInput: string;
  setFinalPriceInput: (v: string) => void;
  setFinalPriceManual: (v: boolean) => void;
};

export function ReviewStep({
  form,
  productMaterials,
  totalMaterialCost,
  laborCost,
  otherCosts,
  totalCost,
  totalFeesPercent,
  suggestedPrice,
  profitValue,
  profitMarginPercent,
  finalPriceInput,
  setFinalPriceInput,
  setFinalPriceManual,
}: Props) {
  const { t } = useTranslation();
  const colors = useColors();

  const finalPriceCardBg = useThemeColor({ light: '#D6E3FF', dark: '#1A2D4A' }, 'background');
  const finalPriceColor = useThemeColor({ light: '#415F91', dark: '#AAC7FF' }, 'text');
  const finalPriceDivider = useThemeColor({ light: '#A8C1F0', dark: '#2D4A6D' }, 'background');
  const finalPricePlaceholder = useThemeColor({ light: '#7A9ECF', dark: '#4E6E99' }, 'icon');

  const summaryRows = [
    { label: t('pricing.totalMaterialCostLabel'), value: fmt(totalMaterialCost) },
    { label: t('pricing.laborCostLabel'), value: fmt(laborCost) },
    { label: t('pricing.otherCostsLabel'), value: fmt(otherCosts) },
    { label: t('pricing.totalCost'), value: fmt(totalCost), bold: true },
    { label: t('pricing.totalFees'), value: `${totalFeesPercent.toFixed(1)}%` },
    { label: t('pricing.suggestedPrice'), value: fmt(suggestedPrice), accent: true },
  ];

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionSummary')}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
          {t('pricing.stepReviewDesc')}
        </ThemedText>
      </View>

      {/* Product info recap */}
      <View
        style={{
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: colors.surfaceContainerLow,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          gap: 4,
        }}
      >
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }} numberOfLines={2}>
          {form.name}
        </ThemedText>
        {!!form.category && (
          <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
            {form.category}
          </ThemedText>
        )}
        {!!form.description && (
          <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }} numberOfLines={2}>
            {form.description}
          </ThemedText>
        )}
      </View>

      {/* Materials used (compact) */}
      {productMaterials.length > 0 && (
        <View style={{ gap: 8 }}>
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: colors.onSurfaceVariant,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            {t('pricing.sectionMaterials')}
          </ThemedText>
          {productMaterials.map((m) => (
            <View
              key={m.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.outlineVariant,
              }}
            >
              <ThemedText style={{ fontSize: 14, flex: 1, marginRight: 8 }} numberOfLines={1}>
                {m.name}
              </ThemedText>
              <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>{fmt(m.totalCost)}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Cost summary table */}
      <View
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          overflow: 'hidden',
        }}
      >
        {summaryRows.map(({ label, value, bold, accent }, index) => (
          <View
            key={label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: colors.outlineVariant,
            }}
          >
            <ThemedText
              style={{
                fontSize: 14,
                color: colors.onSurfaceVariant,
                fontWeight: bold ? '600' : '400',
              }}
            >
              {label}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: accent ? colors.primary : colors.onSurface,
              }}
            >
              {value}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Final price card — hero element */}
      <View style={{ backgroundColor: finalPriceCardBg, borderRadius: 20, overflow: 'hidden' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1.2,
                color: finalPriceColor,
                textTransform: 'uppercase',
              }}
            >
              {t('pricing.finalPrice')}
            </Text>
            <Pressable
              onPress={() => {
                setFinalPriceInput(
                  suggestedPrice > 0 ? suggestedPrice.toFixed(2).replace('.', ',') : '0,00',
                );
                setFinalPriceManual(false);
              }}
              hitSlop={8}
            >
              <Text style={{ fontSize: 12, color: finalPriceColor, fontWeight: '600' }}>
                {t('pricing.resetToSuggested')}
              </Text>
            </Pressable>
          </View>
          <TextInput
            style={{
              color: finalPriceColor,
              fontSize: 42,
              fontWeight: '800',
              letterSpacing: -1,
              padding: 0,
            }}
            value={finalPriceInput}
            onChangeText={(v) => {
              setFinalPriceInput(v);
              setFinalPriceManual(true);
            }}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={finalPricePlaceholder}
          />
        </View>

        {/* Profit indicators */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: finalPriceDivider }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 14,
              borderRightWidth: 1,
              borderRightColor: finalPriceDivider,
              gap: 4,
            }}
          >
            <Text style={{ fontSize: 11, color: colors.onSurfaceVariant, letterSpacing: 0.3 }}>
              {t('pricing.estimatedProfit')}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: profitValue >= 0 ? '#16a34a' : '#dc2626',
              }}
            >
              {fmt(profitValue)}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingVertical: 14, gap: 4 }}>
            <Text style={{ fontSize: 11, color: colors.onSurfaceVariant, letterSpacing: 0.3 }}>
              {t('pricing.realMargin')}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: profitMarginPercent >= 0 ? '#16a34a' : '#dc2626',
              }}
            >
              {`${profitMarginPercent.toFixed(1)}%`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
