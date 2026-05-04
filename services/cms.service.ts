import localCMS from '@/cms.json';

type CMSContent = typeof localCMS;

/**
 * CMS Service
 * Manages content/text strings for the app with support for:
 * - Local fallback (cms.json)
 * - Remote CMS fetching (for different languages)
 * - Template string interpolation
 */
class CMSService {
  private content: CMSContent = localCMS;
  private language: string = 'en';
  private remoteContent: CMSContent | null = null;

  /**
   * Initialize CMS with optional language
   */
  async initialize(language: string = 'en') {
    this.language = language;
    
    // Try to fetch remote content for the specified language
    try {
      await this.fetchRemoteContent(language);
    } catch (error) {
      console.log('Using local CMS fallback');
    }
  }

  /**
   * Fetch remote CMS content from backend
   */
  private async fetchRemoteContent(language: string): Promise<void> {
    // TODO: Implement API call to fetch CMS content
    // Example:
    // const response = await fetch(`${API_BASE_URL}/cms/${language}`);
    // this.remoteContent = await response.json();
    
    // For now, we'll use local content as fallback
    this.remoteContent = null;
  }

  /**
   * Get text by path with optional template variables
   * @param path - Dot notation path (e.g., 'auth.login.title')
   * @param variables - Optional variables for template interpolation
   */
  getText(path: string, variables?: Record<string, string | number>): string {
    const content = this.remoteContent || this.content;
    const keys = path.split('.');
    
    let value: any = content;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`CMS: Path not found: ${path}`);
        return path; // Return path as fallback
      }
    }

    if (typeof value !== 'string') {
      console.warn(`CMS: Value at path ${path} is not a string`);
      return path;
    }

    // Interpolate variables if provided
    if (variables) {
      return this.interpolate(value, variables);
    }

    return value;
  }

  /**
   * Get entire section of content
   * @param path - Dot notation path to section
   */
  getSection<T = any>(path: string): T | null {
    const content = this.remoteContent || this.content;
    const keys = path.split('.');
    
    let value: any = content;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`CMS: Section not found: ${path}`);
        return null;
      }
    }

    return value as T;
  }

  /**
   * Interpolate template variables in a string
   * Supports {{variable}} syntax
   */
  private interpolate(template: string, variables: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return key in variables ? String(variables[key]) : match;
    });
  }

  /**
   * Set current language and reload content
   */
  async setLanguage(language: string) {
    this.language = language;
    await this.fetchRemoteContent(language);
  }

  /**
   * Get current language
   */
  getLanguage(): string {
    return this.language;
  }

  /**
   * Check if remote content is loaded
   */
  isRemoteContentLoaded(): boolean {
    return this.remoteContent !== null;
  }

  /**
   * Force reload from remote
   */
  async reload() {
    await this.fetchRemoteContent(this.language);
  }

  /**
   * Clear remote content and use local fallback
   */
  clearRemoteContent() {
    this.remoteContent = null;
  }
}

// Export singleton instance
export const cmsService = new CMSService();

// Export type for autocomplete support
export type { CMSContent };
