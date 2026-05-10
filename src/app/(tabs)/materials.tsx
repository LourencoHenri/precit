import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialCard } from '@/components/material-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMaterials } from '@/hooks/use-materials';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Material } from '@/types/material';

export default function MaterialsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const { materials, loading, refresh } = useMaterials();

  const iconColor = useThemeColor({}, 'icon');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

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
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <ThemedText type="title" className="text-2xl leading-[30px]">
          {t('materials.title')}
        </ThemedText>
        <Pressable
          onPress={() => router.push('/new-material')}
          hitSlop={12}
          accessibilityLabel={t('materials.newMaterial')}
        >
          <IconSymbol name="plus" size={26} color={iconColor} />
        </Pressable>
      </View>

      <View className="px-4 pb-3 border-b border-zinc-200 dark:border-[#2d3133]">
        <View className="flex-row items-center bg-zinc-100 dark:bg-[#2d3133] rounded-xl px-3 py-2">
          <TextInput
            className="flex-1 text-base text-[#11181C] dark:text-[#ECEDEE] p-0"
            placeholder={t('materials.searchPlaceholder')}
            placeholderTextColor={placeholderColor}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0a7ea4" />
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
            />
          )}
          contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
              <ThemedText className="text-base opacity-50">{t('materials.empty')}</ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}
