import { useFocusEffect, useRouter } from 'expo-router';
import { LayoutGrid, List, Search } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, Pressable, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ProductCard, ProductCardGrid } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Input } from '@/components/ui/input';
import { deleteProduct } from '@/data/product-storage';
import { useColors } from '@/hooks/use-colors';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/types/product';

type ViewMode = 'list' | 'grid';

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colors = useColors();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { products, refresh } = useProducts();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function handleProductOptions(product: Product) {
    Alert.alert(product.name, undefined, [
      {
        text: t('pricing.edit'),
        onPress: () =>
          router.push({ pathname: '/new-product', params: { id: product.id } }),
      },
      {
        text: t('pricing.delete'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            t('pricing.confirmDelete'),
            t('pricing.confirmDeleteMessage'),
            [
              { text: t('pricing.cancel'), style: 'cancel' },
              {
                text: t('pricing.delete'),
                style: 'destructive',
                onPress: async () => {
                  await deleteProduct(product.id);
                  refresh();
                },
              },
            ],
          );
        },
      },
      { text: t('pricing.cancel'), style: 'cancel' },
    ]);
  }

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false),
      ),
    [products, search],
  );

  const toggleIcon =
    viewMode === 'list' ? (
      <LayoutGrid size={22} color="white" strokeWidth={1.75} />
    ) : (
      <List size={22} color="white" strokeWidth={1.75} />
    );

  return (
    <ThemedView style={{ flex: 1 }}>
      <AppHeader
        title={t('nav.products')}
        rightAction={
          products.length > 0 ? (
            <Pressable
              onPress={() => setViewMode((m) => (m === 'list' ? 'grid' : 'list'))}
              hitSlop={10}
            >
              {toggleIcon}
            </Pressable>
          ) : undefined
        }
      />

      <View style={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Input
          leftIcon={<Search size={20} color={colors.onSurfaceVariant} />}
          placeholder={t('home.searchPlaceholder')}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        key={viewMode}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={
          viewMode === 'grid' ? { gap: 12, paddingHorizontal: 16 } : undefined
        }
        renderItem={({ item }) =>
          viewMode === 'grid' ? (
            <ProductCardGrid product={item} onOptions={handleProductOptions} />
          ) : (
            <ProductCard product={item} onOptions={handleProductOptions} />
          )
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: viewMode === 'grid' ? 12 : 8 }} />
        )}
        contentContainerStyle={
          filtered.length === 0
            ? { flex: 1 }
            : viewMode === 'list'
              ? { paddingVertical: 8, paddingHorizontal: 16 }
              : { paddingVertical: 8 }
        }
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
            <ThemedText style={{ opacity: 0.5 }}>{t('home.empty')}</ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
