import { StyleSheet, Text, type TextProps } from 'react-native';

import { useColors } from '@/hooks/use-colors';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ type = 'default', style, ...rest }: ThemedTextProps) {
  const colors = useColors();
  return (
    <Text
      style={[
        { color: colors.onSurface },
        typeStyles[type],
        type === 'link' && { color: colors.primary },
        style,
      ]}
      {...rest}
    />
  );
}

const typeStyles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 24 },
  defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
  title: { fontSize: 32, fontWeight: '700', lineHeight: 32 },
  subtitle: { fontSize: 20, fontWeight: '700' },
  link: { fontSize: 16, lineHeight: 30 },
});
