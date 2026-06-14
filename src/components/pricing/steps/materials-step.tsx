import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Material } from '@/types/material';
import { FormState } from '@/types/pricing-form';
import { ProductMaterial } from '@/types/product';
import { parseDecimal } from '@/utils/format';
import { storeMaterial } from '@/data/material-storage';
import { ChipSelector, FormField } from '../form-helpers';

const PRIMARY = '#6750A4';
const MATERIAL_UNITS = [
  'unidade', 'pacote', 'rolo', 'metro', 'centímetro', 'kg', 'grama', 'litro', 'ml', 'caixa',
];

type Props = {
  productMaterials: ProductMaterial[];
  onMaterialsChange: (mats: ProductMaterial[]) => void;
  catalog: Material[];
  onCatalogRefresh: () => void;
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
};

export function MaterialsStep({ productMaterials, onMaterialsChange, catalog, onCatalogRefresh, form, set }: Props) {
  const { t } = useTranslation();
  const inputBg = useThemeColor({ light: '#f3f4f6', dark: '#2d3133' }, 'background');
  const inputText = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');

  const inputStyle = { backgroundColor: inputBg, color: inputText } as const;

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogSelected, setCatalogSelected] = useState<Material | null>(null);
  const [catalogQty, setCatalogQty] = useState('');

  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customUnitCost, setCustomUnitCost] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [customSaveToList, setCustomSaveToList] = useState(false);

  const filteredCatalog = catalog.filter(
    (m) =>
      m.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (m.category?.toLowerCase().includes(catalogSearch.toLowerCase()) ?? false),
  );

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
    onMaterialsChange([...productMaterials, item]);
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
    onMaterialsChange([...productMaterials, item]);

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
      onCatalogRefresh();
    }

    setCustomOpen(false);
    setCustomName('');
    setCustomUnit('');
    setCustomUnitCost('');
    setCustomQty('');
    setCustomSaveToList(false);
  }

  function removeMaterial(id: string) {
    onMaterialsChange(productMaterials.filter((m) => m.id !== id));
  }

  return (
    <View style={{ gap: 20 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t('pricing.sectionMaterials')}
        </ThemedText>
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t('pricing.stepMaterialsDesc')}
        </ThemedText>
      </View>

      {/* Added materials list */}
      {productMaterials.map((m) => (
        <View
          key={m.id}
          className="flex-row items-center justify-between bg-zinc-100 dark:bg-[#2d3133] rounded-xl px-4 py-3"
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <ThemedText type="defaultSemiBold" className="text-sm" numberOfLines={1}>
              {m.name}
            </ThemedText>
            <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
              {`${m.quantityUsed} ${m.unit} × R$ ${m.unitCost.toFixed(2).replace('.', ',')} = R$ ${m.totalCost.toFixed(2).replace('.', ',')}`}
            </ThemedText>
          </View>
          <Pressable onPress={() => removeMaterial(m.id)} hitSlop={8}>
            <Text className="text-lg text-red-500 font-bold leading-none">×</Text>
          </Pressable>
        </View>
      ))}

      {/* Catalog picker */}
      {catalogOpen && (
        <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133] overflow-hidden">
          <View style={{ padding: 16, gap: 12 }}>
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
              <ThemedText className="text-sm opacity-50 text-center py-2">
                {t('pricing.noCatalogMaterials')}
              </ThemedText>
            ) : (
              <View style={{ gap: 8 }}>
                {filteredCatalog.map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => setCatalogSelected(catalogSelected?.id === m.id ? null : m)}
                    className={[
                      'px-4 py-3 rounded-xl border',
                      catalogSelected?.id === m.id ? 'border-primary border-2' : 'border-zinc-200 dark:border-[#2d3133]',
                    ].join(' ')}
                  >
                    <ThemedText type="defaultSemiBold" className="text-sm">{m.name}</ThemedText>
                    <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
                      {`R$ ${m.unitCost.toFixed(2).replace('.', ',')} / ${m.purchaseUnit}`}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}

            {catalogSelected && (
              <View style={{ gap: 8 }}>
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
            )}

            <View className="flex-row gap-3 mt-1">
              <Pressable
                onPress={() => { setCatalogOpen(false); setCatalogSearch(''); setCatalogSelected(null); setCatalogQty(''); }}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
              >
                <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">{t('pricing.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={addFromCatalog}
                disabled={!catalogSelected || parseDecimal(catalogQty) <= 0}
                className="flex-1 py-3 rounded-xl bg-primary items-center"
                style={{ opacity: !catalogSelected || parseDecimal(catalogQty) <= 0 ? 0.5 : 1 }}
              >
                <Text className="text-sm font-medium text-white">{t('pricing.confirmAdd')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Custom material form */}
      {customOpen && (
        <View className="rounded-xl border border-zinc-200 dark:border-[#2d3133] overflow-hidden">
          <View style={{ padding: 16, gap: 12 }}>
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
            <ChipSelector options={MATERIAL_UNITS} selected={customUnit} onSelect={setCustomUnit} />

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

            <Pressable onPress={() => setCustomSaveToList((v) => !v)} className="flex-row items-center gap-2">
              <View
                className={[
                  'w-5 h-5 rounded border items-center justify-center',
                  customSaveToList ? 'bg-primary border-primary' : 'border-zinc-300 dark:border-[#2d3133]',
                ].join(' ')}
              >
                {customSaveToList ? <Text className="text-white text-xs font-bold leading-none">✓</Text> : null}
              </View>
              <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
                {t('pricing.saveToList')}
              </ThemedText>
            </Pressable>

            <View className="flex-row gap-3 mt-1">
              <Pressable
                onPress={() => { setCustomOpen(false); setCustomName(''); setCustomUnit(''); setCustomUnitCost(''); setCustomQty(''); setCustomSaveToList(false); }}
                className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
              >
                <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">{t('pricing.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={addCustomMaterial}
                disabled={!customName.trim() || !customUnit || parseDecimal(customQty) <= 0}
                className="flex-1 py-3 rounded-xl bg-primary items-center"
                style={{ opacity: !customName.trim() || !customUnit || parseDecimal(customQty) <= 0 ? 0.5 : 1 }}
              >
                <Text className="text-sm font-medium text-white">{t('pricing.confirmAdd')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Add buttons */}
      {!catalogOpen && !customOpen && (
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => setCatalogOpen(true)}
            className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
          >
            <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
              {`+ ${t('pricing.addFromCatalog')}`}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCustomOpen(true)}
            className="flex-1 py-3 rounded-xl border border-zinc-300 dark:border-[#2d3133] items-center"
          >
            <Text className="text-sm font-medium text-[#11181C] dark:text-[#ECEDEE]">
              {`+ ${t('pricing.addCustom')}`}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Divider */}
      <View className="h-px bg-zinc-200 dark:bg-[#2d3133]" />

      {/* Manual cost */}
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
    </View>
  );
}
