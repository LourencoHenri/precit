import { useCallback, useState } from 'react';

import { loadMaterials } from '@/data/material-storage';
import { Material } from '@/types/material';

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadMaterials();
    setMaterials(data);
    setLoading(false);
  }, []);

  return { materials, loading, refresh };
}
