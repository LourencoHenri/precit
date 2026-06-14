import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ErrorField, FormState } from '@/types/pricing-form';
import { ChipSelector, FormField } from '../form-helpers';

const PRODUCT_CATEGORIES = [
  'Moda', 'Decoração', 'Acessórios', 'Cosméticos', 'Brinquedos', 'Papelaria', 'Outro',
];

type Props = {
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
  errors: Set<ErrorField>;
};

export function ProductDataStep({ form, set, errors }: Props) {
  const { t } = useTranslation();
  const inputBg = useThemeColor({ light: '#f3f4f6', dark: '#2d3133' }, 'background');
  const inputText = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');

  const inputStyle = { backgroundColor: inputBg, color: inputText } as const;

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionBasics')}
        </ThemedText>
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.stepProductDesc')}
        </ThemedText>
      </View>

      {/* Name */}
      <FormField
        label={t('pricing.productName')}
        required
        error={errors.has('name')}
        errorText={t('pricing.requiredFields')}
      >
        <TextInput
          style={[
            inputStyle,
            {
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 16,
              borderWidth: errors.has('name') ? 1.5 : 0,
            },
          ]}
          className={errors.has('name') ? 'border-red-400 dark:border-red-500' : ''}
          placeholder={t('pricing.productName')}
          placeholderTextColor={placeholderColor}
          value={form.name}
          onChangeText={(v) => set('name', v)}
          returnKeyType="next"
          autoCapitalize="words"
          autoFocus
        />
      </FormField>

      {/* Description */}
      <FormField label={t('pricing.description')} optional={t('pricing.optional')}>
        <TextInput
          style={[
            inputStyle,
            {
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 16,
              minHeight: 80,
              textAlignVertical: 'top',
            },
          ]}
          placeholder={t('pricing.description')}
          placeholderTextColor={placeholderColor}
          value={form.description}
          onChangeText={(v) => set('description', v)}
          multiline
        />
      </FormField>

      {/* Category */}
      <FormField label={t('pricing.category')} optional={t('pricing.optional')}>
        <ChipSelector
          options={PRODUCT_CATEGORIES}
          selected={form.category}
          onSelect={(v) => set('category', v)}
        />
      </FormField>

      {/* Notes */}
      <FormField label={t('pricing.notes')} optional={t('pricing.optional')}>
        <TextInput
          style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
          placeholder={t('pricing.notes')}
          placeholderTextColor={placeholderColor}
          value={form.notes}
          onChangeText={(v) => set('notes', v)}
        />
      </FormField>

      {/* Required field hint */}
      <Text className="text-xs text-[#687076] dark:text-[#9ba1a6]">
        <Text className="text-red-500">* </Text>
        {t('pricing.requiredFields')}
      </Text>
    </View>
  );
}
