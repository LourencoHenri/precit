import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/design';
import { Product } from '@/types/product';

type Props = {
  product: Product;
  onOptions?: (product: Product) => void;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function ProductCard({ product, onOptions }: Props) {
  return (
    <View
      className="bg-[#FEF7FF] dark:bg-[#1e2122]"
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 72,
        gap: 16,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: '#ECE6F0',
          overflow: 'hidden',
        }}
      >
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
        ) : null}
      </View>

      <View style={{ flex: 1 }}>
        <Text
          className="text-[#1D1B20] dark:text-[#ECEDEE]"
          style={{ fontSize: 16, lineHeight: 24, letterSpacing: 0.5 }}
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <Text
          style={{ fontSize: 14, lineHeight: 20, letterSpacing: 0.25, color: COLORS.primary, fontWeight: '600' }}
        >
          {formatPrice(product.finalPrice)}
        </Text>
      </View>

      <Pressable onPress={() => onOptions?.(product)} hitSlop={8}>
        <IconSymbol name="more-vertical" size={24} color={COLORS.onSurfaceVariant} />
      </Pressable>
    </View>
  );
}
