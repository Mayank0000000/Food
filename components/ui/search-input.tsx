import { RView } from '@/components/ui/rview';
import { useTheme } from '@/hooks/useTheme';
import { createSearchInputStyles } from '@/styles/components/search-input.styles';
import { SearchInputProps } from '@/types/components/search-input.types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, TextInput, TouchableOpacity, View } from 'react-native';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  placeholders,
  placeholderInterval = 3000,
  onClear,
  style,
  ...props
}) => {
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createSearchInputStyles(theme), [theme]);
  
  // Animation value for vertical position
  const translateY = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Use placeholders array if provided, otherwise use single placeholder
  const placeholderList = placeholders && placeholders.length > 0 ? placeholders : [placeholder];
  
  // Create a looped array: add first item at the end for seamless loop
  const loopedPlaceholders = placeholderList.length > 1 
    ? [...placeholderList, placeholderList[0]] 
    : placeholderList;

  useEffect(() => {
    // Only animate if we have multiple placeholders and input is empty
    if (placeholderList.length > 1 && !value) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
    };
  }, [placeholderList.length, value]);

  const startAnimation = () => {
    // Reset to start position
    translateY.setValue(0);

    // Create sequence of animations for each placeholder
    const animations = loopedPlaceholders.slice(0, -1).map((_, index) => {
      return Animated.sequence([
        // Wait at current position
        Animated.delay(placeholderInterval),
        // Slide to next position
        Animated.timing(translateY, {
          toValue: -(index + 1) * 24, // 24px is the height of each placeholder
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
    });

    // Create looped animation
    animationRef.current = Animated.loop(
      Animated.sequence([
        ...animations,
        // After reaching the end (which shows first item again), reset instantly
        Animated.timing(translateY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animationRef.current.start();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    translateY.setValue(0);
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <RView style={[styles.container, style]}>
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
      
      <RView style={styles.inputWrapper}>
        {/* Animated placeholder carousel - only show when input is empty */}
        {!value && placeholderList.length > 1 && (
          <View style={styles.placeholderContainer}>
            <Animated.View
              style={{
                transform: [{ translateY }],
              }}
            >
              {loopedPlaceholders.map((text, index) => (
                <View key={`${text}-${index}`} style={styles.placeholderItem}>
                  <Animated.Text
                    style={[
                      styles.animatedPlaceholder,
                      { color: colors.textTertiary },
                    ]}
                    numberOfLines={1}
                  >
                    {text}
                  </Animated.Text>
                </View>
              ))}
            </Animated.View>
          </View>
        )}
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholderList.length === 1 ? placeholderList[0] : ' '}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
      </RView>
      
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
