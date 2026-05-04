import { cmsService } from '@/services/cms.service';
import { useCallback, useEffect, useState } from 'react';

export const useCMS = () => {
  const [, forceUpdate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to language changes
  useEffect(() => {
    const unsubscribe = cmsService.subscribe(() => {
      forceUpdate(prev => prev + 1); // Force re-render when language changes
    });

    return unsubscribe;
  }, []);

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
    setIsLoading(true);
    try {
      await cmsService.setLanguage(language);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailableLanguages = useCallback(() => {
    return cmsService.getAvailableLanguages();
  }, []);

  const isRemoteLoaded = useCallback((): boolean => {
    return cmsService.isRemoteContentLoaded();
  }, []);

  return {
    t,
    getSection,
    getLanguage,
    setLanguage,
    getAvailableLanguages,
    isRemoteLoaded,
    isLoading,
  };
};
