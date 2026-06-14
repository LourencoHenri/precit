import { Fragment } from 'react';
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { COLORS } from '@/constants/design';

export function PricingStepper({ current }: { current: number }) {
  const { t } = useTranslation();

  const STEPS: string[] = [
    t('pricing.stepProduct'),
    t('pricing.stepMaterials'),
    t('pricing.stepCosts'),
    t('pricing.stepMargin'),
    t('pricing.stepReview'),
  ];

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.outlineVariant,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    marginTop: 13,
                    borderRadius: 1,
                    backgroundColor: i <= current ? COLORS.doneLine : COLORS.outline,
                  }}
                />
              )}
              <View style={{ alignItems: 'center', gap: 5, width: 52 }}>
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: done || active ? COLORS.primary : 'transparent',
                    borderWidth: done || active ? 0 : 1.5,
                    borderColor: active ? COLORS.primary : COLORS.outline,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done ? (
                    <Check size={13} color="white" strokeWidth={2.5} />
                  ) : (
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: active ? 'white' : COLORS.textSecondary,
                      }}
                    >
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 10,
                    textAlign: 'center',
                    color: active ? COLORS.primary : done ? COLORS.doneLine : COLORS.textSecondary,
                    fontWeight: active ? '700' : '400',
                  }}
                >
                  {label}
                </Text>
              </View>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}
