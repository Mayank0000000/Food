import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { githubService } from './github.service';
import { getCMSText } from '@/utils/cms';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const content = await githubService.getFile(API_ENDPOINTS.FILES.USERS);
      const users: User[] = content.users || [];
      
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error(getCMSText('errors.auth.userNotFound'));
      }
      
      if (user.password !== credentials.password) {
        throw new Error(getCMSText('errors.auth.invalidPassword'));
      }
      
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
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
        },
        token: 'user-' + newUser.id,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  }
}

export const authService = new AuthService();
