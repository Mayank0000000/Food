import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveTheme } from '@/store/slices/themeSlice';
import { ThemeMode } from '@/types/theme.types';

export function useTheme() {
  const dispatch = useAppDispatch();
  const { mode, theme } = useAppSelector((state) => state.theme);

  const setTheme = (newMode: ThemeMode) => {
    dispatch(saveTheme(newMode));
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    dispatch(saveTheme(newMode));
  };

  return {
    mode,
    theme,
    colors: theme.colors,
    isDark: mode === 'dark',
    isLight: mode === 'light',
    setTheme,
    toggleTheme,
  };
}
