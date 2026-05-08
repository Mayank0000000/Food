import { MenuItem } from '@/types/menu.types';

export interface MenuItemCardProps {
  item: MenuItem;
  onPress?: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}
