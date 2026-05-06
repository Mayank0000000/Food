import { RView } from '@/components/ui/rview';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, TouchableOpacity } from 'react-native';

export function ThemeToggle() {
  const { mode, colors, toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} activeOpacity={0.7}>
      <RView style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <RView style={styles.leftSection}>
          <RView style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons 
              name={isDark ? 'moon' : 'sunny'} 
              size={24} 
              color={colors.primary} 
            />
          </RView>
          <RView style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            </Text>
          </RView>
        </RView>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.disabled, true: colors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.disabled}
        />
      </RView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});
