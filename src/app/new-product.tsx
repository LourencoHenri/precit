import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  UIManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PricingStepper } from "@/components/pricing/pricing-stepper";
import { StepActions } from "@/components/pricing/step-actions";
import { AdditionalCostsStep } from "@/components/pricing/steps/additional-costs-step";
import { MarginStep } from "@/components/pricing/steps/margin-step";
import { MaterialsStep } from "@/components/pricing/steps/materials-step";
import { ProductDataStep } from "@/components/pricing/steps/product-data-step";
import { ReviewStep } from "@/components/pricing/steps/review-step";
import { ThemedView } from "@/components/themed-view";
import { COLORS } from "@/constants/design";
import { loadProducts, storeProduct } from "@/data/product-storage";
import { useMaterials } from "@/hooks/use-materials";
import { ErrorField, FormState } from "@/types/pricing-form";
import { Product, ProductMaterial } from "@/types/product";
import { parseDecimal } from "@/utils/format";
import {
  calculateLaborCost,
  calculateMaterialCost,
  calculateProfitMargin,
  calculateProfitValue,
  calculateSuggestedPrice,
  calculateTotalCost,
} from "@/utils/pricing";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TOTAL_STEPS = 5;

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  category: "",
  notes: "",
  manualMaterialCost: "",
  laborHours: "",
  laborMinutes: "",
  hourlyRate: "",
  packagingCost: "",
  fixedCost: "",
  extraCost: "",
  cardFeePercent: "",
  marketplaceFeePercent: "",
  otherFeePercent: "",
  desiredProfitPercent: "",
  desiredProfitValue: "",
};

function productToFormState(product: Product): FormState {
  const fmt = (n: number | undefined) =>
    n ? n.toFixed(2).replace(".", ",") : "";
  const str = (n: number | undefined) => (n ? String(n) : "");
  return {
    name: product.name,
    description: product.description ?? "",
    category: product.category ?? "",
    notes: product.notes ?? "",
    manualMaterialCost: fmt(product.manualMaterialCost),
    laborHours: str(product.laborHours),
    laborMinutes: str(product.laborMinutes),
    hourlyRate: fmt(product.hourlyRate),
    packagingCost: fmt(product.packagingCost),
    fixedCost: fmt(product.fixedCost),
    extraCost: fmt(product.extraCost),
    cardFeePercent: str(product.cardFeePercent),
    marketplaceFeePercent: str(product.marketplaceFeePercent),
    otherFeePercent: str(product.otherFeePercent),
    desiredProfitPercent: str(product.desiredProfitPercent),
    desiredProfitValue: fmt(product.desiredProfitValue),
  };
}

export default function NewProductScreen() {
  const { t } = useTranslation();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!editId;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { materials: catalog, refresh: refreshCatalog } = useMaterials();
  const scrollRef = useRef<ScrollView>(null);

  const [initialized, setInitialized] = useState(!isEditing);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [productMaterials, setProductMaterials] = useState<ProductMaterial[]>(
    [],
  );
  const [finalPriceInput, setFinalPriceInput] = useState("");
  const [finalPriceManual, setFinalPriceManual] = useState(false);
  const [errors, setErrors] = useState<Set<ErrorField>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load product data when editing
  useEffect(() => {
    if (!editId) return;
    loadProducts().then((products) => {
      const product = products.find((p) => p.id === editId);
      if (!product) {
        router.back();
        return;
      }
      setForm(productToFormState(product));
      setProductMaterials(product.materials);
      setFinalPriceInput(product.finalPrice.toFixed(2).replace(".", ","));
      setFinalPriceManual(true);
      setEditingId(product.id);
      setEditingCreatedAt(product.createdAt);
      setImageUrl(product.imageUrl);
      setInitialized(true);
    });
  }, [editId]);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Scroll to top on every step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete("name");
      next.delete("margin");
      return next;
    });
  }

  // ─── Derived calculations ────────────────────────────────────────
  const totalMaterialCost = useMemo(
    () =>
      calculateMaterialCost(
        productMaterials,
        parseDecimal(form.manualMaterialCost),
      ),
    [productMaterials, form.manualMaterialCost],
  );

  const laborCost = useMemo(
    () =>
      calculateLaborCost(
        parseDecimal(form.laborHours),
        parseDecimal(form.laborMinutes),
        parseDecimal(form.hourlyRate),
      ),
    [form.laborHours, form.laborMinutes, form.hourlyRate],
  );

  const otherCosts = useMemo(
    () =>
      Math.max(0, parseDecimal(form.packagingCost)) +
      Math.max(0, parseDecimal(form.fixedCost)) +
      Math.max(0, parseDecimal(form.extraCost)),
    [form.packagingCost, form.fixedCost, form.extraCost],
  );

  const totalCost = useMemo(
    () =>
      calculateTotalCost(
        totalMaterialCost,
        laborCost,
        parseDecimal(form.packagingCost),
        parseDecimal(form.fixedCost),
        parseDecimal(form.extraCost),
      ),
    [
      totalMaterialCost,
      laborCost,
      form.packagingCost,
      form.fixedCost,
      form.extraCost,
    ],
  );

  const totalFeesPercent = useMemo(
    () =>
      parseDecimal(form.cardFeePercent) +
      parseDecimal(form.marketplaceFeePercent) +
      parseDecimal(form.otherFeePercent),
    [form.cardFeePercent, form.marketplaceFeePercent, form.otherFeePercent],
  );

  const profitPct = parseDecimal(form.desiredProfitPercent);
  const profitVal = parseDecimal(form.desiredProfitValue);

  const suggestedPrice = useMemo(
    () =>
      calculateSuggestedPrice({
        totalCost,
        desiredProfitPercent: profitPct > 0 ? profitPct : undefined,
        desiredProfitValue:
          profitPct === 0 && profitVal > 0 ? profitVal : undefined,
        totalFeesPercent,
      }),
    [totalCost, profitPct, profitVal, totalFeesPercent],
  );

  useEffect(() => {
    if (!finalPriceManual) {
      setFinalPriceInput(
        suggestedPrice > 0 ? suggestedPrice.toFixed(2).replace(".", ",") : "",
      );
    }
  }, [suggestedPrice, finalPriceManual]);

  const finalPrice = parseDecimal(finalPriceInput);

  const profitValue = useMemo(
    () => calculateProfitValue(finalPrice, totalCost, totalFeesPercent),
    [finalPrice, totalCost, totalFeesPercent],
  );

  const profitMarginPercent = useMemo(
    () => calculateProfitMargin(finalPrice, profitValue),
    [finalPrice, profitValue],
  );

  // ─── Navigation ──────────────────────────────────────────────────
  function validateStep(s: number): boolean {
    if (s === 0 && !form.name.trim()) {
      setErrors(new Set(["name"]));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return false;
    }
    if (s === 3 && profitPct + totalFeesPercent >= 100 && profitPct > 0) {
      setErrors(new Set(["margin"]));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateStep(step)) return;
    setErrors(new Set());
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function handlePrev() {
    setErrors(new Set());
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep((s) => Math.max(s - 1, 0));
  }

  // ─── Save ────────────────────────────────────────────────────────
  async function handleSave() {
    if (!form.name.trim()) {
      setStep(0);
      setErrors(new Set(["name"]));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    if (profitPct + totalFeesPercent >= 100 && profitPct > 0) {
      setStep(3);
      setErrors(new Set(["margin"]));
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const product: Product = {
      id: editingId ?? Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category || undefined,
      notes: form.notes.trim() || undefined,
      imageUrl: imageUrl || undefined,
      materials: productMaterials,
      manualMaterialCost:
        parseDecimal(form.manualMaterialCost) > 0
          ? parseDecimal(form.manualMaterialCost)
          : undefined,
      laborHours:
        parseDecimal(form.laborHours) > 0
          ? parseDecimal(form.laborHours)
          : undefined,
      laborMinutes:
        parseDecimal(form.laborMinutes) > 0
          ? parseDecimal(form.laborMinutes)
          : undefined,
      hourlyRate:
        parseDecimal(form.hourlyRate) > 0
          ? parseDecimal(form.hourlyRate)
          : undefined,
      laborCost,
      packagingCost:
        parseDecimal(form.packagingCost) > 0
          ? parseDecimal(form.packagingCost)
          : undefined,
      fixedCost:
        parseDecimal(form.fixedCost) > 0
          ? parseDecimal(form.fixedCost)
          : undefined,
      extraCost:
        parseDecimal(form.extraCost) > 0
          ? parseDecimal(form.extraCost)
          : undefined,
      cardFeePercent:
        parseDecimal(form.cardFeePercent) > 0
          ? parseDecimal(form.cardFeePercent)
          : undefined,
      marketplaceFeePercent:
        parseDecimal(form.marketplaceFeePercent) > 0
          ? parseDecimal(form.marketplaceFeePercent)
          : undefined,
      otherFeePercent:
        parseDecimal(form.otherFeePercent) > 0
          ? parseDecimal(form.otherFeePercent)
          : undefined,
      desiredProfitPercent: profitPct > 0 ? profitPct : undefined,
      desiredProfitValue:
        profitPct === 0 && profitVal > 0 ? profitVal : undefined,
      totalMaterialCost,
      totalCost,
      suggestedPrice,
      finalPrice,
      profitValue,
      profitMarginPercent,
      createdAt: editingCreatedAt ?? now,
      updatedAt: now,
    };

    await storeProduct(product);
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.back(), 700);
  }

  // ─── Step can-advance logic ──────────────────────────────────────
  const canAdvance = useMemo(() => {
    if (step === 0) return form.name.trim().length > 0;
    if (step === 3)
      return !(profitPct > 0 && profitPct + totalFeesPercent >= 100);
    return true;
  }, [step, form.name, profitPct, totalFeesPercent]);

  // ─── Loading state while fetching product to edit ─────────────────
  if (!initialized) {
    return (
      <ThemedView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </ThemedView>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: isEditing ? t("pricing.editProduct") : t("pricing.newProduct"),
        }}
      />

      <PricingStepper current={step} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: Math.max(insets.bottom + 20, 32),
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <ProductDataStep
              form={form}
              set={set}
              errors={errors}
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
            />
          )}
          {step === 1 && (
            <MaterialsStep
              productMaterials={productMaterials}
              onMaterialsChange={setProductMaterials}
              catalog={catalog}
              onCatalogRefresh={refreshCatalog}
              form={form}
              set={set}
            />
          )}
          {step === 2 && (
            <AdditionalCostsStep form={form} set={set} laborCost={laborCost} />
          )}
          {step === 3 && (
            <MarginStep
              form={form}
              set={set}
              errors={errors}
              profitPct={profitPct}
              totalFeesPercent={totalFeesPercent}
            />
          )}
          {step === 4 && (
            <ReviewStep
              form={form}
              productMaterials={productMaterials}
              totalMaterialCost={totalMaterialCost}
              laborCost={laborCost}
              otherCosts={otherCosts}
              totalCost={totalCost}
              totalFeesPercent={totalFeesPercent}
              suggestedPrice={suggestedPrice}
              profitValue={profitValue}
              profitMarginPercent={profitMarginPercent}
              finalPriceInput={finalPriceInput}
              setFinalPriceInput={setFinalPriceInput}
              setFinalPriceManual={setFinalPriceManual}
            />
          )}
        </ScrollView>

        <StepActions
          isFirst={step === 0}
          isLast={step === TOTAL_STEPS - 1}
          onPrev={handlePrev}
          onNext={handleNext}
          onSave={handleSave}
          canAdvance={canAdvance}
          saving={saving}
          saved={saved}
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
