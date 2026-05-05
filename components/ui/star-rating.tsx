import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { starRatingStyles } from '@/styles/components/star-rating.styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  color?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 24,
  readonly = false,
  color = '#FF6B35',
}) => {
  const handleStarPress = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  return (
    <RView style={starRatingStyles.container}>
      {[1, 2, 3, 4, 5].map((star) => {
        const StarComponent = readonly ? RView : PressableView;
        return (
          <StarComponent
            key={star}
            onPress={() => handleStarPress(star)}
            style={starRatingStyles.starButton}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={size}
              color={star <= rating ? color : '#D1D5DB'}
            />
          </StarComponent>
        );
      })}
    </RView>
  );
};
