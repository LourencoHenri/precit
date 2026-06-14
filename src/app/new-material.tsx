import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/Input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { loadMaterials, storeMaterial } from '@/data/material-storage';
import { COLORS } from '@/constants/design';
import { Material } from '@/types/material';

const UNITS = ['unidade', 'pacote', 'rolo', 'metro', 'centímetro', 'kg', 'grama', 'litro', 'ml', 'caixa'];
const CATEGORIES = ['Tecido', 'Linha', 'Aviamento', 'Embalagem', 'Acabamento', 'Ferramenta', 'Outro'];

type FormState = {
  name: string;
  category: string;
  purchaseUnit: string;
  purchaseQuantity: string;
  purchasePrice: string;
  currentStock: string;
  minimumStock: string;
  supplier: string;
  notes: string;
};

type ErrorField = 'name' | 'purchaseUnit' | 'purchaseQuantity' | 'purchasePrice';

function parseDecimal(value: string): number {
  return parseFloat(value.replace(',', '.'));
}

function materialToFormState(material: Material): FormState {
  const str = (n: number | undefined) => (n !== undefined ? String(n) : '');
  const fmt = (n: number) => n.toFixed(2).replace('.', ',');
  return {
    name: material.name,
    category: material.category ?? '',
    purchaseUnit: material.purchaseUnit,
    purchaseQuantity: String(material.purchaseQuantity),
    purchasePrice: fmt(material.purchasePrice),
    currentStock: str(material.currentStock),
    minimumStock: str(material.minimumStock),
    supplier: material.supplier ?? '',
    notes: material.notes ?? '',
  };
}

function ChipSelector({
  options,
  selected,
  onSelect,
  hasError,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  hasError?: boolean;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(isSelected ? '' : opt)}
            className={[
              'px-3 py-1.5 rounded-full border',
              isSelected
                ? 'bg-primary border-primary'
                : hasError
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-zinc-300 dark:border-[#2d3133]',
            ].join(' ')}
          >
            <Text
              className={
                isSelected
                  ? 'text-white text-sm font-medium'
                  : 'text-sm text-[#11181C] dark:text-[#ECEDEE]'
              }
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  optional?: string;
  error?: boolean;
  errorText?: string;
  children: React.ReactNode;
};

function FormField({ label, required, optional, error, errorText, children }: FieldProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5">
        <ThemedText className="text-sm font-semibold text-[#687076] dark:text-[#9ba1a6]">
          {label}
        </ThemedText>
        {required ? (
          <Text className="text-sm text-red-500">*</Text>
        ) : optional ? (
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] opacity-60">
            ({optional})
          </ThemedText>
        ) : null}
      </View>
      {children}
      {error && errorText ? (
        <ThemedText className="text-xs text-red-500">{errorText}</ThemedText>
      ) : null}
    </View>
  );
}

const EMPTY_FORM: FormState = {
  name: '',
  category: '',
  purchaseUnit: '',
  purchaseQuantity: '',
  purchasePrice: '',
  currentStock: '',
  minimumStock: '',
  supplier: '',
  notes: '',
};

export default function NewMaterialScreen() {
  const { t } = useTranslation();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!editId;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [initialized, setInitialized] = useState(!isEditing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Set<ErrorField>>(new Set());
  const [saving, setSaving] = useState(false);

  // Load material data when editing
  useEffect(() => {
    if (!editId) return;
    loadMaterials().then((materials) => {
      const material = materials.find((m) => m.id === editId);
      if (!material) {
        router.back();
        return;
      }
      setForm(materialToFormState(material));
      setEditingId(material.id);
      setEditingCreatedAt(material.createdAt);
      setInitialized(true);
    });
  }, [editId]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors.size > 0) {
      setErrors((prev) => {
        const next = new Set(prev);
        next.delete(field as ErrorField);
        return next;
      });
    }
  }

  const qty = parseDecimal(form.purchaseQuantity);
  const price = parseDecimal(form.purchasePrice);
  const unitCost = !isNaN(qty) && qty > 0 && !isNaN(price) && price >= 0 ? price / qty : null;

  async function handleSave() {
    const newErrors = new Set<ErrorField>();

    if (!form.name.trim()) newErrors.add('name');
    if (!form.purchaseUnit) newErrors.add('purchaseUnit');
    if (!form.purchaseQuantity || isNaN(qty) || qty <= 0) newErrors.add('purchaseQuantity');
    if (!form.purchasePrice || isNaN(price) || price < 0) newErrors.add('purchasePrice');

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const material: Material = {
      id: editingId ?? Date.now().toString(),
      name: form.name.trim(),
      category: form.category || undefined,
      purchaseUnit: form.purchaseUnit,
      purchaseQuantity: qty,
      purchasePrice: price,
      unitCost: price / qty,
      currentStock: form.currentStock ? parseDecimal(form.currentStock) : undefined,
      minimumStock: form.minimumStock ? parseDecimal(form.minimumStock) : undefined,
      supplier: form.supplier.trim() || undefined,
      notes: form.notes.trim() || undefined,
      createdAt: editingCreatedAt ?? now,
      updatedAt: now,
    };

    await storeMaterial(material);
    setSaving(false);
    router.back();
  }

  if (!initialized) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <Stack.Screen
        options={{
          title: isEditing ? t('materials.editMaterial') : t('materials.newMaterial'),
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: Math.max(insets.bottom + 20, 40), gap: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <FormField
            label={t('materials.name')}
            required
            error={errors.has('name')}
            errorText={t('materials.requiredFields')}
          >
            <Input
              placeholder={t('materials.name')}
              value={form.name}
              onChangeText={(v) => set('name', v)}
              returnKeyType="next"
              autoCapitalize="words"
              wrapperStyle={errors.has('name') ? { borderColor: '#E5484D', borderWidth: 1.5 } : undefined}
            />
          </FormField>

          {/* Category */}
          <FormField label={t('materials.category')} optional={t('materials.optional')}>
            <ChipSelector
              options={CATEGORIES}
              selected={form.category}
              onSelect={(v) => set('category', v)}
            />
          </FormField>

          {/* Divider */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />

          {/* Purchase unit */}
          <FormField
            label={t('materials.purchaseUnit')}
            required
            error={errors.has('purchaseUnit')}
            errorText={t('materials.requiredFields')}
          >
            <ChipSelector
              options={UNITS}
              selected={form.purchaseUnit}
              onSelect={(v) => set('purchaseUnit', v)}
              hasError={errors.has('purchaseUnit')}
            />
          </FormField>

          {/* Purchase quantity */}
          <FormField
            label={t('materials.purchaseQuantity')}
            required
            error={errors.has('purchaseQuantity')}
            errorText={t('materials.invalidValue')}
          >
            <Input
              placeholder="0"
              value={form.purchaseQuantity}
              onChangeText={(v) => set('purchaseQuantity', v)}
              keyboardType="decimal-pad"
              returnKeyType="next"
              wrapperStyle={errors.has('purchaseQuantity') ? { borderColor: '#E5484D', borderWidth: 1.5 } : undefined}
            />
          </FormField>

          {/* Purchase price */}
          <FormField
            label={t('materials.purchasePrice')}
            required
            error={errors.has('purchasePrice')}
            errorText={t('materials.invalidValue')}
          >
            <Input
              placeholder="0,00"
              value={form.purchasePrice}
              onChangeText={(v) => set('purchasePrice', v)}
              keyboardType="decimal-pad"
              returnKeyType="next"
              wrapperStyle={errors.has('purchasePrice') ? { borderColor: '#E5484D', borderWidth: 1.5 } : undefined}
            />
          </FormField>

          {/* Unit cost — calculated */}
          {unitCost !== null ? (
            <View className="rounded-xl px-4 py-3 border border-primary bg-zinc-50 dark:bg-[#1e2122]">
              <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] mb-1">
                {t('materials.unitCost')}
              </ThemedText>
              <ThemedText type="defaultSemiBold" className="text-lg text-primary dark:text-primary">
                {`R$ ${unitCost.toFixed(2).replace('.', ',')} / ${form.purchaseUnit || '…'}`}
              </ThemedText>
            </View>
          ) : null}

          {/* Divider */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />

          {/* Current stock */}
          <FormField label={t('materials.currentStock')} optional={t('materials.optional')}>
            <Input
              placeholder="0"
              value={form.currentStock}
              onChangeText={(v) => set('currentStock', v)}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
          </FormField>

          {/* Minimum stock */}
          <FormField label={t('materials.minimumStock')} optional={t('materials.optional')}>
            <Input
              placeholder="0"
              value={form.minimumStock}
              onChangeText={(v) => set('minimumStock', v)}
              keyboardType="decimal-pad"
              returnKeyType="next"
            />
          </FormField>

          {/* Divider */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />

          {/* Supplier */}
          <FormField label={t('materials.supplier')} optional={t('materials.optional')}>
            <Input
              placeholder={t('materials.supplier')}
              value={form.supplier}
              onChangeText={(v) => set('supplier', v)}
              returnKeyType="next"
              autoCapitalize="words"
            />
          </FormField>

          {/* Notes */}
          <FormField label={t('materials.notes')} optional={t('materials.optional')}>
            <Input
              placeholder={t('materials.notes')}
              value={form.notes}
              onChangeText={(v) => set('notes', v)}
              multiline
              returnKeyType="done"
            />
          </FormField>

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="bg-primary rounded-xl py-4 items-center"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            <Text className="text-white font-semibold text-base">
              {t('materials.save')}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
