import { RView } from '@/components/ui/rview';
import { carouselStyles } from '@/styles/components/carousel.styles';
import { CarouselProps } from '@/types/components/carousel.types';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width } = Dimensions.get('window');

export const Carousel: React.FC<CarouselProps> = ({ images, height = 250, autoPlay = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  return (
    <RView style={carouselStyles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <RView style={[carouselStyles.slide, { width, height }]}>
            <Image
              source={{ uri: item }}
              style={carouselStyles.image}
              contentFit="cover"
            />
          </RView>
        )}
      />
      
      {/* Pagination Dots */}
      <RView style={carouselStyles.pagination}>
        {images.map((_, index) => (
          <RView
            key={index}
            style={[
              carouselStyles.dot,
              index === activeIndex && carouselStyles.activeDot,
            ]}
          />
        ))}
      </RView>
    </RView>
  );
};
