import { cmsService } from '@/services/cms.service';
import { MenuItem } from '@/types/menu.types';

export const getMenuItemName = (item: MenuItem): string => {
  // If item has a CMS key for name, use it
  if ('nameKey' in item && item.nameKey) {
    const translated = cmsService.getText(item.nameKey as string);
    // If translation found (not returning the key itself), use it
    if (translated !== item.nameKey) {
      return translated;
    }
  }
  return item.name;
};


export const getMenuItemDescription = (item: MenuItem): string => {
  // If item has a CMS key for description, use it
  if ('descriptionKey' in item && item.descriptionKey) {
    const translated = cmsService.getText(item.descriptionKey as string);
    // If translation found (not returning the key itself), use it
    if (translated !== item.descriptionKey) {
      return translated;
    }
  }
  // Fallback to original description
  return item.dishInfo;
};


export const getCategoryName = (category: string): string => {
  // Try to find translation in CMS
  const categoryKey = `menu.categories.${category.toLowerCase().replace(/\s+/g, '')}`;
  const translated = cmsService.getText(categoryKey);
  
  // If translation found (not returning the key itself), use it
  if (translated !== categoryKey) {
    return translated;
  }
  
  // Fallback to original category name
  return category;
};


export const translateMenuItem = (item: MenuItem): MenuItem => {
  return {
    ...item,
    name: getMenuItemName(item),
    dishInfo: getMenuItemDescription(item),
  };
};


export const translateMenuItems = (items: MenuItem[]): MenuItem[] => {
  return items.map(translateMenuItem);
};
