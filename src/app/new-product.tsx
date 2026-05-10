import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { storeMaterial } from '@/data/material-storage';
import { storeProduct } from '@/data/product-storage';
import { useMaterials } from '@/hooks/use-materials';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Material } from '@/types/material';
import { Product, ProductMaterial } from '@/types/product';
import {
  calculateLaborCost,
  calculateMaterialCost,
  calculateProfitMargin,
  calculateProfitValue,
  calculateSuggestedPrice,
  calculateTotalCost,
} from '@/utils/pricing';

const PRODUCT_CATEGORIES = [
  'Moda', 'Decoração', 'Acessórios', 'Cosméticos', 'Brinquedos', 'Papelaria', 'Outro',
];
const MATERIAL_UNITS = [
  'unidade', 'pacote', 'rolo', 'metro', 'centímetro', 'kg', 'grama', 'litro', 'ml', 'caixa',
];

type FormState = {
  name: string;
  description: string;
  category: string;
  notes: string;
  manualMaterialCost: string;
  laborHours: string;
  laborMinutes: string;
  hourlyRate: string;
  packagingCost: string;
  fixedCost: string;
  extraCost: string;
  cardFeePercent: string;
  marketplaceFeePercent: string;
  otherFeePercent: string;
  desiredProfitPercent: string;
  desiredProfitValue: string;
};

type ErrorField = 'name' | 'margin';

function parseDecimal(v: string): number {
  const n = parseFloat(v.replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

function fmt(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
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

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <ThemedText type="defaultSemiBold" className="text-base">
        {title}
      </ThemedText>
      <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
    </View>
  );
}


export default function NewProductScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { materials: catalog, refresh: refreshCatalog } = useMaterials();

  const inputBg = useThemeColor({ light: '#f3f4f6', dark: '#2d3133' }, 'background');
  const inputText = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');

  const inputStyle = { backgroundColor: inputBg, color: inputText };

  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    category: '',
    notes: '',
    manualMaterialCost: '',
    laborHours: '',
    laborMinutes: '',
    hourlyRate: '',
    packagingCost: '',
    fixedCost: '',
    extraCost: '',
    cardFeePercent: '',
    marketplaceFeePercent: '',
    otherFeePercent: '',
    desiredProfitPercent: '',
    desiredProfitValue: '',
  });

  const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>([]);
  const [finalPriceInput, setFinalPriceInput] = useState('');
  const [finalPriceManual, setFinalPriceManual] = useState(false);
  const [errors, setErrors] = useState<Set<ErrorField>>(new Set());
  const [saving, setSaving] = useState(false);

  // Catalog picker state
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogSelected, setCatalogSelected] = useState<Material | null>(null);
  const [catalogQty, setCatalogQty] = useState('');

  // Custom material form state
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customUnitCost, setCustomUnitCost] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [customSaveToList, setCustomSaveToList] = useState(false);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete('margin');
      return next;
    });
  }

  // ─── Derived calculations ───────────────────────────────────

  const totalMaterialCost = useMemo(
    () => calculateMaterialCost(productMaterials, parseDecimal(form.manualMaterialCost)),
    [productMaterials, form.manualMaterialCost],
  );

  const laborCost = useMemo(
    () =>
      calculateLaborCost(
        parseDecimal(form.laborHours),
        parseDecimal(form.laborMinutes),
        parseDecimal(form.hourlyRate),
      ),
    [form.laborHours, form.laborMinutes, form.hourlyRate],
  );

  const otherCosts = useMemo(
    () =>
      Math.max(0, parseDecimal(form.packagingCost)) +
      Math.max(0, parseDecimal(form.fixedCost)) +
      Math.max(0, parseDecimal(form.extraCost)),
    [form.packagingCost, form.fixedCost, form.extraCost],
  );

  const totalCost = useMemo(
    () => calculateTotalCost(totalMaterialCost, laborCost, parseDecimal(form.packagingCost), parseDecimal(form.fixedCost), parseDecimal(form.extraCost)),
    [totalMaterialCost, laborCost, form.packagingCost, form.fixedCost, form.extraCost],
  );

  const totalFeesPercent = useMemo(
    () =>
      parseDecimal(form.cardFeePercent) +
      parseDecimal(form.marketplaceFeePercent) +
      parseDecimal(form.otherFeePercent),
    [form.cardFeePercent, form.marketplaceFeePercent, form.otherFeePercent],
  );

  const profitPct = parseDecimal(form.desiredProfitPercent);
  const profitVal = parseDecimal(form.desiredProfitValue);

  const suggestedPrice = useMemo(
    () =>
      calculateSuggestedPrice({
        totalCost,
        desiredProfitPercent: profitPct > 0 ? profitPct : undefined,
        desiredProfitValue: profitPct === 0 && profitVal > 0 ? profitVal : undefined,
        totalFeesPercent,
      }),
    [totalCost, profitPct, profitVal, totalFeesPercent],
  );

  useEffect(() => {
    if (!finalPriceManual) {
      setFinalPriceInput(suggestedPrice > 0 ? suggestedPrice.toFixed(2).replace('.', ',') : '');
    }
  }, [suggestedPrice, finalPriceManual]);

  const finalPrice = parseDecimal(finalPriceInput);

  const profitValue = useMemo(
    () => calculateProfitValue(finalPrice, totalCost, totalFeesPercent),
    [finalPrice, totalCost, totalFeesPercent],
  );

  const profitMarginPercent = useMemo(
    () => calculateProfitMargin(finalPrice, profitValue),
    [finalPrice, profitValue],
  );

  // ─── Material actions ───────────────────────────────────────

  function addFromCatalog() {
    if (!catalogSelected) return;
    const qty = parseDecimal(catalogQty);
    if (qty <= 0) return;
    const item: ProductMaterial = {
      id: Date.now().toString(),
      materialId: catalogSelected.id,
      name: catalogSelected.name,
      unit: catalogSelected.purchaseUnit,
      unitCost: catalogSelected.unitCost,
      quantityUsed: qty,
      totalCost: catalogSelected.unitCost * qty,
    };
    setProductMaterials((prev) => [...prev, item]);
    setCatalogOpen(false);
    setCatalogSearch('');
    setCatalogSelected(null);
    setCatalogQty('');
  }

  async function addCustomMaterial() {
    const uc = parseDecimal(customUnitCost);
    const qty = parseDecimal(customQty);
    if (!customName.trim() || !customUnit || uc < 0 || qty <= 0) return;

    const item: ProductMaterial = {
      id: Date.now().toString(),
      name: customName.trim(),
      unit: customUnit,
      unitCost: uc,
      quantityUsed: qty,
      totalCost: uc * qty,
      isCustom: true,
    };
    setProductMaterials((prev) => [...prev, item]);

    if (customSaveToList) {
      const now = new Date().toISOString();
      await storeMaterial({
        id: `mat_${Date.now()}`,
        name: customName.trim(),
        purchaseUnit: customUnit,
        purchaseQuantity: 1,
        purchasePrice: uc,
        unitCost: uc,
        createdAt: now,
        updatedAt: now,
      });
      refreshCatalog();
    }

    setCustomOpen(false);
    setCustomName('');
    setCustomUnit('');
    setCustomUnitCost('');
    setCustomQty('');
    setCustomSaveToList(false);
  }

  function removeMaterial(id: string) {
    setProductMaterials((prev) => prev.filter((m) => m.id !== id));
  }

  // ─── Save ───────────────────────────────────────────────────

  async function handleSave() {
    const newErrors = new Set<ErrorField>();
    if (!form.name.trim()) newErrors.add('name');
    if (profitPct + totalFeesPercent >= 100) newErrors.add('margin');

    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const product: Product = {
      id: Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category || undefined,
      notes: form.notes.trim() || undefined,
      materials: productMaterials,
      manualMaterialCost: parseDecimal(form.manualMaterialCost) > 0 ? parseDecimal(form.manualMaterialCost) : undefined,
      laborHours: parseDecimal(form.laborHours) > 0 ? parseDecimal(form.laborHours) : undefined,
      laborMinutes: parseDecimal(form.laborMinutes) > 0 ? parseDecimal(form.laborMinutes) : undefined,
      hourlyRate: parseDecimal(form.hourlyRate) > 0 ? parseDecimal(form.hourlyRate) : undefined,
      laborCost,
      packagingCost: parseDecimal(form.packagingCost) > 0 ? parseDecimal(form.packagingCost) : undefined,
      fixedCost: parseDecimal(form.fixedCost) > 0 ? parseDecimal(form.fixedCost) : undefined,
      extraCost: parseDecimal(form.extraCost) > 0 ? parseDecimal(form.extraCost) : undefined,
      cardFeePercent: parseDecimal(form.cardFeePercent) > 0 ? parseDecimal(form.cardFeePercent) : undefined,
      marketplaceFeePercent: parseDecimal(form.marketplaceFeePercent) > 0 ? parseDecimal(form.marketplaceFeePercent) : undefined,
      otherFeePercent: parseDecimal(form.otherFeePercent) > 0 ? parseDecimal(form.otherFeePercent) : undefined,
      desiredProfitPercent: profitPct > 0 ? profitPct : undefined,
      desiredProfitValue: profitPct === 0 && profitVal > 0 ? profitVal : undefined,
      totalMaterialCost,
      totalCost,
      suggestedPrice,
      finalPrice,
      profitValue,
      profitMarginPercent,
      createdAt: now,
      updatedAt: now,
    };

    await storeProduct(product);
    setSaving(false);
    router.back();
  }

  // ─── Catalog filter ─────────────────────────────────────────

  const filteredCatalog = catalog.filter(
    (m) =>
      m.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (m.category?.toLowerCase().includes(catalogSearch.toLowerCase()) ?? false),
  );

  // ─── Render ──────────────────────────────────────────────────

  return (
    <ThemedView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: Math.max(insets.bottom + 20, 40),
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── BASICS ──────────────────────────────────────── */}
          <SectionHeader title={t('pricing.sectionBasics')} />

          <FormField
            label={t('pricing.productName')}
            required
            error={errors.has('name')}
            errorText={t('pricing.requiredFields')}
          >
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, borderWidth: errors.has('name') ? 1.5 : 0 }]}
              className={errors.has('name') ? 'border-red-400 dark:border-red-500' : ''}
              placeholder={t('pricing.productName')}
              placeholderTextColor={placeholderColor}
              value={form.name}
              onChangeText={(v) => {
                set('name', v);
                setErrors((p) => { const n = new Set(p); n.delete('name'); return n; });
              }}
              returnKeyType="next"
              autoCapitalize="words"
            />
          </FormField>

          <FormField label={t('pricing.description')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, minHeight: 72, textAlignVertical: 'top' }]}
              placeholder={t('pricing.description')}
              placeholderTextColor={placeholderColor}
              value={form.description}
              onChangeText={(v) => set('description', v)}
              multiline
            />
          </FormField>

          <FormField label={t('pricing.category')} optional={t('pricing.optional')}>
            <ChipSelector
              options={PRODUCT_CATEGORIES}
              selected={form.category}
              onSelect={(v) => set('category', v)}
            />
          </FormField>

          <FormField label={t('pricing.notes')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder={t('pricing.notes')}
              placeholderTextColor={placeholderColor}
              value={form.notes}
              onChangeText={(v) => set('notes', v)}
            />
          </FormField>

          {/* ── MATERIALS ───────────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionMaterials')} />

          {productMaterials.map((m) => (
            <View
              key={m.id}
              className="flex-row items-center justify-between bg-zinc-100 dark:bg-[#2d3133] rounded-xl px-4 py-3"
            >
              <View className="flex-1 mr-3">
                <ThemedText type="defaultSemiBold" className="text-sm" numberOfLines={1}>
                  {m.name}
                </ThemedText>
                <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
                  {`${m.quantityUsed} ${m.unit} × R$ ${m.unitCost.toFixed(2).replace('.', ',')} = ${fmt(m.totalCost)}`}
                </ThemedText>
              </View>
              <Pressable onPress={() => removeMaterial(m.id)} hitSlop={8}>
                <Text className="text-lg text-red-500 font-bold leading-none">×</Text>
              </Pressable>
            </View>
          ))}

          {/* Catalog picker */}
          {catalogOpen ? (
            <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133]">
              <View className="p-4 gap-3">
                <ThemedText type="defaultSemiBold">{t('pricing.addFromCatalog')}</ThemedText>
                <TextInput
                  style={[inputStyle, { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }]}
                  placeholder={t('pricing.searchMaterial')}
                  placeholderTextColor={placeholderColor}
                  value={catalogSearch}
                  onChangeText={setCatalogSearch}
                  autoFocus
                />
                {filteredCatalog.length === 0 ? (
                  <ThemedText className="text-sm opacity-50 text-center py-4">
                    {t('pricing.noCatalogMaterials')}
                  </ThemedText>
                ) : (
                  <View className="gap-2">
                    {filteredCatalog.map((m) => (
                      <Pressable
                        key={m.id}
                        onPress={() => setCatalogSelected(catalogSelected?.id === m.id ? null : m)}
                        className={[
                          'px-4 py-3 rounded-xl border',
                          catalogSelected?.id === m.id
                            ? 'border-primary border-2'
                            : 'border-zinc-200 dark:border-[#2d3133]',
                        ].join(' ')}
                      >
                        <ThemedText type="defaultSemiBold" className="text-sm">
                          {m.name}
                        </ThemedText>
                        <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
                          {`R$ ${m.unitCost.toFixed(2).replace('.', ',')} / ${m.purchaseUnit}`}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}

                {catalogSelected ? (
                  <View className="gap-2">
                    <ThemedText className="text-sm font-semibold text-[#687076] dark:text-[#9ba1a6]">
                      {`${t('pricing.quantityUsed')} (${catalogSelected.purchaseUnit})`}
                    </ThemedText>
                    <TextInput
                      style={[inputStyle, { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }]}
                      placeholder="0"
                      placeholderTextColor={placeholderColor}
                      value={catalogQty}
                      onChangeText={setCatalogQty}
                      keyboardType="decimal-pad"
                    />
                  </View>
                ) : null}

                <View className="flex-row gap-3 mt-1">
                  <Pressable
                    onPress={() => {
                      setCatalogOpen(false);
                      setCatalogSearch('');
                      setCatalogSelected(null);
                      setCatalogQty('');
                    }}
                    className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
                  >
                    <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
                      {t('pricing.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={addFromCatalog}
                    disabled={!catalogSelected || parseDecimal(catalogQty) <= 0}
                    className="flex-1 py-3 rounded-xl bg-primary items-center"
                    style={{ opacity: !catalogSelected || parseDecimal(catalogQty) <= 0 ? 0.5 : 1 }}
                  >
                    <Text className="text-sm font-medium text-white">
                      {t('pricing.confirmAdd')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          {/* Custom material form */}
          {customOpen ? (
            <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133]">
              <View className="p-4 gap-3">
                <ThemedText type="defaultSemiBold">{t('pricing.addCustom')}</ThemedText>

                <TextInput
                  style={[inputStyle, { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }]}
                  placeholder={t('pricing.customMaterialName')}
                  placeholderTextColor={placeholderColor}
                  value={customName}
                  onChangeText={setCustomName}
                  autoFocus
                  autoCapitalize="words"
                />

                <ThemedText className="text-xs font-semibold text-[#687076] dark:text-[#9ba1a6]">
                  {t('pricing.customUnit')}
                </ThemedText>
                <ChipSelector
                  options={MATERIAL_UNITS}
                  selected={customUnit}
                  onSelect={setCustomUnit}
                />

                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    <ThemedText className="text-xs font-semibold text-[#687076] dark:text-[#9ba1a6]">
                      {t('pricing.customUnitCost')}
                    </ThemedText>
                    <TextInput
                      style={[inputStyle, { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }]}
                      placeholder="0,00"
                      placeholderTextColor={placeholderColor}
                      value={customUnitCost}
                      onChangeText={setCustomUnitCost}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View className="flex-1 gap-2">
                    <ThemedText className="text-xs font-semibold text-[#687076] dark:text-[#9ba1a6]">
                      {t('pricing.customQuantity')}
                    </ThemedText>
                    <TextInput
                      style={[inputStyle, { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15 }]}
                      placeholder="0"
                      placeholderTextColor={placeholderColor}
                      value={customQty}
                      onChangeText={setCustomQty}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <Pressable
                  onPress={() => setCustomSaveToList((v) => !v)}
                  className="flex-row items-center gap-2"
                >
                  <View
                    className={[
                      'w-5 h-5 rounded border items-center justify-center',
                      customSaveToList
                        ? 'bg-primary border-primary'
                        : 'border-zinc-300 dark:border-[#2d3133]',
                    ].join(' ')}
                  >
                    {customSaveToList ? (
                      <Text className="text-white text-xs font-bold leading-none">✓</Text>
                    ) : null}
                  </View>
                  <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
                    {t('pricing.saveToList')}
                  </ThemedText>
                </Pressable>

                <View className="flex-row gap-3 mt-1">
                  <Pressable
                    onPress={() => {
                      setCustomOpen(false);
                      setCustomName('');
                      setCustomUnit('');
                      setCustomUnitCost('');
                      setCustomQty('');
                      setCustomSaveToList(false);
                    }}
                    className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
                  >
                    <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
                      {t('pricing.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={addCustomMaterial}
                    disabled={!customName.trim() || !customUnit || parseDecimal(customQty) <= 0}
                    className="flex-1 py-3 rounded-xl bg-primary items-center"
                    style={{ opacity: !customName.trim() || !customUnit || parseDecimal(customQty) <= 0 ? 0.5 : 1 }}
                  >
                    <Text className="text-sm font-medium text-white">
                      {t('pricing.confirmAdd')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}

          {/* Add material buttons */}
          {!catalogOpen && !customOpen ? (
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => { setCatalogOpen(true); }}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
              >
                <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
                  {`+ ${t('pricing.addFromCatalog')}`}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => { setCustomOpen(true); }}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
              >
                <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
                  {`+ ${t('pricing.addCustom')}`}
                </Text>
              </Pressable>
            </View>
          ) : null}

          <FormField label={t('pricing.manualMaterialCost')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.manualMaterialCost}
              onChangeText={(v) => set('manualMaterialCost', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          {/* ── LABOR ───────────────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionLabor')} />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField label={t('pricing.laborHours')} optional={t('pricing.optional')}>
                <TextInput
                  style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
                  placeholder="0"
                  placeholderTextColor={placeholderColor}
                  value={form.laborHours}
                  onChangeText={(v) => set('laborHours', v)}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
            <View className="flex-1">
              <FormField label={t('pricing.laborMinutes')} optional={t('pricing.optional')}>
                <TextInput
                  style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
                  placeholder="0"
                  placeholderTextColor={placeholderColor}
                  value={form.laborMinutes}
                  onChangeText={(v) => set('laborMinutes', v)}
                  keyboardType="number-pad"
                />
              </FormField>
            </View>
          </View>

          <FormField label={t('pricing.hourlyRate')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.hourlyRate}
              onChangeText={(v) => set('hourlyRate', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          {laborCost > 0 ? (
            <View className="rounded-xl px-4 py-3 border border-primary bg-zinc-50 dark:bg-[#1e2122]">
              <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] mb-1">
                {t('pricing.laborCostLabel')}
              </ThemedText>
              <ThemedText type="defaultSemiBold" className="text-lg text-primary dark:text-primary">
                {fmt(laborCost)}
              </ThemedText>
            </View>
          ) : null}

          {/* ── ADDITIONAL COSTS ─────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionAdditional')} />

          <FormField label={t('pricing.packagingCost')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.packagingCost}
              onChangeText={(v) => set('packagingCost', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          <FormField label={t('pricing.fixedCost')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.fixedCost}
              onChangeText={(v) => set('fixedCost', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          <FormField label={t('pricing.extraCost')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.extraCost}
              onChangeText={(v) => set('extraCost', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          {/* ── FEES ────────────────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionFees')} />

          <FormField label={t('pricing.cardFeePercent')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              value={form.cardFeePercent}
              onChangeText={(v) => set('cardFeePercent', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          <FormField label={t('pricing.marketplaceFeePercent')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              value={form.marketplaceFeePercent}
              onChangeText={(v) => set('marketplaceFeePercent', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          <FormField label={t('pricing.otherFeePercent')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              value={form.otherFeePercent}
              onChangeText={(v) => set('otherFeePercent', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          {errors.has('margin') ? (
            <ThemedText className="text-xs text-red-500">
              {t('pricing.invalidMargin')}
            </ThemedText>
          ) : null}

          {/* ── PROFIT ──────────────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionProfit')} />

          <FormField label={t('pricing.desiredProfitPercent')} optional={t('pricing.optional')}>
            <TextInput
              style={[inputStyle, { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 }]}
              placeholder="0"
              placeholderTextColor={placeholderColor}
              value={form.desiredProfitPercent}
              onChangeText={(v) => set('desiredProfitPercent', v)}
              keyboardType="decimal-pad"
            />
          </FormField>

          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
            <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
              {t('pricing.orLabel')}
            </ThemedText>
            <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
          </View>

          <FormField label={t('pricing.desiredProfitValue')} optional={t('pricing.optional')}>
            <TextInput
              style={[
                inputStyle,
                { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
                profitPct > 0 ? { opacity: 0.4 } : null,
              ]}
              placeholder="0,00"
              placeholderTextColor={placeholderColor}
              value={form.desiredProfitValue}
              onChangeText={(v) => set('desiredProfitValue', v)}
              keyboardType="decimal-pad"
              editable={profitPct === 0}
            />
          </FormField>

          {/* ── SUMMARY ─────────────────────────────────────── */}
          <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />
          <SectionHeader title={t('pricing.sectionSummary')} />

          <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133] overflow-hidden">
            {[
              { label: t('pricing.totalMaterialCostLabel'), value: fmt(totalMaterialCost) },
              { label: t('pricing.laborCostLabel'), value: fmt(laborCost) },
              { label: t('pricing.otherCostsLabel'), value: fmt(otherCosts) },
              { label: t('pricing.totalCost'), value: fmt(totalCost), bold: true },
              { label: t('pricing.totalFees'), value: `${totalFeesPercent.toFixed(1)}%` },
              { label: t('pricing.suggestedPrice'), value: fmt(suggestedPrice), accent: true },
            ].map(({ label, value, bold, accent }, index) => (
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

          {/* Final price */}
          <View className="rounded-xl border border-primary overflow-hidden">
            <View className="px-4 pt-4 pb-3 gap-3">
              <View className="flex-row items-center justify-between">
                <ThemedText type="defaultSemiBold">{t('pricing.finalPrice')}</ThemedText>
                <Pressable
                  onPress={() => {
                    setFinalPriceInput(
                      suggestedPrice > 0 ? suggestedPrice.toFixed(2).replace('.', ',') : '0,00',
                    );
                    setFinalPriceManual(false);
                  }}
                  hitSlop={8}
                >
                  <Text className="text-xs text-primary font-semibold">
                    {t('pricing.resetToSuggested')}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                style={{
                  backgroundColor: inputBg,
                  color: '#0a7ea4',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 26,
                  fontWeight: '700',
                }}
                value={finalPriceInput}
                onChangeText={(v) => {
                  setFinalPriceInput(v);
                  setFinalPriceManual(true);
                }}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor={placeholderColor}
              />
            </View>
            <View className="flex-row border-t border-zinc-100 dark:border-[#2d3133]">
              <View className="flex-1 items-center py-3 border-r border-zinc-100 dark:border-[#2d3133]">
                <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
                  {t('pricing.estimatedProfit')}
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  className={`text-sm ${profitValue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}
                >
                  {fmt(profitValue)}
                </ThemedText>
              </View>
              <View className="flex-1 items-center py-3">
                <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
                  {t('pricing.realMargin')}
                </ThemedText>
                <ThemedText
                  type="defaultSemiBold"
                  className={`text-sm ${profitMarginPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}
                >
                  {`${profitMarginPercent.toFixed(1)}%`}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Save button */}
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="bg-primary rounded-xl py-4 items-center"
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                {t('pricing.save')}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
