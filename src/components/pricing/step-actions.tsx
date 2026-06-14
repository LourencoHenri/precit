import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS } from "@/constants/design";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  canAdvance?: boolean;
  saving?: boolean;
  saved?: boolean;
};

export function StepActions({
  isFirst,
  isLast,
  onPrev,
  onNext,
  onSave,
  canAdvance = true,
  saving,
  saved,
}: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bg = useThemeColor({}, "background");

  const handleMain = isLast ? onSave : onNext;
  const disabled = !canAdvance || !!saving || !!saved;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: Math.max(insets.bottom + 8, 16),
        borderTopWidth: 1,
        borderTopColor: COLORS.outlineVariant,
        backgroundColor: bg,
      }}
    >
      {!isFirst && (
        <Pressable
          onPress={onPrev}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: COLORS.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ color: COLORS.primary, fontWeight: "600", fontSize: 15 }}
          >
            {t("pricing.back")}
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={handleMain}
        disabled={disabled}
        style={{
          flex: 1,
          height: 52,
          borderRadius: 12,
          backgroundColor: saved ? "#16a34a" : COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled && !saved ? 0.45 : 1,
        }}
      >
        {saving ? (
          <ActivityIndicator color="white" size="small" />
        ) : saved ? (
          <Check size={20} color="white" strokeWidth={2.5} />
        ) : (
          <Text style={{ color: "white", fontWeight: "600", fontSize: 15 }}>
            {isLast ? t("pricing.save") : t("pricing.next")}
          </Text>
        )}
      </Pressable>
    </View>
  );
}
