export type FormState = {
  name: string;
  description: string;
  category: string;
  notes: string;
  manualMaterialCost: string;
  laborHours: string;
  laborMinutes: string;
  hourlyRate: string;
  packagingCost: string;
  fixedCost: string;
  extraCost: string;
  cardFeePercent: string;
  marketplaceFeePercent: string;
  otherFeePercent: string;
  desiredProfitPercent: string;
  desiredProfitValue: string;
};

export type ErrorField = 'name' | 'margin';
