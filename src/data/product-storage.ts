import AsyncStorage from '@react-native-async-storage/async-storage';

import { Product } from '@/types/product';

const STORAGE_KEY = '@precit/products';

export async function loadProducts(): Promise<Product[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export async function storeProduct(product: Product): Promise<void> {
  const list = await loadProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    list[idx] = product;
  } else {
    list.push(product);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
