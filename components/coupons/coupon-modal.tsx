import { CouponCard } from '@/components/coupons/coupon-card';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createCouponModalStyles } from '@/styles/components/coupon-modal.styles';
import { CouponModalProps } from '@/types/coupon.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';

export const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  onClose,
  coupons,
  onApply,
  appliedCouponId,
}) => {
  const { theme, colors } = useTheme();
  const couponModalStyles = useMemo(() => createCouponModalStyles(theme), [theme]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <RView style={couponModalStyles.overlay}>
        <TouchableOpacity 
          style={couponModalStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <RView style={couponModalStyles.container}>
          <RView style={couponModalStyles.header}>
            <Text style={couponModalStyles.title}>Available Coupons</Text>
            <TouchableOpacity style={couponModalStyles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </RView>

          <ScrollView 
            style={couponModalStyles.content}
            contentContainerStyle={couponModalStyles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {coupons.length === 0 ? (
              <RView style={couponModalStyles.emptyContainer}>
                <Ionicons name="pricetag-outline" size={60} color={colors.border} />
                <Text style={couponModalStyles.emptyText}>
                  No coupons available
                </Text>
              </RView>
            ) : (
              coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onApply={onApply}
                  isApplied={coupon.id === appliedCouponId}
                  showApplyButton={!!onApply}
                />
              ))
            )}
          </ScrollView>
        </RView>
      </RView>
    </Modal>
  );
};
