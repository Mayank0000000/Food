import { useAppSelector } from '@/store/hooks';
import { MenuItem } from '@/types/menu.types';
import { useMemo } from 'react';

// Type for localized menu item with string name and description
export interface LocalizedMenuItem extends Omit<MenuItem, 'name' | 'description'> {
  name: string;
  description: string;
}

/**
 * Custom hook to get localized menu items based on current language
 * @returns Object containing localized menu items and loading state
 */
export const useLocalizedMenu = () => {
  const { items: apiItems, isLoading, error } = useAppSelector((state: any) => state.menu);
  const currentLanguage = useAppSelector((state: any) => state.language.currentLanguage);

  // Map language codes to API keys
  const languageMap: { [key: string]: 'en' | 'hi' | 'kn' | 'te' } = {
    'en': 'en',
    'hi': 'hi',
    'kn': 'kn',
    'te': 'te',
  };

  // Memoize localized items to avoid unnecessary recalculations
  const localizedItems: LocalizedMenuItem[] = useMemo(() => {
    const langKey = languageMap[currentLanguage] || 'en';
    
    return apiItems.map((item: MenuItem) => ({
      ...item,
      name: item.name[langKey] || item.name.en,
      description: item.description[langKey] || item.description.en,
    }));
  }, [apiItems, currentLanguage]);

  return {
    items: localizedItems,
    isLoading,
    error,
  };
};
