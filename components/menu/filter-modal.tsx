import { FilterSectionFoodType } from '@/components/menu/filter-section-food-type';
import { FilterSectionOffers } from '@/components/menu/filter-section-offers';
import { FilterSectionRating } from '@/components/menu/filter-section-rating';
import { FilterSectionSort } from '@/components/menu/filter-section-sort';
import { FilterSidebar } from '@/components/menu/filter-sidebar';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createFilterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalProps } from '@/types/components/filter-modal.types';
import React, { useMemo, useRef, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';

type FilterSection = 'sortBy' | 'rating' | 'offers' | 'foodType';

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  activeFilters,
  onApplyFilters,
}) => {
  const { t } = useCMS();
  const { theme } = useTheme();
  const styles = useMemo(() => createFilterModalStyles(theme), [theme]);
  const [tempFilters, setTempFilters] = useState(activeFilters);
  const [activeSection, setActiveSection] = useState<FilterSection>('sortBy');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const sortByRef = useRef<View>(null);
  const ratingRef = useRef<View>(null);
  const offersRef = useRef<View>(null);
  const foodTypeRef = useRef<View>(null);

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({
      veg: null,
      hasOffers: false,
      sortBy: 'relevance',
      minRating: null,
    });
  };

  const scrollToSection = (section: FilterSection) => {
    setActiveSection(section);
    
    const refMap = {
      sortBy: sortByRef,
      rating: ratingRef,
      offers: offersRef,
      foodType: foodTypeRef,
    };

    const targetRef = refMap[section];
    if (targetRef.current && scrollViewRef.current) {
      targetRef.current.measureLayout(
        scrollViewRef.current as any,
        (x, y) => scrollViewRef.current?.scrollTo({ y: y - 20, animated: true }),
        () => {}
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <RView style={styles.header}>
            <Text variant="title" style={styles.title}>
              {t('filters.title')}
            </Text>
            <TouchableOpacity onPress={handleClear}>
              <Text variant="body" style={styles.clearText}>
                {t('filters.clearAll')}
              </Text>
            </TouchableOpacity>
          </RView>

          <RView style={styles.content}>
            <FilterSidebar 
              activeSection={activeSection}
              onSectionChange={scrollToSection}
            />

            <ScrollView 
              ref={scrollViewRef}
              style={styles.mainContent} 
              showsVerticalScrollIndicator={false}
            >
              <RView ref={sortByRef}>
                <FilterSectionSort filters={tempFilters} onUpdate={setTempFilters} />
              </RView>

              <RView ref={ratingRef}>
                <FilterSectionRating filters={tempFilters} onUpdate={setTempFilters} />
              </RView>

              <RView ref={offersRef}>
                <FilterSectionOffers filters={tempFilters} onUpdate={setTempFilters} />
              </RView>

              <RView ref={foodTypeRef}>
                <FilterSectionFoodType filters={tempFilters} onUpdate={setTempFilters} />
              </RView>
            </ScrollView>
          </RView>

          <RView style={styles.footer}>
            <Button
              title={t('filters.close')}
              variant="outline"
              size="large"
              onPress={onClose}
              style={styles.footerButton}
            />
            <Button
              title={t('filters.showResults', { count: 0 })}
              variant="primary"
              size="large"
              onPress={handleApply}
              style={styles.footerButton}
            />
          </RView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
