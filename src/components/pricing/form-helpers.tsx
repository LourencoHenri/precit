import { Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';

type FormFieldProps = {
  label: string;
  required?: boolean;
  optional?: string;
  error?: boolean;
  errorText?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, optional, error, errorText, children }: FormFieldProps) {
  const colors = useColors();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.onSurfaceVariant }}>
          {label}
        </ThemedText>
        {required ? (
          <Text style={{ fontSize: 14, color: colors.error }}>*</Text>
        ) : optional ? (
          <ThemedText style={{ fontSize: 12, color: colors.onSurfaceVariant, opacity: 0.6 }}>
            ({optional})
          </ThemedText>
        ) : null}
      </View>
      {children}
      {error && errorText ? (
        <ThemedText style={{ fontSize: 12, color: colors.error }}>{errorText}</ThemedText>
      ) : null}
    </View>
  );
}

type ChipSelectorProps = {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  hasError?: boolean;
};

export function ChipSelector({ options, selected, onSelect, hasError }: ChipSelectorProps) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
    >
      {options.map((opt) => {
        const isSelected = selected === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onSelect(isSelected ? '' : opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 9999,
              borderWidth: 1,
              backgroundColor: isSelected ? colors.primary : 'transparent',
              borderColor: isSelected ? colors.primary : hasError ? colors.error : colors.outline,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: isSelected ? colors.onPrimary : colors.onSurface,
              }}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
        {title}
      </ThemedText>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.outlineVariant }} />
    </View>
  );
}
