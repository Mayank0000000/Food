import { RView } from '@/components/ui/rview';
import { searchInputStyles } from '@/styles/components/search-input.styles';
import { SearchInputProps } from '@/types/components/search-input.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  style,
  ...props
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <RView style={[searchInputStyles.container, style]}>
      <Ionicons name="search-outline" size={20} color="#999" />
      
      <TextInput
        style={searchInputStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...props}
      />
      
      {value.length > 0 && (
        <TouchableOpacity 
          style={searchInputStyles.iconButton}
          onPress={handleClear}
        >
          <Ionicons name="close-circle" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </RView>
  );
};
