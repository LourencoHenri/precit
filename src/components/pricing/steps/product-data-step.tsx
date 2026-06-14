import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/Input";
import { ErrorField, FormState } from "@/types/pricing-form";
import { ChipSelector, FormField } from "../form-helpers";

const PRODUCT_CATEGORIES = [
  "Moda",
  "Decoração",
  "Acessórios",
  "Cosméticos",
  "Brinquedos",
  "Papelaria",
  "Outro",
];

type Props = {
  form: FormState;
  set: (field: keyof FormState, value: string) => void;
  errors: Set<ErrorField>;
};

export function ProductDataStep({ form, set, errors }: Props) {
  const { t } = useTranslation();

  return (
    <View style={{ gap: 24 }}>
      {/* Step title */}
      <View style={{ gap: 4 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {t("pricing.sectionBasics")}
        </ThemedText>
        <ThemedText className="text-sm text-[#687076] dark:text-[#9ba1a6]">
          {t("pricing.stepProductDesc")}
        </ThemedText>
      </View>

      {/* Name */}
      <FormField
        label={t("pricing.productName")}
        required
        error={errors.has("name")}
        errorText={t("pricing.requiredFields")}
      >
        <Input
          placeholder={t("pricing.productName")}
          value={form.name}
          onChangeText={(v) => set("name", v)}
          returnKeyType="next"
          autoCapitalize="words"
          autoFocus
          wrapperStyle={
            errors.has("name")
              ? { borderColor: "#E5484D", borderWidth: 1.5 }
              : undefined
          }
        />
      </FormField>

      {/* Description */}
      <FormField
        label={t("pricing.description")}
        optional={t("pricing.optional")}
      >
        <Input
          placeholder={t("pricing.description")}
          value={form.description}
          onChangeText={(v) => set("description", v)}
          multiline
        />
      </FormField>

      {/* Category */}
      <FormField label={t("pricing.category")} optional={t("pricing.optional")}>
        <ChipSelector
          options={PRODUCT_CATEGORIES}
          selected={form.category}
          onSelect={(v) => set("category", v)}
        />
      </FormField>

      {/* Notes */}
      <FormField label={t("pricing.notes")} optional={t("pricing.optional")}>
        <Input
          placeholder={t("pricing.notes")}
          value={form.notes}
          onChangeText={(v) => set("notes", v)}
        />
      </FormField>

      {/* Required field hint */}
      <Text className="text-xs text-[#687076] dark:text-[#9ba1a6]">
        <Text className="text-red-500">* </Text>
        {t("pricing.requiredFields")}
      </Text>
    </View>
  );
}
