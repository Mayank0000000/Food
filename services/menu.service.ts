import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { cmsService } from '@/services/cms.service';
import { MenuItem } from '@/types/menu.types';
import { githubService } from './github.service';

class MenuService {
  private getLocalizedText(value: unknown, language: string): string {
    if (typeof value === 'string') {
      return value;
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return '';
    }

    const localized = value as Record<string, string>;
    const languagePriority = [
      language,
      language === 'hi' ? 'hn' : undefined,
      language === 'hn' ? 'hi' : undefined,
      'en',
    ].filter(Boolean) as string[];

    for (const code of languagePriority) {
      const translated = localized[code];
      if (typeof translated === 'string' && translated.trim()) {
        return translated;
      }
    }

    return Object.values(localized).find((entry) => typeof entry === 'string' && entry.trim()) || '';
  }

  private mapLocalizedMenuItem(item: any, language: string): MenuItem {
    const localizedDescription = this.getLocalizedText(
      item.dishInfo ?? item.description ?? item.desc,
      language
    );

    return {
      ...item,
      name: this.getLocalizedText(item.name, language),
      category: this.getLocalizedText(item.category, language),
      // Keep description visible even if backend key differs across versions
      dishInfo:
        localizedDescription ||
        item.dishInfo ||
        item.description ||
        item.desc ||
        '',
    };
  }

  async getMenu(): Promise<MenuItem[]> {
    try {
      const menuItems = await githubService.getFile(API_ENDPOINTS.FILES.MENU);
      const language = cmsService.getLanguage();
      return (menuItems || []).map((item: any) => this.mapLocalizedMenuItem(item, language));
    } catch (error) {
      console.error('Error fetching menu from GitHub:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
