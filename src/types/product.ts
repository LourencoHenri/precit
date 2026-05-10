export type ProductMaterial = {
  id: string;
  materialId?: string;
  name: string;
  unit: string;
  unitCost: number;
  quantityUsed: number;
  totalCost: number;
  isCustom?: boolean;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  category?: string;

  materials: ProductMaterial[];
  manualMaterialCost?: number;

  laborHours?: number;
  laborMinutes?: number;
  hourlyRate?: number;
  laborCost: number;

  packagingCost?: number;
  fixedCost?: number;
  extraCost?: number;

  cardFeePercent?: number;
  marketplaceFeePercent?: number;
  otherFeePercent?: number;

  desiredProfitPercent?: number;
  desiredProfitValue?: number;

  totalMaterialCost: number;
  totalCost: number;
  suggestedPrice: number;
  finalPrice: number;
  profitValue: number;
  profitMarginPercent: number;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};
