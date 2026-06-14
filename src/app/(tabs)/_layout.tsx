import { Tabs } from "expo-router";

import { CustomTabBar } from "@/components/custom-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Produtos" }} />
      <Tabs.Screen name="pricing" options={{ title: "Precificar" }} />
      <Tabs.Screen name="materials" options={{ title: "Materiais" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
