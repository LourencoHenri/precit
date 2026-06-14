import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/themed-text';
import { FormState } from '@/types/pricing-form';
import { fmt } from '@/utils/format';
import { FormField, SectionHeader } from '../form-helpers';

type Props = {
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
  laborCost: number;
};

export function AdditionalCostsStep({ form, set, laborCost }: Props) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 20 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionAdditional')}
        </ThemedText>
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.stepCostsDesc')}
        </ThemedText>
      </View>

      {/* Labor */}
      <SectionHeader title={t('pricing.sectionLabor')} />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField label={t('pricing.laborHours')} optional={t('pricing.optional')}>
            <Input
              placeholder="0"
              value={form.laborHours}
              onChangeText={(v) => set('laborHours', v)}
              keyboardType="number-pad"
            />
          </FormField>
        </View>
        <View className="flex-1">
          <FormField label={t('pricing.laborMinutes')} optional={t('pricing.optional')}>
            <Input
              placeholder="0"
              value={form.laborMinutes}
              onChangeText={(v) => set('laborMinutes', v)}
              keyboardType="number-pad"
            />
          </FormField>
        </View>
      </View>

      <FormField label={t('pricing.hourlyRate')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.hourlyRate}
          onChangeText={(v) => set('hourlyRate', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      {laborCost > 0 && (
        <View className="rounded-xl px-4 py-3 border border-primary bg-zinc-50 dark:bg-[#1e2122]">
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] mb-1">
            {t('pricing.laborCostLabel')}
          </ThemedText>
          <ThemedText type="defaultSemiBold" className="text-lg text-primary dark:text-primary">
            {fmt(laborCost)}
          </ThemedText>
        </View>
      )}

      {/* Additional costs */}
      <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
      <SectionHeader title={t('pricing.sectionAdditional')} />

      <FormField label={t('pricing.packagingCost')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.packagingCost}
          onChangeText={(v) => set('packagingCost', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label={t('pricing.fixedCost')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.fixedCost}
          onChangeText={(v) => set('fixedCost', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label={t('pricing.extraCost')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.extraCost}
          onChangeText={(v) => set('extraCost', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      {/* Fees */}
      <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
      <SectionHeader title={t('pricing.sectionFees')} />

      <FormField label={t('pricing.cardFeePercent')} optional={t('pricing.optional')}>
        <Input
          placeholder="0"
          value={form.cardFeePercent}
          onChangeText={(v) => set('cardFeePercent', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label={t('pricing.marketplaceFeePercent')} optional={t('pricing.optional')}>
        <Input
          placeholder="0"
          value={form.marketplaceFeePercent}
          onChangeText={(v) => set('marketplaceFeePercent', v)}
          keyboardType="decimal-pad"
        />
      </FormField>

      <FormField label={t('pricing.otherFeePercent')} optional={t('pricing.optional')}>
        <Input
          placeholder="0"
          value={form.otherFeePercent}
          onChangeText={(v) => set('otherFeePercent', v)}
          keyboardType="decimal-pad"
        />
      </FormField>
    </View>
  );
}
