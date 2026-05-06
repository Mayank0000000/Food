import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createCouponCardStyles } from '@/styles/components/coupon-card.styles';
import { CouponCardProps } from '@/types/coupon.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable } from 'react-native';

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onApply,
  isApplied = false,
  showApplyButton = true,
}) => {
  const { theme, colors } = useTheme();
  const couponCardStyles = useMemo(() => createCouponCardStyles(theme), [theme]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDiscountText = () => {
    if (coupon.discountType === 'flat') {
      return `₹${coupon.discount} OFF`;
    }
    return `${coupon.discount}% OFF`;
  };

  return (
    <RView style={[
      couponCardStyles.container,
      isApplied && couponCardStyles.appliedContainer,
    ]}>
      <RView style={couponCardStyles.header}>
        <RView style={couponCardStyles.leftSection}>
          <RView style={couponCardStyles.codeContainer}>
            <Ionicons name="pricetag" size={16} color={colors.primary} />
            <Text style={couponCardStyles.code}>{coupon.code}</Text>
          </RView>
          <Text style={couponCardStyles.title}>{getDiscountText()}</Text>
          <Text style={couponCardStyles.description}>{coupon.description}</Text>
          <Text style={couponCardStyles.validUntil}>
            Valid till {formatDate(coupon.validUntil)}
          </Text>
        </RView>

        {showApplyButton && (
          <Pressable
            style={[
              couponCardStyles.applyButton,
              isApplied && couponCardStyles.appliedButton,
            ]}
            onPress={() => onApply?.(coupon)}
          >
            <Text style={[
              couponCardStyles.applyButtonText,
              isApplied && couponCardStyles.appliedButtonText,
            ]}>
              {isApplied ? 'Applied' : 'Apply'}
            </Text>
          </Pressable>
        )}
      </RView>

      <RView style={couponCardStyles.termsContainer}>
        <Text style={couponCardStyles.termsTitle}>Terms & Conditions</Text>
        {coupon.termsAndConditions.map((term, index) => (
          <RView key={index} style={couponCardStyles.termItem}>
            <Text style={couponCardStyles.termBullet}>•</Text>
            <Text style={couponCardStyles.termText}>{term}</Text>
          </RView>
        ))}
      </RView>
    </RView>
  );
};
