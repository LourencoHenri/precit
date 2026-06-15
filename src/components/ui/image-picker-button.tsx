import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { ImageIcon, Pencil } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/design';

type Props = {
  value?: string;
  onChange: (uri: string | undefined) => void;
};

async function requestAndPick(
  requestFn: () => Promise<ImagePicker.PermissionResponse>,
  launchFn: () => Promise<ImagePicker.ImagePickerResult>,
  permissionMessage: string,
): Promise<string | undefined> {
  const { status } = await requestFn();
  if (status !== 'granted') {
    Alert.alert(
      'Permissão necessária',
      permissionMessage,
      [{ text: 'OK' }],
    );
    return undefined;
  }
  const result = await launchFn();
  if (!result.canceled) {
    return result.assets[0].uri;
  }
  return undefined;
}

export function ImagePickerButton({ value, onChange }: Props) {
  function handlePress() {
    const actions: Parameters<typeof Alert.alert>[2] = [
      {
        text: 'Câmera',
        onPress: async () => {
          const uri = await requestAndPick(
            ImagePicker.requestCameraPermissionsAsync,
            () =>
              ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              }),
            'Precisamos de acesso à câmera para tirar fotos dos produtos.',
          );
          if (uri) onChange(uri);
        },
      },
      {
        text: 'Galeria',
        onPress: async () => {
          const uri = await requestAndPick(
            ImagePicker.requestMediaLibraryPermissionsAsync,
            () =>
              ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              }),
            'Precisamos de acesso às fotos para selecionar imagens dos produtos.',
          );
          if (uri) onChange(uri);
        },
      },
    ];

    if (value) {
      actions.push({
        text: 'Remover imagem',
        style: 'destructive',
        onPress: () => onChange(undefined),
      });
    }

    actions.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert('Imagem do produto', undefined, actions);
  }

  if (value) {
    return (
      <Pressable onPress={handlePress} style={styles.imageWrap}>
        <Image
          source={{ uri: value }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.editBadge}>
          <Pencil size={14} color="white" strokeWidth={2} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.placeholder, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.placeholderIcon}>
        <ImageIcon size={24} color={COLORS.primary} strokeWidth={1.5} />
      </View>
      <Text style={styles.placeholderLabel}>Adicionar imagem</Text>
      <Text style={styles.placeholderSub}>Câmera ou galeria</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceVariant,
  },
  editBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.48)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: '100%',
    height: 130,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.outline,
    backgroundColor: COLORS.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  placeholderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  placeholderSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
