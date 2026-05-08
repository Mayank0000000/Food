import { reviewService } from '@/services/review.service';
import { MenuItem, Review } from '@/types/menu.types';

export interface MenuItemReviewData {
  reviews: Review[];
  averageRating: string;
  totalReviews: number;
}

/**
 * Load reviews and stats for a menu item
 */
export const loadMenuItemReviews = async (
  menuItemId: number
): Promise<MenuItemReviewData> => {
  try {
    const [itemReviews, stats] = await Promise.all([
      reviewService.getMenuItemReviews(menuItemId),
      reviewService.getMenuItemStats(menuItemId),
    ]);
    
    return {
      reviews: itemReviews,
      averageRating: stats.averageRating.toFixed(1),
      totalReviews: stats.totalReviews,
    };
  } catch (error) {
    console.error('Error loading reviews:', error);
    return {
      reviews: [],
      averageRating: '0.0',
      totalReviews: 0,
    };
  }
};

/**
 * Handle quantity change with validation
 */
export const handleQuantityChange = (
  currentQuantity: number,
  change: number
): number => {
  const newQuantity = currentQuantity + change;
  return newQuantity >= 1 ? newQuantity : currentQuantity;
};

/**
 * Calculate total price for menu item with quantity
 */
export const calculateTotalPrice = (
  item: MenuItem,
  quantity: number
): number => {
  return item.price * quantity;
};
