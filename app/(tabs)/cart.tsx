import { CartItemComponent } from '@/components/cart/cart-item';
import { CouponBanner } from '@/components/coupons/coupon-banner';
import { CouponModal } from '@/components/coupons/coupon-modal';
import { PaymentMethodModal } from '@/components/order/payment-method-modal';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { MenuListSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { AVAILABLE_COUPONS } from '@/data/coupons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCart, fetchCart, updateCartItemQuantity } from '@/store/slices/cartSlice';
import { cartStyles } from '@/styles/screens/cart.styles';
import { Coupon } from '@/types/coupon.types';
import { PaymentMethod } from '@/types/order.types';
import { getCartSummary, validateCoupon } from '@/utils/cartCalculations';
import { requestLocationPermission } from '@/utils/locationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Cart() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, isLoading } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id.toString()));
    }
  }, [dispatch, user?.id]);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (user?.id) {
      dispatch(updateCartItemQuantity({
        userId: user.id.toString(),
        itemId,
        quantity,
      }));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    handleUpdateQuantity(itemId, 0);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            if (user?.id) {
              dispatch(clearCart(user.id.toString()));
            }
          },
        },
      ]
    );
  };

  const handleDineIn = () => {
    Alert.alert('Dine In', 'Dine In functionality coming soon!');
  };

  const handleOrder = async () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first.');
      return;
    }

    // Request location permission
    const locationResult = await requestLocationPermission();

    if (!locationResult.granted) {
      Alert.alert(
        'Location Required',
        'We need your location to deliver your order. Please enable location access in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: handleOrder },
        ]
      );
      return;
    }

    // Show payment method modal
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = async (paymentMethod: PaymentMethod) => {
    setIsPaymentModalVisible(false);

    // Get user's current location
    const locationResult = await requestLocationPermission();
    
    if (locationResult.granted && locationResult.location) {
      const userLocation = {
        latitude: locationResult.location.coords.latitude,
        longitude: locationResult.location.coords.longitude,
      };
      
      // Store location in AsyncStorage for order tracking
      await AsyncStorage.setItem('deliveryLocation', JSON.stringify(userLocation));
    }

    // Clear cart and navigate to tracking
    if (user?.id) {
      dispatch(clearCart(user.id.toString()));
    }
    
    // Navigate to order tracking
    router.push('/order-tracking');
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    if (!cart) return;

    const validation = validateCoupon(coupon, cart.totalAmount);
    
    if (!validation.valid) {
      Alert.alert('Minimum Order Not Met', validation.message);
      return;
    }

    setAppliedCoupon(coupon);
    setIsCouponModalVisible(false);
    Alert.alert('Coupon Applied', `${coupon.code} has been applied successfully!`);
  };

  const cartSummary = cart ? getCartSummary(cart.totalAmount, appliedCoupon) : null;

  if (isLoading) {
    return (
      <SafeAreaView style={cartStyles.container}>
        <MenuListSkeleton count={3} />
      </SafeAreaView>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={cartStyles.container}>
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Add some delicious items to get started"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cartStyles.container}>
      <RView style={cartStyles.header}>
        <Text variant="title" style={cartStyles.title}>
          Your Cart ({cart.totalItems} items)
        </Text>
        <Button
          title="Clear"
          variant="outline"
          size="small"
          onPress={handleClearCart}
        />
      </RView>

      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItemComponent
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveItem}
          />
        )}
        contentContainerStyle={cartStyles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Coupon Section */}
      <RView style={cartStyles.couponSection}>
        <CouponBanner 
          coupons={AVAILABLE_COUPONS} 
          onPress={() => setIsCouponModalVisible(true)} 
        />
      </RView>

      <CouponModal
        visible={isCouponModalVisible}
        onClose={() => setIsCouponModalVisible(false)}
        coupons={AVAILABLE_COUPONS}
        onApply={handleApplyCoupon}
        appliedCouponId={appliedCoupon?.id}
      />

      <PaymentMethodModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        onConfirm={handlePaymentConfirm}
      />

     <RView style={cartStyles.billContainer}>
        <Text variant="subtitle" style={cartStyles.billTitle}>
          Bill Summary
        </Text>
        
        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            Item Total
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.itemTotal}
          </Text>
        </RView>

        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            Delivery Fee
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.deliveryFee}
          </Text>
        </RView>

        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            Taxes & Charges
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.taxes}
          </Text>
        </RView>

        {cartSummary && cartSummary.discount > 0 && (
          <RView style={cartStyles.billRow}>
            <Text variant="body" style={[cartStyles.billLabel, cartStyles.discountLabel]}>
              Coupon Discount ({appliedCoupon?.code})
            </Text>
            <Text variant="body" style={[cartStyles.billValue, cartStyles.discountValue]}>
              -₹{Math.round(cartSummary.discount)}
            </Text>
          </RView>
        )}

        <RView style={[cartStyles.billRow, cartStyles.totalRow]}>
          <Text variant="subtitle" style={cartStyles.totalLabel}>
            Total Amount
          </Text>
          <Text variant="subtitle" style={cartStyles.totalValue}>
            ₹{cartSummary?.finalTotal}
          </Text>
        </RView>

        <RView style={cartStyles.ctaContainer}>
          <Button
            title="Dine In"
            onPress={handleDineIn}
            variant="outline"
            style={cartStyles.ctaButton}
          />
          <Button
            title="Order"
            onPress={handleOrder}
            style={cartStyles.ctaButton}
          />
        </RView>
      </RView>
    </SafeAreaView>
  );
}