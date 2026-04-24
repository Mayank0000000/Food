import { FilterState } from '@/types/components/filter-chips.types';
import { MenuItem } from '@/types/menu.types';

export const applyMenuFilters = (
  items: MenuItem[],
  filters: FilterState,
  searchQuery: string = ''
): MenuItem[] => {
  let filtered = [...items];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.dishInfo.toLowerCase().includes(query)
    );
  }

  if (filters.veg !== null) {
    filtered = filtered.filter((item) => item.veg === filters.veg);
  }

  if (filters.hasOffers) {
    filtered = filtered.filter((item) => item.discount > 0);
  }

  if (filters.minRating !== null) {
    filtered = filtered.filter((item) => {
      const avgRating =
        item.rating.length > 0
          ? item.rating.reduce((sum, r) => sum + r, 0) / item.rating.length
          : 0;
      return avgRating >= filters.minRating!;
    });
  }

  switch (filters.sortBy) {
    case 'priceLowToHigh':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'priceHighToLow':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => {
        const avgA =
          a.rating.length > 0
            ? a.rating.reduce((sum, r) => sum + r, 0) / a.rating.length
            : 0;
        const avgB =
          b.rating.length > 0
            ? b.rating.reduce((sum, r) => sum + r, 0) / b.rating.length
            : 0;
        return avgB - avgA;
      });
      break;
    default:
      break;
  }

  return filtered;
};

export const groupMenuByCategory = (items: MenuItem[]) => {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: MenuItem[] });
};
