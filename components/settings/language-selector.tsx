import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { createLanguageSelectorStyles } from '@/styles/components/language-selector.styles';
import { saveLanguage } from '@/utils/language-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  visible,
  onClose,
  onLanguageChange,
}) => {
  const { getLanguage, setLanguage, getAvailableLanguages, isLoading } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createLanguageSelectorStyles(theme), [theme]);
  const [selectedLanguage, setSelectedLanguage] = useState(getLanguage());
  const languages = getAvailableLanguages();

  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    try {
      await setLanguage(languageCode);
      await saveLanguage(languageCode); // Save to AsyncStorage
      onLanguageChange?.(languageCode);
      onClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <RView style={styles.header}>
            <Text style={styles.title}>Select Language</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </RView>

          <ScrollView style={styles.content}>
            {languages.map((language) => (
              <Pressable
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.languageItemSelected,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
                disabled={isLoading}
              >
                <RView style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>{language.nativeName}</Text>
                </RView>
                {selectedLanguage === language.code && (
                  isLoading ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  )
                )}
              </Pressable>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
