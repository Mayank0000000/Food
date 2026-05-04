import localCMS from '@/cms.json';
import { ENV } from '@/config/env';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

type CMSContent = typeof localCMS;

// Language code mapping
const LANGUAGE_FILE_MAP: Record<string, string> = {
  'en': API_ENDPOINTS.FILES.LANGUAGES.ENGLISH,
  'hi': API_ENDPOINTS.FILES.LANGUAGES.HINDI,
  'kn': API_ENDPOINTS.FILES.LANGUAGES.KANNADA,
  'te': API_ENDPOINTS.FILES.LANGUAGES.TELUGU,
};

// Language change listeners
type LanguageChangeListener = () => void;
const languageChangeListeners: Set<LanguageChangeListener> = new Set();


class CMSService {
  private content: CMSContent = localCMS;
  private language: string = 'en';
  private remoteContent: CMSContent | null = null;
  private isInitialized: boolean = false;


  subscribe(listener: LanguageChangeListener): () => void {
    languageChangeListeners.add(listener);
    return () => {
      languageChangeListeners.delete(listener);
    };
  }

  private notifyListeners() {
    languageChangeListeners.forEach(listener => listener());
  }


  async initialize(language: string = 'en') {
    if (this.isInitialized && this.language === language) {
      return;
    }

    this.language = language;
    
    // Try to fetch remote content for the specified language
    try {
      await this.fetchRemoteContent(language);
      this.isInitialized = true;
    } catch (error) {
      console.log('CMS: Using local fallback', error);
      this.isInitialized = true;
    }
  }

  /**
   * Fetch remote CMS content from GitHub
   */
  private async fetchRemoteContent(language: string): Promise<void> {
    const filePath = LANGUAGE_FILE_MAP[language];
    
    if (!filePath) {
      console.warn(`CMS: Language ${language} not supported, using local fallback`);
      return;
    }

    try {
      const url = `${ENV.GITHUB_API_BASE_URL}${API_ENDPOINTS.getFileUrl(filePath)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${ENV.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3.raw', // Get raw content directly
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch language file: ${response.status}`);
      }

      const content = await response.json();
      this.remoteContent = content as CMSContent;
      console.log(`CMS: Successfully loaded ${language} content from GitHub`);
    } catch (error) {
      console.error('CMS: Error fetching remote content:', error);
      throw error;
    }
  }

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
    if (this.language === language && this.remoteContent) {
      return; // Already loaded
    }

    this.language = language;
    await this.fetchRemoteContent(language);
    this.notifyListeners(); // Notify all components to re-render
  }

  /**
   * Get current language
   */
  getLanguage(): string {
    return this.language;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    ];
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
    this.notifyListeners();
  }

  /**
   * Clear remote content and use local fallback
   */
  clearRemoteContent() {
    this.remoteContent = null;
    this.notifyListeners();
  }
}

// Export singleton instance
export const cmsService = new CMSService();

// Export type for autocomplete support
export type { CMSContent };
