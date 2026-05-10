import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MOCK_MATERIALS } from '@/data/mock-materials';
import { Material } from '@/types/material';

function MaterialRow({ material }: { material: Material }) {
  return (
    <View className="flex-row items-center justify-between py-3.5 border-b border-zinc-200 dark:border-[#2d3133]">
      <View className="gap-0.5">
        <ThemedText type="defaultSemiBold">{material.name}</ThemedText>
        <ThemedText className="text-[13px] text-[#687076] dark:text-[#9ba1a6]">
          {material.unit}
        </ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" className="text-primary dark:text-primary">
        {`R$ ${material.cost.toFixed(2).replace('.', ',')}`}
      </ThemedText>
    </View>
  );
}

export default function MaterialsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3">
        <ThemedText type="title" className="text-2xl leading-[30px]">
          {t('materials.title')}
        </ThemedText>
      </View>

      <FlatList
        data={MOCK_MATERIALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MaterialRow material={item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}
