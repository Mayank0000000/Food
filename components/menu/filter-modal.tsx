import { FilterSectionFoodType } from '@/components/menu/filter-section-food-type';
import { FilterSectionOffers } from '@/components/menu/filter-section-offers';
import { FilterSectionRating } from '@/components/menu/filter-section-rating';
import { FilterSectionSort } from '@/components/menu/filter-section-sort';
import { FilterSidebar } from '@/components/menu/filter-sidebar';
import { Button } from '@/components/ui/button';
import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { filterModalStyles } from '@/styles/components/filter-modal.styles';
import { FilterModalProps } from '@/types/components/filter-modal.types';
import React, { useRef, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';

type FilterSection = 'sortBy' | 'rating' | 'offers' | 'foodType';

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  activeFilters,
  onApplyFilters,
}) => {
  const [tempFilters, setTempFilters] = useState(activeFilters);
  const [activeSection, setActiveSection] = useState<FilterSection>('sortBy');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const sortByRef = useRef<RView>(null);
  const ratingRef = useRef<RView>(null);
  const offersRef = useRef<RView>(null);
  const foodTypeRef = useRef<RView>(null);

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
        style={filterModalStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={filterModalStyles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <RView style={filterModalStyles.header}>
            <Text variant="title" style={filterModalStyles.title}>
              Filters and sorting
            </Text>
            <TouchableOpacity onPress={handleClear}>
              <Text variant="body" style={filterModalStyles.clearText}>
                Clear all
              </Text>
            </TouchableOpacity>
          </RView>

          <RView style={filterModalStyles.content}>
            <FilterSidebar 
              activeSection={activeSection}
              onSectionChange={scrollToSection}
            />

            <ScrollView 
              ref={scrollViewRef}
              style={filterModalStyles.mainContent} 
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

          <RView style={filterModalStyles.footer}>
            <Button
              title="Close"
              variant="outline"
              size="large"
              onPress={onClose}
              style={filterModalStyles.footerButton}
            />
            <Button
              title="Show results"
              variant="primary"
              size="large"
              onPress={handleApply}
              style={filterModalStyles.footerButton}
            />
          </RView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
