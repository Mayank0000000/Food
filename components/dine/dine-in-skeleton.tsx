import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { StyleSheet } from 'react-native';

export const DineInSkeleton: React.FC = () => {
  return (
    <RView style={styles.container}>
      {/* Header Skeleton */}
      <RView style={styles.header}>
        <Skeleton width="60%" height={28} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="80%" height={16} borderRadius={4} />
      </RView>

      {/* Date & Time Selector Skeleton */}
      <Card style={styles.card}>
        <Skeleton width="50%" height={18} borderRadius={4} style={styles.marginBottom12} />
        <RView style={styles.row}>
          <RView style={styles.halfWidth}>
            <Skeleton width="100%" height={80} borderRadius={8} />
          </RView>
          <RView style={styles.halfWidth}>
            <Skeleton width="100%" height={80} borderRadius={8} />
          </RView>
        </RView>
      </Card>

      {/* Seat Selector Skeleton */}
      <Card style={styles.card}>
        <Skeleton width="40%" height={18} borderRadius={4} style={styles.marginBottom12} />
        
        {/* Legend */}
        <RView style={styles.legendRow}>
          <Skeleton width={60} height={12} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
          <Skeleton width={60} height={12} borderRadius={4} />
        </RView>

        {/* Seats Grid */}
        <RView style={styles.seatsGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton
              key={index}
              width="22%"
              height={80}
              borderRadius={12}
              style={styles.seatSkeleton}
            />
          ))}
        </RView>
      </Card>

      {/* Duration Selector Skeleton */}
      <Card style={styles.card}>
        <Skeleton width="45%" height={18} borderRadius={4} style={styles.marginBottom12} />
        <RView style={styles.row}>
          <Skeleton width="30%" height={44} borderRadius={8} style={styles.marginRight8} />
          <Skeleton width="30%" height={44} borderRadius={8} style={styles.marginRight8} />
          <Skeleton width="30%" height={44} borderRadius={8} />
        </RView>
      </Card>

      {/* Summary Skeleton */}
      <Card style={styles.card}>
        <Skeleton width="50%" height={18} borderRadius={4} style={styles.marginBottom12} />
        <Skeleton width="100%" height={16} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="100%" height={16} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="100%" height={16} borderRadius={4} style={styles.marginBottom8} />
        <Skeleton width="100%" height={20} borderRadius={4} />
      </Card>
    </RView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seatSkeleton: {
    marginBottom: 8,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  marginBottom12: {
    marginBottom: 12,
  },
  marginRight8: {
    marginRight: 8,
  },
});
