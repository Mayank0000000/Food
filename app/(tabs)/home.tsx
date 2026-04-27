import { CouponBanner } from '@/components/coupons/coupon-banner';
import { CouponModal } from '@/components/coupons/coupon-modal';
import { PerfectPairings } from '@/components/home/perfect-pairings';
import { Carousel } from '@/components/ui/carousel';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { AVAILABLE_COUPONS } from '@/data/coupons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenu } from '@/store/slices/menuSlice';
import { homeStyles } from '@/styles/screens/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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
  const dispatch = useAppDispatch();
  const { items: menuItems, isLoading } = useAppSelector((state) => state.menu);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const perfectPairings = menuItems.slice(0, 3);

  return (
    <SafeAreaView style={homeStyles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Carousel images={CAROUSEL_IMAGES} height={250} autoPlay={true} />

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
                  Perfect Pairing
                </Text>
                <RView style={homeStyles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#fff" />
                  <Text variant="body" style={homeStyles.ratingText}>
                    4.0
                  </Text>
                </RView>
              </RView>
              <Text variant="caption" style={homeStyles.reviewCount}>
                By 31K+
              </Text>
            </RView>
          </RView>
          <RView style={homeStyles.detailsRow}>
            <RView style={homeStyles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text variant="caption" style={homeStyles.detailText}>
                2.8 km • JP Nagar
              </Text>
            </RView>
          </RView>

          <RView style={homeStyles.detailsRow}>
            <RView style={homeStyles.detailItem}>
              <Ionicons name="flash-outline" size={16} color="#22C55E" />
              <Text variant="caption" style={homeStyles.detailText}>
                20-25 mins • Schedule for later
              </Text>
            </RView>
          </RView>

          <RView style={homeStyles.trustBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <Text variant="caption" style={homeStyles.trustText}>
              Last 100 orders without complaints
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
            Get FREE delivery above ₹49 with <Text style={homeStyles.goldText}>GOLD</Text>
          </Text>
        </RView>
      </ScrollView>
    </SafeAreaView>
  );
}