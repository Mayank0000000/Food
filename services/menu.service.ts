import { ENV } from '@/config/env';
import { MenuItem } from '@/types/menu.types';

const GITHUB_API_BASE_URL = ENV.GITHUB_API_BASE_URL;
const GITHUB_TOKEN = ENV.GITHUB_TOKEN;
const REPO_OWNER = ENV.GITHUB_REPO_OWNER;
const REPO_NAME = ENV.GITHUB_REPO_NAME;
const FILE_PATH = ENV.MENU_FILE_PATH;

interface GitHubFileResponse {
  content: string;
  sha: string;
}

class MenuService {
  private apiUrl = `${GITHUB_API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  async getMenu(): Promise<MenuItem[]> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(GITHUB_TOKEN && { 'Authorization': `Bearer ${GITHUB_TOKEN}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu from GitHub');
      }

      const data: GitHubFileResponse = await response.json();
      
      const decodedContent = atob(data.content);
      const menuItems: MenuItem[] = JSON.parse(decodedContent);

      return menuItems;
    } catch (error) {
      console.error('Error fetching menu from GitHub:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
