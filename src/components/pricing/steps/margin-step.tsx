import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { useColors } from '@/hooks/use-colors';
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
  const colors = useColors();

  const hasMarginError = errors.has('margin') || (profitPct > 0 && profitPct + totalFeesPercent >= 100);

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionProfit')}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
          {t('pricing.stepMarginDesc')}
        </ThemedText>
      </View>

      {/* Summary of fees */}
      {totalFeesPercent > 0 && (
        <View
          style={{
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.surfaceContainerLow,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
          }}
        >
          <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant, marginBottom: 2 }}>
            {t('pricing.totalFees')}
          </ThemedText>
          <ThemedText type="defaultSemiBold">{`${totalFeesPercent.toFixed(1)}%`}</ThemedText>
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
          wrapperStyle={hasMarginError ? { borderColor: colors.error, borderWidth: 1.5 } : undefined}
        />
      </FormField>

      {/* OR divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.outlineVariant }} />
        <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
          {t('pricing.orLabel')}
        </ThemedText>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.outlineVariant }} />
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

      <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant, lineHeight: 20 }}>
        {profitPct > 0
          ? `Margem de lucro: ${profitPct.toFixed(1)}% sobre o preço final`
          : 'Deixe em branco para definir apenas o preço final na próxima etapa.'}
      </ThemedText>
    </View>
  );
}
