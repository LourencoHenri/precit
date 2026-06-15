import { View, type ViewProps } from 'react-native';

import { useColors } from '@/hooks/use-colors';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const colors = useColors();
  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
