import { cmsService } from '@/services/cms.service';
import { useCallback } from 'react';

export const useCMS = () => {

  const t = useCallback((path: string, variables?: Record<string, string | number>): string => {
    return cmsService.getText(path, variables);
  }, []);


  const getSection = useCallback(<T = any>(path: string): T | null => {
    return cmsService.getSection<T>(path);
  }, []);

  const getLanguage = useCallback((): string => {
    return cmsService.getLanguage();
  }, []);


  const setLanguage = useCallback(async (language: string): Promise<void> => {
    await cmsService.setLanguage(language);
  }, []);

  return {
    t,
    getSection,
    getLanguage,
    setLanguage,
  };
};
