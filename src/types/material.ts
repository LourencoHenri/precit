export type Material = {
  id: string;
  name: string;
  category?: string;
  purchaseUnit: string;
  purchaseQuantity: number;
  purchasePrice: number;
  unitCost: number;
  currentStock?: number;
  minimumStock?: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
