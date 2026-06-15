import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
};

export function Card({ children, onPress, style, elevated = false }: CardProps) {
  const bg = useThemeColor({ light: '#EDEDF4', dark: '#1D2024' }, 'background');

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        android_ripple={{ color: 'rgba(0,0,0,0.04)' }}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: bg },
          elevated && styles.elevated,
          style,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, { backgroundColor: bg }, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  elevated: {
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  pressed: {
    opacity: 0.85,
  },
});
