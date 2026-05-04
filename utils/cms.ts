import { cmsService } from '@/services/cms.service';

/**
 * Utility function to get CMS text outside of React components
 * Use this in services, utilities, or anywhere you can't use hooks
 * 
 * @example
 * import { getCMSText } from '@/utils/cms';
 * 
 * const errorMessage = getCMSText('errors.auth.userNotFound');
 * const welcome = getCMSText('auth.biometricLock.welcomeBack', { name: user.name });
 */
export const getCMSText = (path: string, variables?: Record<string, string | number>): string => {
  return cmsService.getText(path, variables);
};

/**
 * Get entire section of CMS content
 */
export const getCMSSection = <T = any>(path: string): T | null => {
  return cmsService.getSection<T>(path);
};

/**
 * Initialize CMS with language
 */
export const initializeCMS = async (language: string = 'en'): Promise<void> => {
  await cmsService.initialize(language);
};
