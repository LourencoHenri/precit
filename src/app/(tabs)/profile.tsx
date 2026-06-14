import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { AppHeader } from "@/components/app-header";
import { MaterialCard } from "@/components/material-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMaterials } from "@/hooks/use-materials";
import { Material } from "@/types/material";

const PRIMARY = "#6750A4";
const SURFACE = "#FEF7FF";
const INACTIVE = "#49454F";

export default function MaterialsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { materials, loading, refresh } = useMaterials();

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
    <ThemedView className="flex-1">
      <AppHeader title={t("nav.materials")} />

      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 16,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            flex: 1,
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
            placeholder={t("materials.searchPlaceholder")}
            placeholderTextColor={INACTIVE}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable
          onPress={() => router.push("/new-material")}
          hitSlop={12}
          accessibilityLabel={t("materials.newMaterial")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: PRIMARY,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconSymbol name="plus" size={22} color="white" />
        </Pressable>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MaterialCard
              material={item}
              unitCostLabel={t("materials.unitCost")}
              stockLabel={t("materials.currentStock")}
            />
          )}
          contentContainerStyle={
            filtered.length === 0 ? { flex: 1 } : { paddingVertical: 8 }
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
                {t("materials.empty")}
              </ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}
