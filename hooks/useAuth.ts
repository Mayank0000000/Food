import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export const useAuth = (redirectTo?: string) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        if (redirectTo) {
          router.replace(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [dispatch, router, redirectTo]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
  };
};