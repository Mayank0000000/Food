import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { githubService } from '@/services/github.service';
import { Bookmark } from '@/types/bookmark.types';
import { MenuItem } from '@/types/menu.types';

class BookmarkService {
  private BOOKMARKS_FILE = API_ENDPOINTS.FILES.BOOKMARKS;

  /**
   * Get all bookmarks from GitHub
   */
  private async getAllBookmarks(): Promise<Bookmark[]> {
    try {
      const bookmarks = await githubService.getFile(this.BOOKMARKS_FILE);
      if (!bookmarks || bookmarks.length === 0) {
        console.log('📚 No bookmarks found, starting fresh');
        return [];
      }
      return bookmarks;
    } catch (error) {
      console.error('Error fetching bookmarks from GitHub:', error);
      return [];
    }
  }

  /**
   * Save all bookmarks to GitHub
   */
  private async saveAllBookmarks(bookmarks: Bookmark[]): Promise<void> {
    try {
      await githubService.updateFile(
        this.BOOKMARKS_FILE,
        bookmarks,
        'Update bookmarks'
      );
      console.log('✅ Bookmarks saved to GitHub');
    } catch (error) {
      console.error('Error saving bookmarks to GitHub:', error);
      throw error;
    }
  }

  /**
   * Get all bookmarks for a user
   */
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      return allBookmarks.filter(b => b.userId === userId);
    } catch (error) {
      console.error('Error getting user bookmarks:', error);
      return [];
    }
  }

  /**
   * Check if a menu item is bookmarked
   */
  async isBookmarked(userId: string, menuItemId: number): Promise<boolean> {
    try {
      const bookmarks = await this.getUserBookmarks(userId);
      return bookmarks.some(b => b.menuItemId === menuItemId);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  }

  /**
   * Add a bookmark
   */
  async addBookmark(userId: string, menuItem: MenuItem): Promise<Bookmark> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      
      // Check if already bookmarked
      const existing = allBookmarks.find(
        b => b.userId === userId && b.menuItemId === menuItem.id
      );
      
      if (existing) {
        return existing;
      }
      
      const newBookmark: Bookmark = {
        id: `bookmark_${Date.now()}_${userId}`,
        userId,
        menuItemId: menuItem.id,
        menuItem,
        createdAt: new Date().toISOString(),
      };
      
      allBookmarks.push(newBookmark);
      await this.saveAllBookmarks(allBookmarks);
      
      console.log('✅ Bookmark added:', menuItem.name);
      return newBookmark;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(userId: string, menuItemId: number): Promise<void> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      const filtered = allBookmarks.filter(
        b => !(b.userId === userId && b.menuItemId === menuItemId)
      );
      
      await this.saveAllBookmarks(filtered);
      console.log('✅ Bookmark removed');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  }

  /**
   * Toggle bookmark (add if not bookmarked, remove if bookmarked)
   */
  async toggleBookmark(userId: string, menuItem: MenuItem): Promise<boolean> {
    try {
      const isCurrentlyBookmarked = await this.isBookmarked(userId, menuItem.id);
      
      if (isCurrentlyBookmarked) {
        await this.removeBookmark(userId, menuItem.id);
        return false; // Now not bookmarked
      } else {
        await this.addBookmark(userId, menuItem);
        return true; // Now bookmarked
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }

  /**
   * Clear all bookmarks for a user
   */
  async clearUserBookmarks(userId: string): Promise<void> {
    try {
      const allBookmarks = await this.getAllBookmarks();
      const filtered = allBookmarks.filter(b => b.userId !== userId);
      
      await this.saveAllBookmarks(filtered);
      console.log('✅ All bookmarks cleared for user');
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      throw error;
    }
  }
}

export const bookmarkService = new BookmarkService();
