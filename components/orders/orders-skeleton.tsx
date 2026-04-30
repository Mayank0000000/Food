import { Card } from '@/components/ui/card';
import { RView } from '@/components/ui/rview';
import { Skeleton } from '@/components/ui/skeleton';
import { myOrdersStyles } from '@/styles/screens/my-orders.styles';
import React from 'react';

export const OrdersSkeleton: React.FC = () => {
  return (
    <RView style={myOrdersStyles.listContent}>
      {[1, 2, 3].map((index) => (
        <Card key={index} style={myOrdersStyles.orderCard}>
          {/* Restaurant/Order Header */}
          <RView style={myOrdersStyles.orderHeader}>
            <Skeleton width={60} height={60} borderRadius={8} />
            <RView style={myOrdersStyles.headerInfo}>
              <Skeleton width={150} height={18} style={{ marginBottom: 4 }} />
              <Skeleton width={100} height={14} style={{ marginBottom: 4 }} />
              <Skeleton width={80} height={14} />
            </RView>
            <Skeleton width={32} height={32} borderRadius={16} />
          </RView>

          {/* Order Items */}
          <RView style={myOrdersStyles.itemsSection}>
            <RView style={myOrdersStyles.itemRow}>
              <Skeleton width={12} height={12} borderRadius={2} style={{ marginRight: 8 }} />
              <Skeleton width={30} height={14} style={{ marginRight: 6, marginLeft: 2 }} />
              <Skeleton width={120} height={14} />
            </RView>
            <RView style={myOrdersStyles.itemRow}>
              <Skeleton width={12} height={12} borderRadius={2} style={{ marginRight: 8 }} />
              <Skeleton width={30} height={14} style={{ marginRight: 6, marginLeft: 2 }} />
              <Skeleton width={140} height={14} />
            </RView>
            <RView style={myOrdersStyles.itemRow}>
              <Skeleton width={12} height={12} borderRadius={2} style={{ marginRight: 8 }} />
              <Skeleton width={30} height={14} style={{ marginRight: 6, marginLeft: 2 }} />
              <Skeleton width={100} height={14} />
            </RView>
          </RView>

          {/* Order Details */}
          <RView style={myOrdersStyles.orderDetails}>
            <Skeleton width={180} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={16} />
          </RView>

          {/* Footer */}
          <RView style={myOrdersStyles.orderFooter}>
            <Skeleton width={80} height={24} />
            <RView style={myOrdersStyles.actionButtons}>
              <RView style={myOrdersStyles.ratingSection}>
                <Skeleton width={40} height={14} style={{ marginRight: 8 }} />
                <RView style={myOrdersStyles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton
                      key={star}
                      width={16}
                      height={16}
                      borderRadius={8}
                      style={{ marginLeft: 2 }}
                    />
                  ))}
                </RView>
              </RView>
              <Skeleton width={80} height={36} borderRadius={8} />
            </RView>
          </RView>
        </Card>
      ))}
    </RView>
  );
};
