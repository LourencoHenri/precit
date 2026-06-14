import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { AppHeader } from '@/components/app-header';
import { MaterialCard } from '@/components/material-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/Input';
import { deleteMaterial } from '@/data/material-storage';
import { useMaterials } from '@/hooks/use-materials';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Material } from '@/types/material';

const PRIMARY = '#6750A4';
const INACTIVE = '#49454F';

export default function MaterialsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const searchBg = useThemeColor({ light: '#FEF7FF', dark: '#1e2122' }, 'background');
  const { materials, loading, refresh } = useMaterials();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function handleMaterialOptions(material: Material) {
    Alert.alert(material.name, undefined, [
      {
        text: t('materials.edit'),
        onPress: () =>
          router.push({ pathname: '/new-material', params: { id: material.id } }),
      },
      {
        text: t('materials.delete'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            t('materials.confirmDelete'),
            t('materials.confirmDeleteMessage'),
            [
              { text: t('materials.cancel'), style: 'cancel' },
              {
                text: t('materials.delete'),
                style: 'destructive',
                onPress: async () => {
                  await deleteMaterial(material.id);
                  refresh();
                },
              },
            ],
          );
        },
      },
      { text: t('materials.cancel'), style: 'cancel' },
    ]);
  }

  const filtered = useMemo<Material[]>(() => {
    const q = search.toLowerCase();
    if (!q) return materials;
    return materials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q) ||
        m.supplier?.toLowerCase().includes(q),
    );
  }, [materials, search]);

  return (
    <ThemedView className="flex-1">
      <AppHeader title={t('nav.materials')} />

      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            leftIcon={<Search size={20} color={INACTIVE} />}
            placeholder={t('materials.searchPlaceholder')}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
            wrapperStyle={{ backgroundColor: searchBg, borderWidth: 0, height: 52, borderRadius: 12 }}
          />
        </View>
        <Pressable
          onPress={() => router.push('/new-material')}
          hitSlop={12}
          accessibilityLabel={t('materials.newMaterial')}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: PRIMARY,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconSymbol name="plus" size={22} color="white" />
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MaterialCard
              material={item}
              unitCostLabel={t('materials.unitCost')}
              stockLabel={t('materials.currentStock')}
              onOptions={handleMaterialOptions}
            />
          )}
          contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
              <ThemedText className="text-base opacity-50">{t('materials.empty')}</ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}
