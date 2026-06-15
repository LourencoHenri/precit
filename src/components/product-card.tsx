import { Image } from 'expo-image';
import { Package } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { COLORS } from '@/constants/design';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Product } from '@/types/product';

type Props = {
  product: Product;
  onOptions?: (product: Product) => void;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// ── List card ────────────────────────────────────────────────────

export function ProductCard({ product, onOptions }: Props) {
  const textColor = useThemeColor({}, 'text');
  return (
    <Card style={styles.listCard}>
      <ProductThumbnail uri={product.imageUrl} variant="list" />

      <View style={{ flex: 1, alignSelf: 'flex-start' }}>
        <Text style={[styles.listName, { color: textColor }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.listPrice}>{formatPrice(product.finalPrice)}</Text>
      </View>

      <Pressable onPress={() => onOptions?.(product)} hitSlop={8}>
        <IconSymbol name="more-vertical" size={24} color={COLORS.onSurfaceVariant} />
      </Pressable>
    </Card>
  );
}

// ── Grid card ────────────────────────────────────────────────────

export function ProductCardGrid({ product, onOptions }: Props) {
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({ light: '#74777F', dark: '#8E9099' }, 'icon');

  const margin = product.profitMarginPercent;
  const marginColor =
    margin > 0 ? '#16A34A' : margin < 0 ? '#DC2626' : COLORS.onSurfaceVariant;
  const marginLabel =
    margin > 0
      ? `↗ ${margin.toFixed(0)}%`
      : margin < 0
        ? `↘ ${Math.abs(margin).toFixed(0)}%`
        : `${margin.toFixed(0)}%`;

  return (
    <Card elevated style={styles.gridCard}>
      <ProductThumbnail uri={product.imageUrl} variant="grid" />

      <View style={styles.gridInfo}>
        <Text style={[styles.gridName, { color: textColor }]} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.gridBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.gridPrice}>{formatPrice(product.finalPrice)}</Text>
            <Text style={[styles.gridMargin, { color: marginColor }]}>{marginLabel}</Text>
          </View>

          <Pressable onPress={() => onOptions?.(product)} hitSlop={8} style={styles.gridMoreBtn}>
            <IconSymbol name="more-vertical" size={20} color={secondaryColor} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

// ── Shared thumbnail ─────────────────────────────────────────────

function ProductThumbnail({ uri, variant }: { uri?: string; variant: 'list' | 'grid' }) {
  const isGrid = variant === 'grid';
  return (
    <View style={isGrid ? styles.gridImageWrap : styles.listImageWrap}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <Package size={isGrid ? 32 : 24} color={COLORS.primary} strokeWidth={1.25} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // List
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 8,
    gap: 12,
  },
  listImageWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listName: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  listPrice: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Grid
  gridCard: {
    flex: 1,
    borderRadius: 14,
  },
  gridImageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridInfo: {
    padding: 10,
    gap: 6,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  gridBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  gridMargin: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  gridMoreBtn: {
    padding: 2,
  },
});
