import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MOCK_MATERIALS } from '@/data/mock-materials';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Material } from '@/types/material';

function MaterialRow({ material }: { material: Material }) {
  const borderColor = useThemeColor({ light: '#e5e7eb', dark: '#2d3133' }, 'icon');
  const subtitleColor = useThemeColor({ light: '#687076', dark: '#9ba1a6' }, 'icon');

  return (
    <View style={[styles.row, { borderBottomColor: borderColor }]}>
      <View style={styles.rowInfo}>
        <ThemedText type="defaultSemiBold">{material.name}</ThemedText>
        <ThemedText style={[styles.unit, { color: subtitleColor }]}>{material.unit}</ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" style={styles.cost}>
        {`R$ ${material.cost.toFixed(2).replace('.', ',')}`}
      </ThemedText>
    </View>
  );
}

export default function MaterialsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {t('materials.title')}
        </ThemedText>
      </View>

      <FlatList
        data={MOCK_MATERIALS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MaterialRow material={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowInfo: {
    gap: 2,
  },
  unit: {
    fontSize: 13,
  },
  cost: {
    color: '#0a7ea4',
  },
});
