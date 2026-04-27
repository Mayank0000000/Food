import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { couponBannerStyles } from '@/styles/components/coupon-banner.styles';
import { CouponBannerProps } from '@/types/coupon.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable } from 'react-native';

export const CouponBanner: React.FC<CouponBannerProps> = ({ coupons, onPress }) => {
  const topCoupon = coupons[0];
  
  if (!topCoupon) return null;

  const getDiscountText = () => {
    if (topCoupon.discountType === 'flat') {
      return `Flat ₹${topCoupon.discount} OFF above ₹${topCoupon.minOrderAmount}`;
    }
    return `${topCoupon.discount}% OFF above ₹${topCoupon.minOrderAmount}`;
  };

  return (
    <RView style={couponBannerStyles.container}>
      <Pressable style={couponBannerStyles.pressable} onPress={onPress}>
        <RView style={couponBannerStyles.iconContainer}>
          <Ionicons name="pricetag" size={16} color="#fff" />
        </RView>
        <RView style={couponBannerStyles.contentContainer}>
          <RView style={couponBannerStyles.topRow}>
            <Text style={couponBannerStyles.title}>{getDiscountText()}</Text>
            <Text style={couponBannerStyles.count}>
              {coupons.length} {coupons.length === 1 ? 'offer' : 'offers'}
            </Text>
          </RView>
          <Text style={couponBannerStyles.description}>
            Tap to view all available coupons
          </Text>
        </RView>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color="#666" 
          style={couponBannerStyles.chevron}
        />
      </Pressable>
    </RView>
  );
};
