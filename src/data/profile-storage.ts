import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@precit/profile';

export type UserProfile = {
  name: string;
  email: string;
};

export async function loadProfile(): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: '', email: '' };
    return JSON.parse(raw) as UserProfile;
  } catch {
    return { name: '', email: '' };
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
