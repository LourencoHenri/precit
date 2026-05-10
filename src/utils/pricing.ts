import { ProductMaterial } from '@/types/product';

export function calculateMaterialCost(
  materials: ProductMaterial[],
  manualMaterialCost = 0,
): number {
  const sum = materials.reduce((acc, m) => acc + m.totalCost, 0);
  return sum + Math.max(0, manualMaterialCost);
}

export function calculateLaborCost(
  hours = 0,
  minutes = 0,
  hourlyRate = 0,
): number {
  return (hours + minutes / 60) * hourlyRate;
}

export function calculateTotalCost(
  totalMaterialCost: number,
  laborCost: number,
  packagingCost = 0,
  fixedCost = 0,
  extraCost = 0,
): number {
  return (
    totalMaterialCost +
    laborCost +
    Math.max(0, packagingCost) +
    Math.max(0, fixedCost) +
    Math.max(0, extraCost)
  );
}

export function calculateSuggestedPrice(params: {
  totalCost: number;
  desiredProfitPercent?: number;
  desiredProfitValue?: number;
  totalFeesPercent?: number;
}): number {
  const { totalCost, desiredProfitPercent, desiredProfitValue, totalFeesPercent = 0 } = params;
  const feeFactor = totalFeesPercent / 100;

  if (desiredProfitPercent && desiredProfitPercent > 0) {
    const divisor = 1 - desiredProfitPercent / 100 - feeFactor;
    if (divisor <= 0) return totalCost;
    return totalCost / divisor;
  }

  if (desiredProfitValue && desiredProfitValue > 0) {
    const divisor = 1 - feeFactor;
    if (divisor <= 0) return totalCost + desiredProfitValue;
    return (totalCost + desiredProfitValue) / divisor;
  }

  const divisor = 1 - feeFactor;
  if (divisor <= 0) return totalCost;
  return totalCost / divisor;
}

export function calculateProfitValue(
  finalPrice: number,
  totalCost: number,
  totalFeesPercent = 0,
): number {
  const feeAmount = finalPrice * (totalFeesPercent / 100);
  return finalPrice - feeAmount - totalCost;
}

export function calculateProfitMargin(finalPrice: number, profitValue: number): number {
  if (finalPrice <= 0) return 0;
  return (profitValue / finalPrice) * 100;
}
