import { RView } from '@/components/ui/rview';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createReviewsListStyles } from '@/styles/components/reviews-list.styles';
import { Review } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';

interface ReviewsListProps {
  reviews: Review[];
  averageRating: string;
  totalReviews: number;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const reviewsListStyles = useMemo(() => createReviewsListStyles(theme), [theme]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('reviews.today');
    if (diffDays === 1) return t('reviews.yesterday');
    if (diffDays < 7) return t('reviews.daysAgo', { days: diffDays.toString() });
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return t('reviews.weeksAgo', { weeks: weeks.toString() });
    }
    return date.toLocaleDateString();
  };

  if (reviews.length === 0) {
    return (
      <RView style={reviewsListStyles.emptyContainer}>
        <Ionicons name="chatbox-outline" size={48} color={colors.border} />
        <Text variant="body" style={reviewsListStyles.emptyText}>
          {t('reviews.noReviews')}
        </Text>
        <Text variant="caption" style={reviewsListStyles.emptySubtext}>
          {t('reviews.beTheFirst')}
        </Text>
      </RView>
    );
  }

  return (
    <RView style={reviewsListStyles.container}>
      <RView style={reviewsListStyles.summarySection}>
        <RView style={reviewsListStyles.ratingBox}>
          <Text variant="title" style={reviewsListStyles.averageRating}>
            {averageRating}
          </Text>
          <StarRating rating={parseFloat(averageRating)} readonly size={20} />
          <Text variant="caption" style={reviewsListStyles.totalReviews}>
            {t('reviews.basedOn', { count: totalReviews.toString() })}
          </Text>
        </RView>
      </RView>

      <RView style={reviewsListStyles.divider} />

      <RView style={reviewsListStyles.reviewsList}>
        <Text variant="subtitle" style={reviewsListStyles.reviewsTitle}>
          {t('reviews.customerReviews')}
        </Text>
        {reviews.map((review, index) => (
          <RView key={index} style={reviewsListStyles.reviewItem}>
            <RView style={reviewsListStyles.reviewHeader}>
              <RView style={reviewsListStyles.userInfo}>
                <RView style={reviewsListStyles.avatar}>
                  <Text style={reviewsListStyles.avatarText}>
                    {review.userName.charAt(0).toUpperCase()}
                  </Text>
                </RView>
                <RView>
                  <Text variant="subtitle" style={reviewsListStyles.userName}>
                    {review.userName}
                  </Text>
                  <Text variant="caption" style={reviewsListStyles.reviewDate}>
                    {formatDate(review.createdAt)}
                  </Text>
                </RView>
              </RView>
              <StarRating rating={review.rating} readonly size={16} />
            </RView>
            {review.feedback && (
              <Text variant="body" style={reviewsListStyles.reviewText}>
                {review.feedback}
              </Text>
            )}
          </RView>
        ))}
      </RView>
    </RView>
  );
};
