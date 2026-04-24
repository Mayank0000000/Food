import { githubService } from './github.service';

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
      const { content } = await githubService.getFile();
      const users: User[] = content.users || [];
      
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('User not found. Please sign up first.');
      }
      
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
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
      throw new Error(error.message || 'Login failed');
    }
  }

  async signup(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    try {
      const { content, sha } = await githubService.getFile();
      const users: User[] = content.users || [];
      
      const existingUser = users.find(u => u.email === data.email);
      
      if (existingUser) {
        throw new Error('User already exists. Please login.');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        password: data.password,
      };
      
      users.push(newUser);
      
      await githubService.updateFile(
        { users },
        sha,
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
