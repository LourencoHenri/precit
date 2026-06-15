import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, error, leftIcon, rightIcon, style, wrapperStyle, ...props }: AppInputProps) {
  const hasLeft = !!leftIcon;
  const hasRight = !!rightIcon;
  const isMultiline = !!props.multiline;

  const bg = useThemeColor({ light: '#F3F3FA', dark: '#1D2024' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#C4C6D0', dark: '#44474E' }, 'background');
  const labelColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#74777F', dark: '#8E9099' }, 'icon');

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: labelColor }]}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: bg, borderColor },
          isMultiline && styles.inputWrapperMultiline,
          error ? styles.inputWrapperError : null,
          wrapperStyle,
        ]}
      >
        {hasLeft && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          placeholderTextColor={placeholderColor}
          {...props}
          style={[
            styles.input,
            { color: textColor },
            isMultiline && styles.inputMultiline,
            hasLeft && styles.inputWithLeft,
            hasRight && styles.inputWithRight,
            style,
          ]}
        />

        {hasRight && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
  },
  inputWrapperMultiline: {
    height: undefined,
    minHeight: 80,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputWrapperError: {
    borderColor: '#BA1A1A',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputMultiline: {
    height: undefined,
    textAlignVertical: 'top',
  },
  inputWithLeft: {
    paddingLeft: 4,
  },
  inputWithRight: {
    paddingRight: 4,
  },
  iconLeft: {
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    color: '#BA1A1A',
  },
});
