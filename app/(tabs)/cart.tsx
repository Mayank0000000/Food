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
import { useCMS } from '@/hooks/useCMS';
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
  const { t } = useCMS();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cart, isLoading } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

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
      t('cart.clearCart'),
      t('cart.clearCartConfirm'),
      [
        { text: t('cart.cancel'), style: 'cancel' },
        {
          text: t('cart.clear'),
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
    if (!cart || cart.items.length === 0) {
      Alert.alert(t('cart.emptyCartAlert'), t('cart.emptyCartMessage'));
      return;
    }
    router.push('/dine-in');
  };

  const handleOrder = async () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert(t('cart.emptyCartAlert'), t('cart.emptyCartMessage'));
      return;
    }

    // Request location permission
    const locationResult = await requestLocationPermission();

    if (!locationResult.granted) {
      Alert.alert(
        t('cart.locationRequired'),
        t('cart.locationMessage'),
        [
          { text: t('cart.cancel'), style: 'cancel' },
          { text: t('cart.tryAgain'), onPress: handleOrder },
        ]
      );
      return;
    }

    // Show payment method modal
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = async (paymentMethod: PaymentMethod) => {
    setIsPaymentModalVisible(false);
    setIsOrderLoading(true);

    if (!cart || !user) {
      setIsOrderLoading(false);
      return;
    }

    try {
      // Get user's current location
      const locationResult = await requestLocationPermission();
      
      if (!locationResult.granted || !locationResult.location) {
        Alert.alert(t('cart.locationError'), t('cart.locationErrorMessage'));
        setIsOrderLoading(false);
        return;
      }

      const userLocation = {
        latitude: locationResult.location.coords.latitude,
        longitude: locationResult.location.coords.longitude,
      };

      // Store location in AsyncStorage for order tracking
      await AsyncStorage.setItem('deliveryLocation', JSON.stringify(userLocation));

      // Get cart summary
      const summary = getCartSummary(cart.totalAmount, appliedCoupon);
      if (!summary) {
        setIsOrderLoading(false);
        return;
      }

      // Create order
      const { createOrder } = await import('@/services/order.service');
      const { DEMO_LOCATIONS } = await import('@/data/locations');

      const orderData = {
        userId: user.id.toString(),
        items: cart.items.map(item => ({
          id: item.menuItem.id, // Use menu item ID, not cart item ID
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
          image: item.menuItem.image,
          category: item.menuItem.category,
        })),
        totalAmount: summary.itemTotal,
        deliveryFee: summary.deliveryFee,
        taxes: summary.taxes,
        discount: summary.discount,
        finalAmount: summary.finalTotal,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        status: 'ordered' as const,
        deliveryLocation: userLocation,
        restaurantLocation: DEMO_LOCATIONS.restaurant,
        estimatedDeliveryTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
      };

      const order = await createOrder(orderData);

      // Store order ID for tracking
      await AsyncStorage.setItem('currentOrderId', order.id);

      // Send order placed notification
      const { notificationService } = await import('@/services/notification.service');
      await notificationService.notifyOrderPlaced(order.id, 'Perfect Pairing');

      // Add to active orders in Redux (central store)
      const { addActiveOrder } = await import('@/store/slices/orderSlice');
      dispatch(addActiveOrder(order));

      // Clear cart and navigate to tracking
      dispatch(clearCart(user.id.toString()));
      router.push('/order-tracking');
    } catch (error) {
      console.error('Failed to create order:', error);
      Alert.alert(t('errors.generic.somethingWentWrong'), t('errors.generic.tryAgain'));
    } finally {
      setIsOrderLoading(false);
    }
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    if (!cart) return;

    const validation = validateCoupon(coupon, cart.totalAmount);
    
    if (!validation.valid) {
      Alert.alert(t('coupons.notApplicable'), validation.message);
      return;
    }

    setAppliedCoupon(coupon);
    setIsCouponModalVisible(false);
    Alert.alert(t('coupons.applied'), `${coupon.code} has been applied successfully!`);
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
          title={t('cart.emptyTitle')}
          subtitle={t('cart.emptySubtitle')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={cartStyles.container}>
      <RView style={cartStyles.header}>
        <Text variant="title" style={cartStyles.title}>
          {t('cart.title')} ({cart.totalItems} items)
        </Text>
        <Button
          title={t('common.clear')}
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
          {t('cart.billSummary')}
        </Text>
        
        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            {t('cart.itemTotal')}
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.itemTotal}
          </Text>
        </RView>

        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            {t('cart.deliveryFee')}
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.deliveryFee}
          </Text>
        </RView>

        <RView style={cartStyles.billRow}>
          <Text variant="body" style={cartStyles.billLabel}>
            {t('cart.gst')}
          </Text>
          <Text variant="body" style={cartStyles.billValue}>
            ₹{cartSummary?.taxes}
          </Text>
        </RView>

        {cartSummary && cartSummary.discount > 0 && (
          <RView style={cartStyles.billRow}>
            <Text variant="body" style={[cartStyles.billLabel, cartStyles.discountLabel]}>
              {t('cart.discount')} ({appliedCoupon?.code})
            </Text>
            <Text variant="body" style={[cartStyles.billValue, cartStyles.discountValue]}>
              -₹{Math.round(cartSummary.discount)}
            </Text>
          </RView>
        )}

        <RView style={[cartStyles.billRow, cartStyles.totalRow]}>
          <Text variant="subtitle" style={cartStyles.totalLabel}>
            {t('cart.toPay')}
          </Text>
          <Text variant="subtitle" style={cartStyles.totalValue}>
            ₹{cartSummary?.finalTotal}
          </Text>
        </RView>

        <RView style={cartStyles.ctaContainer}>
          <Button
            title={t('cart.dineInButton')}
            onPress={handleDineIn}
            variant="outline"
            style={cartStyles.ctaButton}
            disabled={isOrderLoading}
          />
          <Button
            title={t('cart.orderButton')}
            onPress={handleOrder}
            style={cartStyles.ctaButton}
            loading={isOrderLoading}
          />
        </RView>
      </RView>
    </SafeAreaView>
  );
}