import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { dynamicBannersStyles } from '@/styles/components/dynamic-banners.styles';
import { Banner } from '@/types/banner.types';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

interface DynamicBannersProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export const DynamicBanners: React.FC<DynamicBannersProps> = ({ banners, onBannerPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  if (!banners || banners.length === 0) {
    return null;
  }

  const isSingleBanner = banners.length === 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isSingleBanner) return;
    
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const renderBanner = ({ item }: { item: Banner }) => {
    return (
      <TouchableOpacity
        style={dynamicBannersStyles.bannerContainer}
        onPress={() => onBannerPress?.(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.image }}
          style={dynamicBannersStyles.bannerImage}
          contentFit="cover"
        />
        <RView style={dynamicBannersStyles.bannerOverlay}>
          <RView style={dynamicBannersStyles.bannerContent}>
            <Text variant="title" style={dynamicBannersStyles.bannerTitle}>
              {item.title}
            </Text>
            <Text variant="body" style={dynamicBannersStyles.bannerSubtitle}>
              {item.subtitle}
            </Text>
          </RView>
        </RView>
      </TouchableOpacity>
    );
  };

  return (
    <RView style={dynamicBannersStyles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled={!isSingleBanner}
        showsHorizontalScrollIndicator={false}
        snapToInterval={isSingleBanner ? undefined : BANNER_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={dynamicBannersStyles.listContent}
        scrollEnabled={!isSingleBanner}
      />
      
      {!isSingleBanner && (
        <RView style={dynamicBannersStyles.pagination}>
          {banners.map((_, index) => (
            <RView
              key={index}
              style={[
                dynamicBannersStyles.paginationDot,
                index === activeIndex && dynamicBannersStyles.paginationDotActive,
              ]}
            />
          ))}
        </RView>
      )}
    </RView>
  );
};
