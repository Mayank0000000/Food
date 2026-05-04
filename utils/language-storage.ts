import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@app_language';

/**
 * Save selected language to AsyncStorage
 */
export const saveLanguage = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

/**
 * Get saved language from AsyncStorage
 */
export const getLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (error) {
    console.error('Error getting language:', error);
    return null;
  }
};

/**
 * Remove saved language from AsyncStorage
 */
export const removeLanguage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LANGUAGE_KEY);
  } catch (error) {
    console.error('Error removing language:', error);
  }
};
