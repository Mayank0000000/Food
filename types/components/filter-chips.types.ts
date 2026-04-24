export interface FilterChipsProps {
  activeFilters: FilterState;
  onOpenModal: () => void;
}

export interface FilterState {
  veg: boolean | null;
  hasOffers: boolean;
  sortBy: 'relevance' | 'priceLowToHigh' | 'priceHighToLow' | 'rating';
  minRating: number | null;
}
