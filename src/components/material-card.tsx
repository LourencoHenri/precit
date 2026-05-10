import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Material } from '@/types/material';

type Props = {
  material: Material;
  unitCostLabel: string;
  stockLabel: string;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function MaterialCard({ material, unitCostLabel, stockLabel }: Props) {
  return (
    <View className="bg-white dark:bg-[#1e2122] border border-zinc-200 dark:border-[#2d3133] rounded-xl mx-4 my-1.5 p-4 gap-2">
      <View className="flex-row items-start justify-between gap-2">
        <ThemedText type="defaultSemiBold" className="flex-1" numberOfLines={1}>
          {material.name}
        </ThemedText>
        {material.category ? (
          <View className="bg-zinc-100 dark:bg-[#2d3133] rounded-full px-2.5 py-0.5">
            <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
              {material.category}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View className="gap-0.5">
        <ThemedText className="text-[13px] text-primary dark:text-primary">
          {`${unitCostLabel}: ${formatPrice(material.unitCost)} / ${material.purchaseUnit}`}
        </ThemedText>
        {material.currentStock !== undefined ? (
          <ThemedText className="text-[13px] text-[#687076] dark:text-[#9ba1a6]">
            {`${stockLabel}: ${material.currentStock} ${material.purchaseUnit}`}
          </ThemedText>
        ) : null}
        {material.supplier ? (
          <ThemedText className="text-[13px] text-[#687076] dark:text-[#9ba1a6]">
            {material.supplier}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}
