import { RView } from '@/components/ui/rview';
import { PairingSkeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { perfectPairingsStyles } from '@/styles/components/perfect-pairings.styles';
import { MenuItem } from '@/types/menu.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

interface PerfectPairingsProps {
  items: MenuItem[];
  isLoading: boolean;
}

export const PerfectPairings: React.FC<PerfectPairingsProps> = ({ items, isLoading }) => {
  const router = useRouter();

  const handleMenuClick = () => {
    router.push('/(tabs)/explorer');
  };

  return (
    <RView style={perfectPairingsStyles.section}>
      <RView style={perfectPairingsStyles.header}>
        <RView style={perfectPairingsStyles.title}>
          <Ionicons name="flame" size={20} color="#FF6B35" />
          <Text variant="subtitle" style={perfectPairingsStyles.titleText}>
            Perfect pairings for you
          </Text>
        </RView>
        <TouchableOpacity>
          <Ionicons name="chevron-up" size={20} color="#333" />
        </TouchableOpacity>
      </RView>

      {isLoading ? (
        <PairingSkeleton count={3} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={perfectPairingsStyles.scroll}
        >
          {items.map((item) => (
            <TouchableOpacity key={item.id} style={perfectPairingsStyles.card}>
              <Image
                source={{ uri: item.image }}
                style={perfectPairingsStyles.image}
                contentFit="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={perfectPairingsStyles.menuButton} onPress={handleMenuClick}>
            <Ionicons name="restaurant" size={24} color="#fff" />
            <Text variant="body" style={perfectPairingsStyles.menuButtonText}>
              Menu
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </RView>
  );
};
