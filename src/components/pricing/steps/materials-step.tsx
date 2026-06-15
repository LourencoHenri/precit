import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { storeMaterial } from '@/data/material-storage';
import { useColors } from '@/hooks/use-colors';
import { Material } from '@/types/material';
import { FormState } from '@/types/pricing-form';
import { ProductMaterial } from '@/types/product';
import { parseDecimal } from '@/utils/format';
import { ChipSelector, FormField } from '../form-helpers';

const MATERIAL_UNITS = [
  'unidade',
  'pacote',
  'rolo',
  'metro',
  'centímetro',
  'kg',
  'grama',
  'litro',
  'ml',
  'caixa',
];

const COMPACT_INPUT: object = { borderRadius: 10, height: 44 };

type Props = {
  productMaterials: ProductMaterial[];
  onMaterialsChange: (mats: ProductMaterial[]) => void;
  catalog: Material[];
  onCatalogRefresh: () => void;
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
};

export function MaterialsStep({
  productMaterials,
  onMaterialsChange,
  catalog,
  onCatalogRefresh,
  form,
  set,
}: Props) {
  const { t } = useTranslation();
  const colors = useColors();

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
        <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
          {t('pricing.stepMaterialsDesc')}
        </ThemedText>
      </View>

      {/* Added materials list */}
      {productMaterials.map((m) => (
        <View
          key={m.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.surfaceContainerHigh,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }} numberOfLines={1}>
              {m.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
              {`${m.quantityUsed} ${m.unit} × R$ ${m.unitCost.toFixed(2).replace('.', ',')} = R$ ${m.totalCost.toFixed(2).replace('.', ',')}`}
            </ThemedText>
          </View>
          <Pressable onPress={() => removeMaterial(m.id)} hitSlop={8}>
            <Text style={{ fontSize: 18, color: colors.error, fontWeight: '700', lineHeight: 18 }}>
              ×
            </Text>
          </Pressable>
        </View>
      ))}

      {/* Catalog picker */}
      {catalogOpen && (
        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            overflow: 'hidden',
          }}
        >
          <View style={{ padding: 16, gap: 12 }}>
            <ThemedText type="defaultSemiBold">{t('pricing.addFromCatalog')}</ThemedText>

            <Input
              placeholder={t('pricing.searchMaterial')}
              value={catalogSearch}
              onChangeText={setCatalogSearch}
              autoFocus
              wrapperStyle={COMPACT_INPUT}
            />

            {filteredCatalog.length === 0 ? (
              <ThemedText style={{ fontSize: 14, opacity: 0.5, textAlign: 'center', paddingVertical: 8 }}>
                {t('pricing.noCatalogMaterials')}
              </ThemedText>
            ) : (
              <View style={{ gap: 8 }}>
                {filteredCatalog.map((m) => (
                  <Pressable
                    key={m.id}
                    onPress={() => setCatalogSelected(catalogSelected?.id === m.id ? null : m)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: catalogSelected?.id === m.id ? 2 : 1,
                      borderColor: catalogSelected?.id === m.id ? colors.primary : colors.outlineVariant,
                    }}
                  >
                    <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                      {m.name}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
                      {`R$ ${m.unitCost.toFixed(2).replace('.', ',')} / ${m.purchaseUnit}`}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            )}

            {catalogSelected && (
              <View style={{ gap: 8 }}>
                <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>
                  {`${t('pricing.quantityUsed')} (${catalogSelected.purchaseUnit})`}
                </ThemedText>
                <Input
                  placeholder="0"
                  value={catalogQty}
                  onChangeText={setCatalogQty}
                  keyboardType="decimal-pad"
                  wrapperStyle={COMPACT_INPUT}
                />
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <Pressable
                onPress={() => {
                  setCatalogOpen(false);
                  setCatalogSearch('');
                  setCatalogSelected(null);
                  setCatalogQty('');
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.outline,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onSurface }}>
                  {t('pricing.cancel')}
                </Text>
              </Pressable>
              <Pressable
                onPress={addFromCatalog}
                disabled={!catalogSelected || parseDecimal(catalogQty) <= 0}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  opacity: !catalogSelected || parseDecimal(catalogQty) <= 0 ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onPrimary }}>
                  {t('pricing.confirmAdd')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Custom material form */}
      {customOpen && (
        <View
          style={{
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.outlineVariant,
            overflow: 'hidden',
          }}
        >
          <View style={{ padding: 16, gap: 12 }}>
            <ThemedText type="defaultSemiBold">{t('pricing.addCustom')}</ThemedText>

            <Input
              placeholder={t('pricing.customMaterialName')}
              value={customName}
              onChangeText={setCustomName}
              autoFocus
              autoCapitalize="words"
              wrapperStyle={COMPACT_INPUT}
            />

            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: colors.onSurfaceVariant }}>
              {t('pricing.customUnit')}
            </ThemedText>
            <ChipSelector options={MATERIAL_UNITS} selected={customUnit} onSelect={setCustomUnit} />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <ThemedText style={{ fontSize: 12, fontWeight: '600', color: colors.onSurfaceVariant }}>
                  {t('pricing.customUnitCost')}
                </ThemedText>
                <Input
                  placeholder="0,00"
                  value={customUnitCost}
                  onChangeText={setCustomUnitCost}
                  keyboardType="decimal-pad"
                  wrapperStyle={COMPACT_INPUT}
                />
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                <ThemedText style={{ fontSize: 12, fontWeight: '600', color: colors.onSurfaceVariant }}>
                  {t('pricing.customQuantity')}
                </ThemedText>
                <Input
                  placeholder="0"
                  value={customQty}
                  onChangeText={setCustomQty}
                  keyboardType="decimal-pad"
                  wrapperStyle={COMPACT_INPUT}
                />
              </View>
            </View>

            <Pressable
              onPress={() => setCustomSaveToList((v) => !v)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: customSaveToList ? colors.primary : 'transparent',
                  borderColor: customSaveToList ? colors.primary : colors.outline,
                }}
              >
                {customSaveToList ? (
                  <Text style={{ color: colors.onPrimary, fontSize: 12, fontWeight: '700', lineHeight: 14 }}>
                    ✓
                  </Text>
                ) : null}
              </View>
              <ThemedText style={{ fontSize: 14, color: colors.onSurfaceVariant }}>
                {t('pricing.saveToList')}
              </ThemedText>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <Pressable
                onPress={() => {
                  setCustomOpen(false);
                  setCustomName('');
                  setCustomUnit('');
                  setCustomUnitCost('');
                  setCustomQty('');
                  setCustomSaveToList(false);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.outline,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onSurface }}>
                  {t('pricing.cancel')}
                </Text>
              </Pressable>
              <Pressable
                onPress={addCustomMaterial}
                disabled={!customName.trim() || !customUnit || parseDecimal(customQty) <= 0}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  opacity:
                    !customName.trim() || !customUnit || parseDecimal(customQty) <= 0 ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onPrimary }}>
                  {t('pricing.confirmAdd')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Add buttons */}
      {!catalogOpen && !customOpen && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => setCatalogOpen(true)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.outline,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onSurface }}>
              {`+ ${t('pricing.addFromCatalog')}`}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setCustomOpen(true)}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.outline,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.onSurface }}>
              {`+ ${t('pricing.addCustom')}`}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.outlineVariant }} />

      {/* Manual cost */}
      <FormField label={t('pricing.manualMaterialCost')} optional={t('pricing.optional')}>
        <Input
          placeholder="0,00"
          value={form.manualMaterialCost}
          onChangeText={(v) => set('manualMaterialCost', v)}
          keyboardType="decimal-pad"
        />
      </FormField>
    </View>
  );
}
