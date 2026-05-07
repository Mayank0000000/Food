import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { getCMSText } from '@/utils/cms';
import { githubService } from './github.service';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  token: string;
}

interface UpdateProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse>;
  async login(credentials: { email: string; password: string }): Promise<AuthResponse>;
  async login(emailOrCredentials: string | { email: string; password: string }, password?: string): Promise<AuthResponse> {
    try {
      const email = typeof emailOrCredentials === 'string' ? emailOrCredentials : emailOrCredentials.email;
      const pass = typeof emailOrCredentials === 'string' ? password! : emailOrCredentials.password;

      const content = await githubService.getFile(API_ENDPOINTS.FILES.USERS);
      const users: User[] = content.users || [];
      
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error(getCMSText('errors.auth.userNotFound'));
      }
      
      if (user.password !== pass) {
        throw new Error(getCMSText('errors.auth.invalidPassword'));
      }
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token: 'user-' + user.id,
      };
    } catch (error: any) {
      throw new Error(error.message || getCMSText('errors.auth.loginFailed'));
    }
  }

  async signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const content = await githubService.getFile(API_ENDPOINTS.FILES.USERS);
      const users: User[] = content.users || [];
      
      const existingUser = users.find(u => u.email === data.email);
      
      if (existingUser) {
        throw new Error(getCMSText('errors.auth.userExists'));
      }
      
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: '',
      };
      
      users.push(newUser);
      
      await githubService.updateFile(
        API_ENDPOINTS.FILES.USERS,
        { users },
        `Add new user: ${data.email}`
      );
      
      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        },
        token: 'user-' + newUser.id,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<{ id: number; name: string; email: string; phone?: string }> {
    try {
      const content = await githubService.getFile(API_ENDPOINTS.FILES.USERS);
      const users: User[] = content.users || [];
      
      const userIndex = users.findIndex(u => u.id === data.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name: data.name,
        email: data.email,
        phone: data.phone || users[userIndex].phone,
        ...(data.password && { password: data.password }),
      };
      
      await githubService.updateFile(
        API_ENDPOINTS.FILES.USERS,
        { users },
        `Update profile for user: ${data.email}`
      );
      
      return {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        phone: users[userIndex].phone,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export const authService = new AuthService();
