export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'flat' | 'percentage';
  minOrderAmount: number;
  maxDiscount?: number;
  validUntil: string;
  termsAndConditions: string[];
}

export interface CouponCardProps {
  coupon: Coupon;
  onApply?: (coupon: Coupon) => void;
  isApplied?: boolean;
  showApplyButton?: boolean;
}

export interface CouponListProps {
  coupons: Coupon[];
  onApply?: (coupon: Coupon) => void;
  appliedCouponId?: string;
}

export interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  coupons: Coupon[];
  onApply?: (coupon: Coupon) => void;
  appliedCouponId?: string;
}

export interface CouponBannerProps {
  coupons: Coupon[];
  onPress: () => void;
}
