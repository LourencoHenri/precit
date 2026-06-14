import { useFocusEffect, useRouter } from "expo-router";
import { Search } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Input } from "@/components/ui/Input";
import { deleteProduct } from "@/data/product-storage";
import { useProducts } from "@/hooks/use-products";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/product";

const INACTIVE = "#49454F";

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchBg = useThemeColor(
    { light: "#FEF7FF", dark: "#1e2122" },
    "background",
  );
  const { products, refresh } = useProducts();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  function handleProductOptions(product: Product) {
    Alert.alert(product.name, undefined, [
      {
        text: t("pricing.edit"),
        onPress: () =>
          router.push({ pathname: "/new-product", params: { id: product.id } }),
      },
      {
        text: t("pricing.delete"),
        style: "destructive",
        onPress: () => {
          Alert.alert(
            t("pricing.confirmDelete"),
            t("pricing.confirmDeleteMessage"),
            [
              { text: t("pricing.cancel"), style: "cancel" },
              {
                text: t("pricing.delete"),
                style: "destructive",
                onPress: async () => {
                  await deleteProduct(product.id);
                  refresh();
                },
              },
            ],
          );
        },
      },
      { text: t("pricing.cancel"), style: "cancel" },
    ]);
  }

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description?.toLowerCase().includes(search.toLowerCase()) ??
            false),
      ),
    [products, search],
  );

  return (
    <ThemedView className="flex-1">
      <AppHeader title={t("nav.products")} />

      <View style={{ paddingTop: 8, paddingHorizontal: 16, paddingBottom: 10 }}>
        <Input
          leftIcon={<Search size={20} color={INACTIVE} />}
          placeholder={t("home.searchPlaceholder")}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
          wrapperStyle={{
            backgroundColor: searchBg,
            borderWidth: 0,
            height: 52,
            borderRadius: 12,
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onOptions={handleProductOptions} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={
          filtered.length === 0
            ? { flex: 1 }
            : { paddingVertical: 8, paddingHorizontal: 16 }
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 80,
            }}
          >
            <ThemedText className="text-base opacity-50">
              {t("home.empty")}
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
