export interface MenuItem {
  id: number;
  name: string;
  category: string;
  veg: boolean;
  price: number;
  rating: number[];
  feedback: string[];
  prepTime: string;
  discount: number;
  dishInfo: string;
  reviews: number;
  available: boolean;
  image: string;
}

export interface GroupedMenu {
  [category: string]: MenuItem[];
}
