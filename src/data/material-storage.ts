import AsyncStorage from '@react-native-async-storage/async-storage';

import { Material } from '@/types/material';

const STORAGE_KEY = '@precit/materials';

export async function loadMaterials(): Promise<Material[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Material[];
  } catch {
    return [];
  }
}

export async function storeMaterial(material: Material): Promise<void> {
  const list = await loadMaterials();
  const idx = list.findIndex((m) => m.id === material.id);
  if (idx >= 0) {
    list[idx] = material;
  } else {
    list.push(material);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
