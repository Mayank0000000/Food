import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { MenuItem } from '@/types/menu.types';
import { githubService } from './github.service';

class MenuService {
  async getMenu(): Promise<MenuItem[]> {
    try {
      const menuItems = await githubService.getFile(API_ENDPOINTS.FILES.MENU);
      return menuItems || [];
    } catch (error) {
      console.error('Error fetching menu from GitHub:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
