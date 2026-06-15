import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ImagePickerButton } from '@/components/ui/image-picker-button';
import { Input } from '@/components/ui/input';
import { useColors } from '@/hooks/use-colors';
import { ErrorField, FormState } from '@/types/pricing-form';
import { ChipSelector, FormField } from '../form-helpers';

const PRODUCT_CATEGORIES = [
  'Moda',
  'Decoração',
  'Acessórios',
  'Cosméticos',
  'Brinquedos',
  'Papelaria',
  'Outro',
];

type Props = {
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
  errors: Set<ErrorField>;
  imageUrl?: string;
  onImageChange: (uri: string | undefined) => void;
};

export function ProductDataStep({ form, set, errors, imageUrl, onImageChange }: Props) {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionBasics')}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
          {t('pricing.stepProductDesc')}
        </ThemedText>
      </View>

      {/* Image */}
      <FormField label="Imagem do produto" optional={t('pricing.optional')}>
        <ImagePickerButton value={imageUrl} onChange={onImageChange} />
      </FormField>

      {/* Name */}
      <FormField
        label={t('pricing.productName')}
        required
        error={errors.has('name')}
        errorText={t('pricing.requiredFields')}
      >
        <Input
          placeholder={t('pricing.productName')}
          value={form.name}
          onChangeText={(v) => set('name', v)}
          returnKeyType="next"
          autoCapitalize="words"
          wrapperStyle={
            errors.has('name') ? { borderColor: colors.error, borderWidth: 1.5 } : undefined
          }
        />
      </FormField>

      {/* Description */}
      <FormField label={t('pricing.description')} optional={t('pricing.optional')}>
        <Input
          placeholder={t('pricing.description')}
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
        <Input
          placeholder={t('pricing.notes')}
          value={form.notes}
          onChangeText={(v) => set('notes', v)}
        />
      </FormField>

      {/* Required field hint */}
      <Text style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
        <Text style={{ color: colors.error }}>* </Text>
        {t('pricing.requiredFields')}
      </Text>
    </View>
  );
}
