import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

class GitHubService {
  async getFile(filePath: string): Promise<any> {
    try {
      return await apiClient.getGitHubFile(filePath);
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      throw error;
    }
  }

  async updateFile(filePath: string, content: any, message: string = 'Update file'): Promise<void> {
    try {
      await apiClient.updateGitHubFile(filePath, content, message);
    } catch (error) {
      console.error('Error updating GitHub file:', error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getUsers(): Promise<{ content: any; sha: string }> {
    const content = await this.getFile(API_ENDPOINTS.FILES.USERS);
    // For backward compatibility, we need to get the SHA separately
    const response = await apiClient.get(API_ENDPOINTS.getFileUrl(API_ENDPOINTS.FILES.USERS));
    
    return { content, sha: response.sha || '' };
  }

  async updateUsers(content: any, sha: string, message: string): Promise<void> {
    return this.updateFile(API_ENDPOINTS.FILES.USERS, content, message);
  }
}

export const githubService = new GitHubService();