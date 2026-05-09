import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const tint = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.products'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="bag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: t('nav.pricing'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="tag.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="materials"
        options={{
          title: t('nav.materials'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="cube.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
