import { bookmarkService } from '@/services/bookmark.service';
import { MenuItem } from '@/types/menu.types';

/**
 * Check if a menu item is bookmarked by the user
 */
export const checkBookmarkStatus = async (
  userId: string | undefined,
  menuItemId: number
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const bookmarked = await bookmarkService.isBookmarked(userId, menuItemId);
    return bookmarked;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

/**
 * Toggle bookmark status for a menu item
 * Returns the new bookmark status (true = bookmarked, false = not bookmarked)
 */
export const toggleBookmark = async (
  userId: string | undefined,
  menuItem: MenuItem
): Promise<boolean> => {
  if (!userId) {
    return false;
  }

  try {
    const newBookmarkStatus = await bookmarkService.toggleBookmark(userId, menuItem);
    return newBookmarkStatus;
  } catch (error) {
    console.error('Failed to update bookmark:', error);
    throw error;
  }
};

/**
 * Remove a bookmark
 */
export const removeBookmark = async (
  userId: string | undefined,
  menuItemId: number
): Promise<void> => {
  if (!userId) return;

  try {
    await bookmarkService.removeBookmark(userId, menuItemId);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};
