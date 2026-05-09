import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MOCK_PRODUCTS } from '@/data/mock-products';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Product } from '@/types/product';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const iconColor = useThemeColor({}, 'icon');
  const inputBg = useThemeColor({ light: '#f3f4f6', dark: '#2d3133' }, 'background');
  const inputText = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#9ca3af', dark: '#6b7280' }, 'icon');
  const separatorColor = useThemeColor({ light: '#e5e7eb', dark: '#2d3133' }, 'icon');

  const filtered = useMemo<Product[]>(
    () =>
      MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {t('home.title')}
        </ThemedText>
        <Pressable
          onPress={() => router.push('/modal')}
          hitSlop={12}
          accessibilityLabel={t('settings.title')}
        >
          <IconSymbol name="gearshape.fill" size={24} color={iconColor} />
        </Pressable>
      </View>

      <View style={[styles.searchWrapper, { borderBottomColor: separatorColor }]}>
        <View style={[styles.searchBox, { backgroundColor: inputBg }]}>
          <TextInput
            style={[styles.searchInput, { color: inputText }]}
            placeholder={t('home.searchPlaceholder')}
            placeholderTextColor={placeholderColor}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} priceLabel={t('home.finalPrice')} />
        )}
        contentContainerStyle={
          filtered.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>{t('home.empty')}</ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    flex: 1,
    marginRight: 8,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
});
