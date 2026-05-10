import { Image } from 'expo-image';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Product } from '@/types/product';

type Props = {
  product: Product;
  priceLabel: string;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function ProductCard({ product, priceLabel }: Props) {
  return (
    <View className="flex-row rounded-xl border border-zinc-200 dark:border-[#2d3133] bg-white dark:bg-[#1e2122] mx-4 my-1.5 overflow-hidden">
      <View className="w-[90px] h-[90px] bg-zinc-200 dark:bg-[#2d3133]">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 opacity-30" />
        )}
      </View>

      <View className="flex-1 p-3 gap-1 justify-center">
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <ThemedText
          className="text-[13px] leading-[18px] text-[#687076] dark:text-[#9ba1a6]"
          numberOfLines={2}
        >
          {product.description}
        </ThemedText>
        <View className="flex-row items-center gap-1.5 mt-1">
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6]">
            {priceLabel}
          </ThemedText>
          <ThemedText type="defaultSemiBold" className="text-primary dark:text-primary">
            {formatPrice(product.finalPrice)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
