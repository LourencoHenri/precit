import { useCallback, useState } from 'react';

import { loadProducts } from '@/data/product-storage';
import { Product } from '@/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  return { products, loading, refresh };
}
