import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createOrderProgressBannerStyles } from '@/styles/components/order-progress-banner.styles';
import { OrderProgressBannerProps } from '@/types/components/order-progress-banner.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';

export const OrderProgressBanner: React.FC<OrderProgressBannerProps> = ({
  order,
  onTrackOrder,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const orderProgressBannerStyles = useMemo(() => createOrderProgressBannerStyles(theme), [theme]);
  const [progress] = useState(new Animated.Value(0));
  const [progressPercent, setProgressPercent] = useState(0);
  const [shouldHide, setShouldHide] = useState(false);

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
      
      // Hide banner when 100% complete
      if (percent >= 100) {
        setShouldHide(true);
      }
      
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

  // Don't render if order is complete
  if (shouldHide) {
    return null;
  }

  return (
    <RView style={orderProgressBannerStyles.container}>
      <RView style={orderProgressBannerStyles.header}>
        <RView style={orderProgressBannerStyles.iconContainer}>
          <Ionicons name="bicycle" size={24} color={colors.primary} />
        </RView>
        <RView style={orderProgressBannerStyles.textContainer}>
          <Text style={orderProgressBannerStyles.title}>
            {t('orderTracking.orderStatus')}
          </Text>
          <Text style={orderProgressBannerStyles.subtitle}>
            {progressPercent}% complete • Arriving soon
          </Text>
        </RView>
        <Button
          title={t('orderTracking.alerts.ok')}
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
