import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { Material } from '@/types/material';

type Props = {
  material: Material;
  unitCostLabel: string;
  stockLabel: string;
  onOptions?: (material: Material) => void;
};

function formatPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function MaterialCard({ material, unitCostLabel, stockLabel, onOptions }: Props) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={{ flex: 1 }} numberOfLines={1}>
          {material.name}
        </ThemedText>
        {material.category ? (
          <View style={[styles.badge, { backgroundColor: colors.surfaceContainerHigh }]}>
            <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant }}>
              {material.category}
            </ThemedText>
          </View>
        ) : null}
        {onOptions ? (
          <Pressable onPress={() => onOptions(material)} hitSlop={8}>
            <IconSymbol name="more-vertical" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
        ) : null}
      </View>

      <View style={{ gap: 2 }}>
        <ThemedText style={{ fontSize: 13, color: colors.primary }}>
          {`${unitCostLabel}: ${formatPrice(material.unitCost)} / ${material.purchaseUnit}`}
        </ThemedText>
        {material.currentStock !== undefined ? (
          <ThemedText style={{ fontSize: 13, color: colors.onSurfaceVariant }}>
            {`${stockLabel}: ${material.currentStock} ${material.purchaseUnit}`}
          </ThemedText>
        ) : null}
        {material.supplier ? (
          <ThemedText style={{ fontSize: 13, color: colors.onSurfaceVariant }}>
            {material.supplier}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});
