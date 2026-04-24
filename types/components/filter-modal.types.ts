export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  activeFilters: FilterModalState;
  onApplyFilters: (filters: FilterModalState) => void;
}

export interface FilterModalState {
  veg: boolean | null;
  hasOffers: boolean;
  sortBy: 'relevance' | 'priceLowToHigh' | 'priceHighToLow' | 'rating';
  minRating: number | null;
}
