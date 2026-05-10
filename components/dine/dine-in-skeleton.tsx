import React from 'react';

import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Skeleton } from '@/components/ui/skeleton';
import { dineInSkeletonStyles as styles } from '@/styles/components/dine-in-skeleton.styles';

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
