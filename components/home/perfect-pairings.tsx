import { RView } from '@/components/ui/rview';
import { PairingSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { createPerfectPairingsStyles } from '@/styles/components/perfect-pairings.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

interface PerfectPairingsProps {
  items: MenuItem[];
  isLoading: boolean;
}

export const PerfectPairings: React.FC<PerfectPairingsProps> = ({ items, isLoading }) => {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createPerfectPairingsStyles(theme), [theme]);

  const handleMenuClick = () => {
    router.push('/(tabs)/explorer');
  };

  return (
    <RView style={styles.section}>
      <RView style={styles.header}>
        <RView style={styles.title}>
          <Ionicons name="flame" size={20} color={colors.primary} />
          <Text variant="subtitle" style={styles.titleText}>
            Perfect pairings for you
          </Text>
        </RView>
        <TouchableOpacity>
          <Ionicons name="chevron-up" size={20} color={colors.text} />
        </TouchableOpacity>
      </RView>

      {isLoading ? (
        <PairingSkeleton count={3} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {items.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuClick}>
            <Ionicons name="restaurant" size={24} color="#fff" />
            <Text variant="body" style={styles.menuButtonText}>
              Menu
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </RView>
  );
};
