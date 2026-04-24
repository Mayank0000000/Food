import { ENV } from '@/config/env';

const GITHUB_API_BASE_URL = ENV.GITHUB_API_BASE_URL;
const GITHUB_TOKEN = ENV.GITHUB_TOKEN;
const REPO_OWNER = ENV.GITHUB_REPO_OWNER;
const REPO_NAME = ENV.GITHUB_REPO_NAME;
const FILE_PATH = ENV.USERS_FILE_PATH;

interface GitHubFileResponse {
  content: string;
  sha: string;
}

class GitHubService {
  private apiUrl = `${GITHUB_API_BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

  async getFile(): Promise<{ content: any; sha: string }> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(GITHUB_TOKEN && { 'Authorization': `Bearer ${GITHUB_TOKEN}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file from GitHub');
      }

      const data: GitHubFileResponse = await response.json();
      
      const decodedContent = atob(data.content);
      const jsonContent = JSON.parse(decodedContent);

      return {
        content: jsonContent,
        sha: data.sha,
      };
    } catch (error) {
      console.error('Error fetching from GitHub:', error);
      throw error;
    }
  }

  async updateFile(content: any, sha: string, message: string): Promise<void> {
    try {
      const encodedContent = btoa(JSON.stringify(content, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: encodedContent,
          sha,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update file on GitHub');
      }
    } catch (error) {
      console.error('Error updating GitHub file:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
