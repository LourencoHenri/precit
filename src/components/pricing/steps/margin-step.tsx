import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/themed-text';
import { ErrorField, FormState } from '@/types/pricing-form';
import { FormField } from '../form-helpers';

type Props = {
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
  errors: Set<ErrorField>;
  profitPct: number;
  totalFeesPercent: number;
};

export function MarginStep({ form, set, errors, profitPct, totalFeesPercent }: Props) {
  const { t } = useTranslation();

  const hasMarginError = errors.has('margin') || (profitPct > 0 && profitPct + totalFeesPercent >= 100);

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionProfit')}
        </ThemedText>
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.stepMarginDesc')}
        </ThemedText>
      </View>

      {/* Summary of fees (context for the user) */}
      {totalFeesPercent > 0 && (
        <View className="rounded-xl px-4 py-3 bg-zinc-50 dark:bg-[#1e2122] border border-zinc-200 dark:border-[#2d3133]">
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] mb-0.5">
            {t('pricing.totalFees')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" className="text-base">
            {`${totalFeesPercent.toFixed(1)}%`}
          </ThemedText>
        </View>
      )}

      {/* Profit % */}
      <FormField
        label={t('pricing.desiredProfitPercent')}
        optional={t('pricing.optional')}
        error={hasMarginError}
        errorText={t('pricing.invalidMargin')}
      >
        <Input
          placeholder="0"
          value={form.desiredProfitPercent}
          onChangeText={(v) => set('desiredProfitPercent', v)}
          keyboardType="decimal-pad"
          wrapperStyle={hasMarginError ? { borderColor: '#E5484D', borderWidth: 1.5 } : undefined}
        />
      </FormField>

      {/* OR divider */}
      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
        <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.orLabel')}
        </ThemedText>
        <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
      </View>

      {/* Profit value */}
      <FormField label={t('pricing.desiredProfitValue')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.desiredProfitValue}
          onChangeText={(v) => set('desiredProfitValue', v)}
          keyboardType="decimal-pad"
          editable={profitPct === 0}
          wrapperStyle={profitPct > 0 ? { opacity: 0.4 } : undefined}
        />
      </FormField>

      <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] leading-5">
        {profitPct > 0
          ? `Margem de lucro: ${profitPct.toFixed(1)}% sobre o preço final`
          : 'Deixe em branco para definir apenas o preço final na próxima etapa.'}
      </ThemedText>
    </View>
  );
}
