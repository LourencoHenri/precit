import {
  Box,
  ChevronRight,
  Code,
  Home,
  MoreVertical,
  Plus,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Tag,
  User,
} from 'lucide-react-native';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const ICONS = {
  'home': Home,
  'send': Send,
  'code': Code,
  'chevron-right': ChevronRight,
  'shopping-bag': ShoppingBag,
  'tag': Tag,
  'box': Box,
  'settings': Settings,
  'plus': Plus,
  'search': Search,
  'more-vertical': MoreVertical,
  'user': User,
} as const;

export type IconSymbolName = keyof typeof ICONS;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  strokeWidth,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name];
  return <Icon size={size} color={color as string} style={style as any} strokeWidth={strokeWidth} />;
}
