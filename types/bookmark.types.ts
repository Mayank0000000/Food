import { MenuItem } from './menu.types';

export interface Bookmark {
  id: string;
  userId: string;
  menuItemId: number;
  menuItem: MenuItem;
  createdAt: string;
}
