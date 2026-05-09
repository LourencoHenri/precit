import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Product } from '@/types/product';

type Props = {
  product: Product;
  priceLabel: string;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function ProductCard({ product, priceLabel }: Props) {
  const cardBg = useThemeColor({ light: '#ffffff', dark: '#1e2122' }, 'background');
  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2d3133' }, 'icon');
  const subtitleColor = useThemeColor({ light: '#687076', dark: '#9ba1a6' }, 'icon');

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: borderColor }]}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imageFallback} />
        )}
      </View>

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {product.name}
        </ThemedText>
        <ThemedText style={[styles.description, { color: subtitleColor }]} numberOfLines={2}>
          {product.description}
        </ThemedText>
        <View style={styles.priceRow}>
          <ThemedText style={[styles.priceLabel, { color: subtitleColor }]}>
            {priceLabel}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.price}>
            {formatPrice(product.finalPrice)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    opacity: 0.3,
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 4,
    justifyContent: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 12,
  },
  price: {
    color: '#0a7ea4',
  },
});
