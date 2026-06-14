import { Pressable, ScrollView, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type FormFieldProps = {
  label: string;
  required?: boolean;
  optional?: string;
  error?: boolean;
  errorText?: string;
  children: React.ReactNode;
};

export function FormField({ label, required, optional, error, errorText, children }: FormFieldProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1.5">
        <ThemedText className="text-sm font-semibold text-[#687076] dark:text-[#9ba1a6]">
          {label}
        </ThemedText>
        {required ? (
          <Text className="text-sm text-red-500">*</Text>
        ) : optional ? (
          <ThemedText className="text-xs text-[#687076] dark:text-[#9ba1a6] opacity-60">
            ({optional})
          </ThemedText>
        ) : null}
      </View>
      {children}
      {error && errorText ? (
        <ThemedText className="text-xs text-red-500">{errorText}</ThemedText>
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
            className={[
              'px-3 py-1.5 rounded-full border',
              isSelected
                ? 'bg-primary border-primary'
                : hasError
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-zinc-300 dark:border-[#2d3133]',
            ].join(' ')}
          >
            <Text
              className={
                isSelected
                  ? 'text-white text-sm font-medium'
                  : 'text-sm text-[#11181C] dark:text-[#ECEDEE]'
              }
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
  return (
    <View className="flex-row items-center gap-3">
      <ThemedText type="defaultSemiBold" className="text-sm">
        {title}
      </ThemedText>
      <View className="flex-1 h-px bg-zinc-200 dark:bg-[#2d3133]" />
    </View>
  );
}
