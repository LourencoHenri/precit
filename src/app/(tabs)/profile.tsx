import { useFocusEffect, useRouter } from 'expo-router';
import {
  Camera,
  ChevronRight,
  CreditCard,
  Lock,
  LogOut,
  Pencil,
  Settings,
  Trash2,
  User,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedView } from '@/components/themed-view';
import { COLORS } from '@/constants/design';
import { useProfile } from '@/hooks/use-profile';
import { useThemeColor } from '@/hooks/use-theme-color';

function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SectionHeader({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.8,
        color: COLORS.textSecondary,
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 6,
      }}
    >
      {label.toUpperCase()}
    </Text>
  );
}

type RowProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  badge?: string;
  destructive?: boolean;
  last?: boolean;
  cardBg: string;
  dividerColor: string;
  textColor: string;
};

function ActionRow({
  icon,
  label,
  onPress,
  badge,
  destructive,
  last,
  cardBg,
  dividerColor,
  textColor,
}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        backgroundColor: cardBg,
        opacity: pressed ? 0.7 : 1,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: dividerColor,
      })}
    >
      <View style={{ width: 24, alignItems: 'center' }}>{icon}</View>
      <Text
        style={{
          flex: 1,
          fontSize: 15,
          color: destructive ? '#ef4444' : textColor,
        }}
      >
        {label}
      </Text>
      {badge ? (
        <View
          style={{
            backgroundColor: COLORS.outlineVariant,
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' }}>
            {badge}
          </Text>
        </View>
      ) : onPress ? (
        <ChevronRight size={16} color={COLORS.textSecondary} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, refresh, update } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const cardBg = useThemeColor({ light: COLORS.surface, dark: '#1e2122' }, 'text');
  const inputBg = useThemeColor({ light: COLORS.surfaceVariant, dark: '#2a2a2e' }, 'text');
  const textColor = useThemeColor({}, 'text');
  const dividerColor = useThemeColor({ light: COLORS.outlineVariant, dark: '#2d3133' }, 'text');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const startEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = async () => {
    await update({ name: editName.trim(), email: editEmail.trim() });
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(t('profile.confirmLogout'), t('profile.confirmLogoutMessage'), [
      { text: t('profile.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: () => {
          // TODO: clear auth session when auth is implemented
        },
      },
    ]);
  };

  const comingSoon = () =>
    Alert.alert(t('profile.comingSoon'), '', [{ text: 'OK', style: 'cancel' }]);

  const rowProps = { cardBg, dividerColor, textColor };

  return (
    <ThemedView style={{ flex: 1 }}>
      <AppHeader title={t('nav.profile')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Avatar + user info */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: 32,
            paddingBottom: 8,
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: COLORS.primaryContainer,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            {profile.name ? (
              <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.primary }}>
                {getInitials(profile.name)}
              </Text>
            ) : (
              <User size={40} color={COLORS.primary} strokeWidth={1.5} />
            )}
          </View>

          {isEditing ? (
            <View style={{ width: '100%', gap: 10 }}>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder={t('profile.namePlaceholder')}
                placeholderTextColor={COLORS.textSecondary}
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: textColor,
                  textAlign: 'center',
                }}
              />
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder={t('profile.emailPlaceholder')}
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: inputBg,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: textColor,
                  textAlign: 'center',
                }}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                <Pressable
                  onPress={cancelEdit}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: COLORS.outline,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{ fontSize: 14, fontWeight: '600', color: COLORS.onSurfaceVariant }}
                  >
                    {t('profile.cancel')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={saveEdit}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: COLORS.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                    {t('profile.save')}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <Text
                style={{ fontSize: 22, fontWeight: '700', color: textColor, marginBottom: 4 }}
              >
                {profile.name || t('profile.guestName')}
              </Text>
              {profile.email ? (
                <Text
                  style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 14 }}
                >
                  {profile.email}
                </Text>
              ) : (
                <View style={{ height: 14, marginBottom: 14 }} />
              )}
              <Pressable
                onPress={startEdit}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: COLORS.primaryContainer,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                <Pencil size={14} color={COLORS.primary} strokeWidth={2} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>
                  {t('profile.editProfile')}
                </Text>
              </Pressable>
            </>
          )}
        </View>

        {/* Conta */}
        <SectionHeader label={t('profile.account')} />
        <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <ActionRow
            {...rowProps}
            icon={<Camera size={20} color={COLORS.onSurfaceVariant} strokeWidth={1.75} />}
            label={t('profile.changePhoto')}
            onPress={comingSoon}
            badge={t('profile.comingSoon')}
          />
          <ActionRow
            {...rowProps}
            icon={<Lock size={20} color={COLORS.onSurfaceVariant} strokeWidth={1.75} />}
            label={t('profile.changePassword')}
            onPress={comingSoon}
            badge={t('profile.comingSoon')}
          />
          <ActionRow
            {...rowProps}
            icon={<CreditCard size={20} color={COLORS.onSurfaceVariant} strokeWidth={1.75} />}
            label={t('profile.subscription')}
            onPress={comingSoon}
            badge={t('profile.comingSoon')}
            last
          />
        </View>

        {/* Preferências */}
        <SectionHeader label={t('profile.preferences')} />
        <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <ActionRow
            {...rowProps}
            icon={<Settings size={20} color={COLORS.onSurfaceVariant} strokeWidth={1.75} />}
            label={t('profile.openSettings')}
            onPress={() => router.push('/settings')}
            last
          />
        </View>

        {/* Zona de perigo */}
        <SectionHeader label={t('profile.dangerZone')} />
        <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <ActionRow
            {...rowProps}
            icon={<LogOut size={20} color="#ef4444" strokeWidth={1.75} />}
            label={t('profile.logout')}
            onPress={handleLogout}
            destructive
          />
          <ActionRow
            {...rowProps}
            icon={<Trash2 size={20} color="#ef4444" strokeWidth={1.75} />}
            label={t('profile.deleteAccount')}
            onPress={comingSoon}
            badge={t('profile.comingSoon')}
            destructive
            last
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
