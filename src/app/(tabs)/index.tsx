import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProductCard } from "@/components/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Product } from "@/types/product";

export default function ProductsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const iconColor = useThemeColor({}, "icon");
  const placeholderColor = useThemeColor(
    { light: "#9ca3af", dark: "#6b7280" },
    "icon",
  );

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
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <ThemedText
          type="title"
          className="text-2xl leading-[30px] flex-1 mr-2"
        >
          {t("home.title")}
        </ThemedText>
        <Pressable
          onPress={() => router.push("/modal")}
          hitSlop={12}
          accessibilityLabel={t("settings.title")}
        >
          <IconSymbol name="gearshape.fill" size={24} color={iconColor} />
        </Pressable>
      </View>

      <View className="px-4 pb-3 border-b border-zinc-200 dark:border-[#2d3133]">
        <View className="flex-row items-center bg-zinc-100 dark:bg-[#2d3133] rounded-xl px-3 py-2">
          <TextInput
            className="flex-1 text-base text-[#11181C] dark:text-[#ECEDEE] p-0"
            placeholder={t("home.searchPlaceholder")}
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
          <ProductCard product={item} priceLabel={t("home.finalPrice")} />
        )}
        contentContainerStyle={
          filtered.length === 0 ? { flex: 1 } : { paddingVertical: 8 }
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
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
