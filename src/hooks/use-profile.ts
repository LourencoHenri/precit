import { useCallback, useState } from 'react';

import { loadProfile, saveProfile, type UserProfile } from '@/data/profile-storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  const update = useCallback(
    async (updates: Partial<UserProfile>) => {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      await saveProfile(updated);
    },
    [profile],
  );

  return { profile, loading, refresh, update };
}
