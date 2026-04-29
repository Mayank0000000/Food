import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { orderProgressBannerStyles } from '@/styles/components/order-progress-banner.styles';
import { OrderProgressBannerProps } from '@/types/components/order-progress-banner.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';

export const OrderProgressBanner: React.FC<OrderProgressBannerProps> = ({
  order,
  onTrackOrder,
}) => {
  const [progress] = useState(new Animated.Value(0));
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    // Calculate progress based on time elapsed
    const calculateProgress = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const estimatedTime = new Date(order.estimatedDeliveryTime).getTime();
      const now = Date.now();
      
      const totalDuration = estimatedTime - createdTime;
      const elapsed = now - createdTime;
      
      const percent = Math.min((elapsed / totalDuration) * 100, 100);
      setProgressPercent(Math.round(percent));
      
      return percent / 100;
    };

    // Initial calculation
    const initialProgress = calculateProgress();
    Animated.timing(progress, {
      toValue: initialProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Update every second
    const interval = setInterval(() => {
      const newProgress = calculateProgress();
      Animated.timing(progress, {
        toValue: newProgress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);

    return () => clearInterval(interval);
  }, [order]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <RView style={orderProgressBannerStyles.container}>
      <RView style={orderProgressBannerStyles.header}>
        <RView style={orderProgressBannerStyles.iconContainer}>
          <Ionicons name="bicycle" size={24} color="#FF6B35" />
        </RView>
        <RView style={orderProgressBannerStyles.textContainer}>
          <Text style={orderProgressBannerStyles.title}>Order on the way!</Text>
          <Text style={orderProgressBannerStyles.subtitle}>
            {progressPercent}% complete • Arriving soon
          </Text>
        </RView>
        <Button
          title="Track"
          onPress={onTrackOrder}
          size="small"
          style={orderProgressBannerStyles.trackButton}
        />
      </RView>
      
      <RView style={orderProgressBannerStyles.progressBarContainer}>
        <Animated.View
          style={[
            orderProgressBannerStyles.progressBar,
            { width: progressWidth },
          ]}
        />
      </RView>
    </RView>
  );
};
