import { RView } from '@/components/ui/rview';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  style 
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
};

interface PairingSkeletonProps {
  count?: number;
}

export const PairingSkeleton: React.FC<PairingSkeletonProps> = ({ count = 3 }) => {
  return (
    <RView style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          width={140}
          height={140}
          borderRadius={12}
          style={styles.card}
        />
      ))}
    </RView>
  );
};

export const MenuItemCardSkeleton: React.FC = () => {
  return (
    <RView style={styles.menuCard}>
      <Skeleton width={120} height={120} borderRadius={12} />
      <RView style={styles.menuCardContent}>
        <Skeleton width="80%" height={16} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="40%" height={12} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="60%" height={14} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="30%" height={18} borderRadius={4} />
      </RView>
    </RView>
  );
};

interface MenuListSkeletonProps {
  count?: number;
}

export const MenuListSkeleton: React.FC<MenuListSkeletonProps> = ({ count = 5 }) => {
  return (
    <RView style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemCardSkeleton key={index} />
      ))}
    </RView>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E0E0E0',
  },
  container: {
    flexDirection: 'row',
  },
  card: {
    marginRight: 12,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  menuCardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  marginBottom8: {
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
});
