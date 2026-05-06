import { RView } from '@/components/ui/rview';
import { useTheme } from '@/hooks/useTheme';
import { createSearchInputStyles } from '@/styles/components/search-input.styles';
import { SearchInputProps } from '@/types/components/search-input.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
  ...props
}) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createSearchInputStyles(theme), [theme]);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <RView style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      
      {value.length > 0 && (
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleClear}
        >
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </RView>
  );
};
