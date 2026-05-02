/**
 * Banner Types
 */

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  deeplink: string;
  category: string;
  isActive: boolean;
  priority: number;
  startTime?: string;
  endTime?: string;
  targeting?: {
    city: string[];
    foodPreference: string[];
  };
}
