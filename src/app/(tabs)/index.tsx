import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, FlatList, TextInput, View } from "react-native";

import { AppHeader } from "@/components/app-header";
import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { deleteProduct } from "@/data/product-storage";
import { useProducts } from "@/hooks/use-products";
import { Product } from "@/types/product";

const SURFACE = "#FEF7FF";
const INACTIVE = "#49454F";

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: SURFACE,
            borderRadius: 4,
            paddingLeft: 8,
            paddingRight: 16,
            height: 56,
          }}
        >
          <View
            style={{
              width: 40,
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol name="search" size={22} color={INACTIVE} />
          </View>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: "#1D1B20",
              letterSpacing: 0.5,
              padding: 0,
            }}
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor={INACTIVE}
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
