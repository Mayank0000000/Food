import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Address, AddressFormData } from '@/types/address.types';
import { githubService } from './github.service';

class AddressService {
  private readonly ADDRESSES_FILE = API_ENDPOINTS.FILES.ADDRESSES;

  /**
   * Get all addresses for a user
   */
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const addresses: Address[] = (await githubService.getFile(this.ADDRESSES_FILE)) || [];
      return addresses.filter(addr => addr.userId === userId);
    } catch (error) {
      console.error('Failed to get addresses:', error);
      return [];
    }
  }

  /**
   * Get default address for a user
   */
  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      const addresses = await this.getUserAddresses(userId);
      return addresses.find(addr => addr.isDefault) || addresses[0] || null;
    } catch (error) {
      console.error('Failed to get default address:', error);
      return null;
    }
  }

  /**
   * Add a new address
   */
  async addAddress(userId: string, addressData: AddressFormData): Promise<Address> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const addresses: Address[] = (await githubService.getFile(this.ADDRESSES_FILE)) || [];
        
        // If this is set as default, unset other defaults for this user
        if (addressData.isDefault) {
          addresses.forEach(addr => {
            if (addr.userId === userId) {
              addr.isDefault = false;
            }
          });
        }

        const addressId = `ADDR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newAddress: Address = {
          id: addressId,
          userId,
          ...addressData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addresses.push(newAddress);
        await githubService.updateFile(this.ADDRESSES_FILE, addresses, `Add address ${addressId}`);
        console.log('✅ Address added successfully:', addressId);
        return newAddress;
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ Address add conflict, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to add address:', lastError);
    throw lastError;
  }

  /**
   * Update an address
   */
  async updateAddress(addressId: string, userId: string, addressData: Partial<AddressFormData>): Promise<Address> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const addresses: Address[] = (await githubService.getFile(this.ADDRESSES_FILE)) || [];
        const index = addresses.findIndex(addr => addr.id === addressId && addr.userId === userId);

        if (index === -1) {
          throw new Error('Address not found');
        }

        // If this is set as default, unset other defaults for this user
        if (addressData.isDefault) {
          addresses.forEach(addr => {
            if (addr.userId === userId && addr.id !== addressId) {
              addr.isDefault = false;
            }
          });
        }

        addresses[index] = {
          ...addresses[index],
          ...addressData,
          updatedAt: new Date().toISOString(),
        };

        await githubService.updateFile(this.ADDRESSES_FILE, addresses, `Update address ${addressId}`);
        console.log('✅ Address updated successfully:', addressId);
        return addresses[index];
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ Address update conflict, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to update address:', lastError);
    throw lastError;
  }

  /**
   * Delete an address
   */
  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const addresses: Address[] = (await githubService.getFile(this.ADDRESSES_FILE)) || [];
        const filtered = addresses.filter(addr => !(addr.id === addressId && addr.userId === userId));

        await githubService.updateFile(this.ADDRESSES_FILE, filtered, `Delete address ${addressId}`);
        console.log('✅ Address deleted successfully:', addressId);
        return;
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ Address delete conflict, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to delete address:', lastError);
    throw lastError;
  }

  /**
   * Set an address as default
   */
  async setDefaultAddress(addressId: string, userId: string): Promise<void> {
    const MAX_RETRIES = 3;
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const addresses: Address[] = (await githubService.getFile(this.ADDRESSES_FILE)) || [];
        
        // Unset all defaults for this user
        addresses.forEach(addr => {
          if (addr.userId === userId) {
            addr.isDefault = addr.id === addressId;
            if (addr.id === addressId) {
              addr.updatedAt = new Date().toISOString();
            }
          }
        });

        await githubService.updateFile(this.ADDRESSES_FILE, addresses, `Set default address ${addressId}`);
        console.log('✅ Default address set successfully:', addressId);
        return;
      } catch (error: any) {
        lastError = error;
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ Set default address conflict, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
          continue;
        }
        break;
      }
    }
    console.error('Failed to set default address:', lastError);
    throw lastError;
  }
}

export const addressService = new AddressService();
