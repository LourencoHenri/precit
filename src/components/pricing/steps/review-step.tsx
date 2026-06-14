import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { COLORS } from '@/constants/design';
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
  const finalPriceCardBg = useThemeColor({ light: '#F3EFF9', dark: '#1E1A2B' }, 'background');
  const finalPriceColor = useThemeColor({ light: COLORS.primary, dark: '#D0BCFF' }, 'text');
  const finalPriceDivider = useThemeColor({ light: '#E8DEF8', dark: '#2D2440' }, 'background');
  const finalPricePlaceholder = useThemeColor({ light: '#C4B5E0', dark: '#6B5E8C' }, 'icon');

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
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.stepReviewDesc')}
        </ThemedText>
      </View>

      {/* Product info recap */}
      <View
        className="rounded-xl px-4 py-3 bg-zinc-50 dark:bg-[#1e2122] border border-zinc-200 dark:border-[#2d3133]"
        style={{ gap: 4 }}
      >
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }} numberOfLines={2}>
          {form.name}
        </ThemedText>
        {!!form.category && (
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
            {form.category}
          </ThemedText>
        )}
        {!!form.description && (
          <ThemedText className="text-sm text-[#49454F] dark:text-[#9ba1a6]" numberOfLines={2}>
            {form.description}
          </ThemedText>
        )}
      </View>

      {/* Materials used (compact) */}
      {productMaterials.length > 0 && (
        <View style={{ gap: 8 }}>
          <ThemedText className="text-xs font-semibold text-[#687076] dark:text-[#9ba1a6] uppercase tracking-wide">
            {t('pricing.sectionMaterials')}
          </ThemedText>
          {productMaterials.map((m) => (
            <View
              key={m.id}
              className="flex-row justify-between items-center py-2 border-b border-zinc-100 dark:border-[#2d3133]"
            >
              <ThemedText className="text-sm flex-1 mr-2" numberOfLines={1}>
                {m.name}
              </ThemedText>
              <ThemedText className="text-sm font-semibold">{fmt(m.totalCost)}</ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Cost summary table */}
      <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133] overflow-hidden">
        {summaryRows.map(({ label, value, bold, accent }, index) => (
          <View
            key={label}
            className={`flex-row justify-between items-center px-4 py-3${index > 0 ? ' border-t border-zinc-100 dark:border-[#2d3133]' : ''}`}
          >
            <ThemedText
              className={`text-sm text-[#687076] dark:text-[#9ba1a6]${bold ? ' font-semibold' : ''}`}
            >
              {label}
            </ThemedText>
            <ThemedText
              className={`text-sm font-semibold${accent ? ' text-primary dark:text-primary' : ''}`}
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
            <Text style={{ fontSize: 11, color: COLORS.textSecondary, letterSpacing: 0.3 }}>
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
            <Text style={{ fontSize: 11, color: COLORS.textSecondary, letterSpacing: 0.3 }}>
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
