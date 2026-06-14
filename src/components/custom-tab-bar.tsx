import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants/design";
import { IconSymbol } from "./ui/icon-symbol";

type TabConfig = {
  name: string;
  label: string;
  icon: "shopping-bag" | "tag" | "box" | "plus";
  isCenter?: boolean;
};

const TABS: TabConfig[] = [
  { name: "index", label: "Produtos", icon: "shopping-bag" },
  { name: "pricing", label: "Precificar", icon: "plus", isCenter: true },
  { name: "materials", label: "Materiais", icon: "box" },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRouteName = state.routes[state.index].name;

  const handlePress = (routeName: string, routeKey: string) => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const isFocused = focusedRouteName === routeName;
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.surfaceVariant,
        paddingBottom: insets.bottom,
        overflow: "visible",
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
      }}
    >
      <View style={{ height: 61, flexDirection: "row", overflow: "visible" }}>
        {TABS.map((tab) => {
          const route = state.routes.find((r) => r.name === tab.name);
          if (!route) return null;
          const isFocused = focusedRouteName === tab.name;

          if (tab.isCenter) {
            return (
              <View
                key={tab.name}
                style={{
                  width: 80,
                  alignSelf: "stretch",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 6,
                  overflow: "visible",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -23,
                    alignItems: "center",
                    gap: 4,
                    overflow: "visible",
                  }}
                >
                  <Pressable
                    onPress={() => handlePress(tab.name, route.key)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: COLORS.primary,
                      borderWidth: 4,
                      borderColor: COLORS.surfaceVariant,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconSymbol name="plus" size={28} color="white" />
                  </Pressable>
                  <Text
                    style={{
                      color: isFocused ? COLORS.primary : COLORS.textSecondary,
                      fontSize: 12,
                      fontWeight: "500",
                      letterSpacing: 0.5,
                      textAlign: "center",
                    }}
                  >
                    {tab.label}
                  </Text>
                </View>
              </View>
            );
          }

          return (
            <Pressable
              key={tab.name}
              onPress={() => handlePress(tab.name, route.key)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 6,
                paddingBottom: 6,
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isFocused ? COLORS.pillActive : "transparent",
                  borderRadius: 16,
                }}
              >
                <IconSymbol
                  name={tab.icon}
                  size={24}
                  color={isFocused ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <Text
                style={{
                  color: isFocused ? COLORS.primary : COLORS.textSecondary,
                  fontSize: 12,
                  fontWeight: isFocused ? "600" : "500",
                  textAlign: "center",
                  letterSpacing: 0.5,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
