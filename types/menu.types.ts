export interface Review {
  id: string; // Unique review ID
  menuItemId: number; // Reference to menu item
  userId: string;
  userName: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  veg: boolean;
  price: number;
  prepTime: string;
  discount: number;
  dishInfo: string;
  available: boolean;
  image: string;
}

export interface GroupedMenu {
  [category: string]: MenuItem[];
}
