import { Coupon } from '@/types/coupon.types';

export const DELIVERY_FEE = 40;
export const TAX_RATE = 0.05; // 5%

/**
 * Calculate discount amount based on coupon and cart total
 */
export const calculateCouponDiscount = (
  coupon: Coupon | null,
  cartTotal: number
): number => {
  if (!coupon) return 0;

  if (coupon.discountType === 'flat') {
    return coupon.discount;
  }

  // Percentage discount
  const percentageDiscount = (cartTotal * coupon.discount) / 100;
  return coupon.maxDiscount 
    ? Math.min(percentageDiscount, coupon.maxDiscount)
    : percentageDiscount;
};

/**
 * Calculate taxes and charges based on cart total
 */
export const calculateTaxes = (cartTotal: number): number => {
  return Math.round(cartTotal * TAX_RATE);
};

/**
 * Calculate final total including delivery, taxes, and discount
 */
export const calculateFinalTotal = (
  cartTotal: number,
  discount: number = 0
): number => {
  const taxes = calculateTaxes(cartTotal);
  return cartTotal + DELIVERY_FEE + taxes - discount;
};

/**
 * Validate if coupon can be applied to cart
 */
export const validateCoupon = (
  coupon: Coupon,
  cartTotal: number
): { valid: boolean; message?: string } => {
  if (cartTotal < coupon.minOrderAmount) {
    const remaining = coupon.minOrderAmount - cartTotal;
    return {
      valid: false,
      message: `Add items worth ₹${remaining} more to apply this coupon.`,
    };
  }

  return { valid: true };
};

/**
 * Get cart summary with all calculations
 */
export const getCartSummary = (
  cartTotal: number,
  appliedCoupon: Coupon | null = null
) => {
  const discount = calculateCouponDiscount(appliedCoupon, cartTotal);
  const taxes = calculateTaxes(cartTotal);
  const finalTotal = calculateFinalTotal(cartTotal, discount);

  return {
    itemTotal: cartTotal,
    deliveryFee: DELIVERY_FEE,
    taxes,
    discount,
    finalTotal: Math.round(finalTotal),
  };
};
