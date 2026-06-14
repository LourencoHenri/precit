import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/design';

type Props = {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
};

export function AppHeader({ title, onBack, rightAction }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        paddingTop: insets.top + 10,
        paddingBottom: 14,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 36 }}>
          {onBack && (
            <Pressable onPress={onBack} hitSlop={12}>
              <ChevronLeft size={26} color="white" />
            </Pressable>
          )}
        </View>
        <Text
          style={{
            flex: 1,
            color: 'white',
            fontSize: 26,
            fontWeight: '600',
            textAlign: 'center',
            lineHeight: 34,
          }}
        >
          {title}
        </Text>
        <View style={{ width: 36 }}>{rightAction ?? null}</View>
      </View>
    </View>
  );
}
