import { Button } from '@/components/ui/button';
import { PressableView } from '@/components/ui/pressable-view';
import { RView } from '@/components/ui/rview';
import { StarRating } from '@/components/ui/star-rating';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createReviewSubmissionModalStyles } from '@/styles/components/review-submission-modal.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';

interface ReviewSubmissionModalProps {
  visible: boolean;
  itemName: string;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => Promise<void>;
}

export const ReviewSubmissionModal: React.FC<ReviewSubmissionModalProps> = ({
  visible,
  itemName,
  onClose,
  onSubmit,
}) => {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const reviewSubmissionModalStyles = useMemo(() => createReviewSubmissionModalStyles(theme), [theme]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('reviews.error'), t('reviews.pleaseSelectRating'));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(rating, feedback);
      // Reset form
      setRating(0);
      setFeedback('');
      onClose();
    } catch (error) {
      Alert.alert(t('reviews.error'), t('reviews.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <PressableView style={reviewSubmissionModalStyles.overlay} onPress={handleClose}>
        <PressableView
          style={reviewSubmissionModalStyles.modalContainer}
          onPress={(e) => e?.stopPropagation?.()}
        >
          <RView style={reviewSubmissionModalStyles.header}>
            <Text variant="title" style={reviewSubmissionModalStyles.title}>
              {t('reviews.rateYourExperience')}
            </Text>
            <PressableView onPress={handleClose}>
              <Ionicons name="close" size={28} color={colors.text} />
            </PressableView>
          </RView>

          <ScrollView
            style={reviewSubmissionModalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text variant="body" style={reviewSubmissionModalStyles.itemName}>
              {itemName}
            </Text>

            <RView style={reviewSubmissionModalStyles.ratingSection}>
              <Text variant="subtitle" style={reviewSubmissionModalStyles.sectionTitle}>
                {t('reviews.yourRating')}
              </Text>
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size={40}
              />
            </RView>

            <RView style={reviewSubmissionModalStyles.feedbackSection}>
              <Text variant="subtitle" style={reviewSubmissionModalStyles.sectionTitle}>
                {t('reviews.yourFeedback')}
              </Text>
              <TextInput
                style={reviewSubmissionModalStyles.feedbackInput}
                placeholder={t('reviews.feedbackPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </RView>
          </ScrollView>

          <RView style={reviewSubmissionModalStyles.footer}>
            <Button
              title={t('reviews.submit')}
              onPress={handleSubmit}
              disabled={isSubmitting || rating === 0}
              style={reviewSubmissionModalStyles.submitButton}
            />
          </RView>
        </PressableView>
      </PressableView>
    </Modal>
  );
};
