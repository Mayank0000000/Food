import { ENV } from '@/config/env';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

// Per-file write queue — ensures writes to the same file are serialized
const writeQueues = new Map<string, Promise<void>>();

function enqueueWrite(filePath: string, fn: () => Promise<void>): Promise<void> {
  const current = writeQueues.get(filePath) ?? Promise.resolve();
  const next = current.then(fn).catch(fn); // always advance the queue even on error
  writeQueues.set(filePath, next);
  return next;
}

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
    // Enqueue so concurrent writes to the same file run one at a time
    return enqueueWrite(filePath, () => this._doUpdate(filePath, content, message));
  }

  private async _doUpdate(filePath: string, content: any, message: string): Promise<void> {
    const MAX_RETRIES = 3;
    const url = `/repos/${ENV.GITHUB_REPO_OWNER}/${ENV.GITHUB_REPO_NAME}/contents/${filePath}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Always fetch the freshest SHA right before writing
        let sha: string | undefined;
        try {
          const currentFile = await apiClient.get(url);
          sha = currentFile.sha;
        } catch (err: any) {
          if (err.status !== 404) throw err;
        }

        const encodedContent = btoa(
          unescape(encodeURIComponent(JSON.stringify(content, null, 2)))
        );

        const body: any = { message, content: encodedContent };
        if (sha) body.sha = sha;

        await apiClient.put(url, body);
        return; // success
      } catch (error: any) {
        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ SHA conflict on ${filePath}, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          continue;
        }
        throw error;
      }
    }
  }

  // Legacy methods for backward compatibility
  async getUsers(): Promise<{ content: any; sha: string }> {
    const content = await this.getFile(API_ENDPOINTS.FILES.USERS);
    const response = await apiClient.get(API_ENDPOINTS.getFileUrl(API_ENDPOINTS.FILES.USERS));
    return { content, sha: response.sha || '' };
  }

  async updateUsers(content: any, sha: string, message: string): Promise<void> {
    return this.updateFile(API_ENDPOINTS.FILES.USERS, content, message);
  }
}

export const githubService = new GitHubService();
