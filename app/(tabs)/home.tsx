import { CouponBanner } from '@/components/coupons/coupon-banner';
import { CouponModal } from '@/components/coupons/coupon-modal';
import { DynamicBanners } from '@/components/home/dynamic-banners';
import { PerfectPairings } from '@/components/home/perfect-pairings';
import { OrderProgressBanner } from '@/components/order/order-progress-banner';
import { Carousel } from '@/components/ui/carousel';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { AVAILABLE_COUPONS } from '@/data/coupons';
import { useCMS } from '@/hooks/useCMS';
import { bannerService } from '@/services/banner.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenu } from '@/store/slices/menuSlice';
import { fetchActiveOrders } from '@/store/slices/orderSlice';
import { homeStyles } from '@/styles/screens/home.styles';
import { Banner } from '@/types/banner.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAROUSEL_IMAGES = [
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
  'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg',
  'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
  'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
  'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg',
];

export default function Home() {
  const { t } = useCMS();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items: menuItems, isLoading } = useAppSelector((state) => state.menu);
  const { activeOrders } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    dispatch(fetchMenu());
    loadBanners();
    
    // Check for active orders
    if (user?.id) {
      dispatch(fetchActiveOrders(user.id.toString()));
    }
  }, [dispatch, user?.id]);

  const loadBanners = async () => {
    if (!user) {
      console.log('⚠️ No user logged in, skipping banner load');
      return;
    }

    try {
      console.log('🎯 Loading personalized banner for user:', user.id);
      
      // Get personalized banner based on user's order history
      const personalizedBanner = await bannerService.getPersonalizedBanner(user.id.toString());
      
      if (personalizedBanner) {
        console.log('✅ Personalized banner loaded:', personalizedBanner.id);
        setBanners([personalizedBanner]); // Show only one banner
      } else {
        console.log('⚠️ No banner available');
        setBanners([]);
      }
    } catch (error) {
      console.error('❌ Failed to load banners:', error);
      setBanners([]);
    }
  };


  const handleTrackOrder = (orderId: string) => {
    router.push(`/order-tracking?orderId=${orderId}`);
  };

  const perfectPairings = menuItems.slice(0, 3);

  return (
    <SafeAreaView style={homeStyles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Carousel images={CAROUSEL_IMAGES} height={250} autoPlay={true} />

        {/* Show progress banner for each active order */}
        {activeOrders && activeOrders.length > 0 && activeOrders.map((order) => (
          <OrderProgressBanner 
            key={order.id}
            order={order} 
            onTrackOrder={() => handleTrackOrder(order.id)} 
          />
        ))}

        {/* Dynamic Banners Section */}
        {banners.length > 0 && (
          <DynamicBanners banners={banners} />
        )}

        <RView style={homeStyles.infoCard}>
          <RView style={homeStyles.header}>
            <Image
              source={require('@/assets/images/Logo.png')}
              style={homeStyles.logo}
              contentFit="contain"
            />
            <RView style={homeStyles.headerText}>
              <RView style={homeStyles.titleRow}>
                <Text variant="title" style={homeStyles.restaurantName}>
                  {t('home.restaurantName')}
                </Text>
                <RView style={homeStyles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#fff" />
                  <Text variant="body" style={homeStyles.ratingText}>
                    {t('home.rating')}
                  </Text>
                </RView>
              </RView>
              <Text variant="caption" style={homeStyles.reviewCount}>
                {t('home.reviewCount')}
              </Text>
            </RView>
          </RView>
          <RView style={homeStyles.detailsRow}>
            <RView style={homeStyles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text variant="caption" style={homeStyles.detailText}>
                {t('home.location')}
              </Text>
            </RView>
          </RView>

          <RView style={homeStyles.detailsRow}>
            <RView style={homeStyles.detailItem}>
              <Ionicons name="flash-outline" size={16} color="#22C55E" />
              <Text variant="caption" style={homeStyles.detailText}>
                {t('home.deliveryTime')}
              </Text>
            </RView>
          </RView>

          <RView style={homeStyles.trustBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text variant="caption" style={homeStyles.trustText}>
              {t('home.trustBadge')}
            </Text>
          </RView>

          <CouponBanner 
            coupons={AVAILABLE_COUPONS} 
            onPress={() => setIsCouponModalVisible(true)} 
          />
        </RView>

        <CouponModal
          visible={isCouponModalVisible}
          onClose={() => setIsCouponModalVisible(false)}
          coupons={AVAILABLE_COUPONS}
        />

        <PerfectPairings items={perfectPairings} isLoading={isLoading} />

        <RView style={homeStyles.deliveryOffer}>
          <Ionicons name="bicycle" size={24} color="#FFD700" />
          <Text variant="body" style={homeStyles.deliveryText}>
            {t('home.freeDeliveryText')}<Text style={homeStyles.goldText}>{t('home.goldText')}</Text>
          </Text>
        </RView>
      </ScrollView>
    </SafeAreaView>
  );
}