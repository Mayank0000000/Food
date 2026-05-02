import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Banner } from '@/types/banner.types';
import { githubService } from './github.service';

class BannerService {
  private readonly BANNERS_FILE = API_ENDPOINTS.FILES.BANNERS;

  /**
   * Get all active banners
   */
  async getActiveBanners(): Promise<Banner[]> {
    try {
      console.log('📡 Fetching banners from API...');
      const banners: Banner[] = (await githubService.getFile(this.BANNERS_FILE)) || [];
      console.log('📦 Raw banners from API:', banners.length, banners);
      
      const now = new Date();
      console.log('🕐 Current time:', now.toISOString());
      
      // Filter active banners within time range (if time fields exist)
      const activeBanners = banners.filter(banner => {
        if (!banner.isActive) {
          console.log(`⏭️ Skipping inactive banner: ${banner.id}`);
          return false;
        }
        
        // If no time range specified, banner is always active
        if (!banner.startTime || !banner.endTime) {
          console.log(`✅ Banner ${banner.id} is active (no time restrictions)`);
          return true;
        }
        
        const startTime = new Date(banner.startTime);
        const endTime = new Date(banner.endTime);
        
        const isInTimeRange = now >= startTime && now <= endTime;
        
        if (!isInTimeRange) {
          console.log(`⏰ Banner ${banner.id} outside time range:`, {
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            now: now.toISOString(),
          });
        } else {
          console.log(`✅ Banner ${banner.id} is in time range`);
        }
        
        return isInTimeRange;
      });
      
      console.log('✅ Active banners after filtering:', activeBanners.length);
      
      // Sort by priority (lower number = higher priority)
      return activeBanners.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      console.error('❌ Failed to get banners:', error);
      return [];
    }
  }

  /**
   * Get banners filtered by city and food preference
   */
  async getFilteredBanners(city?: string, foodPreference?: string): Promise<Banner[]> {
    try {
      const activeBanners = await this.getActiveBanners();
      
      if (!city && !foodPreference) {
        return activeBanners;
      }
      
      return activeBanners.filter(banner => {
        // If banner has no targeting, show it to everyone
        if (!banner.targeting) {
          return true;
        }
        
        const cityMatch = !city || banner.targeting.city?.includes(city);
        const prefMatch = !foodPreference || banner.targeting.foodPreference?.includes(foodPreference);
        
        return cityMatch && prefMatch;
      });
    } catch (error) {
      console.error('Failed to get filtered banners:', error);
      return [];
    }
  }

  /**
   * Get personalized banner based on user's latest order
   */
  async getPersonalizedBanner(userId: string): Promise<Banner | null> {
    try {
      console.log('🎯 Getting personalized banner for user:', userId);
      
      // Get active banners
      const activeBanners = await this.getActiveBanners();
      if (activeBanners.length === 0) {
        console.log('⚠️ No active banners available');
        return null;
      }

      // Get user's orders
      const { orderService } = await import('./order.service');
      const userOrders = await orderService.getUserOrders(userId);
      
      if (!userOrders || userOrders.length === 0) {
        console.log('📋 No order history, showing highest priority banner');
        return activeBanners[0]; // Return highest priority banner
      }

      // Get latest order
      const latestOrder = userOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      console.log('📦 Latest order:', latestOrder.id);

      // Extract categories from order items
      const orderCategories = latestOrder.items.map(item => 
        item.category?.toLowerCase()
      ).filter(Boolean);

      console.log('🏷️ Order categories:', orderCategories);

      // Find banner matching any of the order categories
      const matchingBanner = activeBanners.find(banner => 
        orderCategories.includes(banner.category.toLowerCase())
      );

      if (matchingBanner) {
        console.log('✅ Found matching banner:', matchingBanner.id, matchingBanner.category);
        return matchingBanner;
      }

      // If no match, return highest priority banner
      console.log('📌 No category match, showing highest priority banner');
      return activeBanners[0];
    } catch (error) {
      console.error('❌ Failed to get personalized banner:', error);
      
      // Fallback: return first active banner
      const activeBanners = await this.getActiveBanners();
      return activeBanners.length > 0 ? activeBanners[0] : null;
    }
  }
}

export const bannerService = new BannerService();

// Export individual functions for convenience
export const getActiveBanners = () => bannerService.getActiveBanners();
export const getFilteredBanners = (city?: string, foodPreference?: string) =>
  bannerService.getFilteredBanners(city, foodPreference);
export const getPersonalizedBanner = (userId: string) =>
  bannerService.getPersonalizedBanner(userId);
