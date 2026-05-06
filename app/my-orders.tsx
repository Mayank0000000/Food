import { OrderItem } from '@/components/orders/order-item';
import { OrdersSkeleton } from '@/components/orders/orders-skeleton';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { orderService } from '@/services/order.service';
import { useAppSelector } from '@/store/hooks';
import { createMyOrdersStyles } from '@/styles/screens/my-orders.styles';
import { Order } from '@/types/order.types';
import {
  filterOrdersByQuery,
  getCompletedOrders,
  sortOrdersByDate,
} from '@/utils/orderUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyOrders() {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const myOrdersStyles = useMemo(() => createMyOrdersStyles(theme), [theme]);
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userOrders = await orderService.getUserOrders(user.id.toString());
      // Filter only delivered and cancelled orders, sorted by date (newest first)
      const completedOrders = sortOrdersByDate(getCompletedOrders(userOrders));
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert(t('orders.errorLoading'), t('orders.errorLoadingMessage'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setIsRefreshing(false);
  };

  const filterOrders = () => {
    setFilteredOrders(filterOrdersByQuery(orders, searchQuery));
  };

  const handleReorder = () => {
    Alert.alert(t('orders.reorder'), t('orders.reorderComingSoon'));
  };

  const handleMenuPress = () => {
    // Menu options functionality
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return <OrderItem order={item} onReorder={handleReorder} onMenuPress={handleMenuPress} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={myOrdersStyles.container}>
        <ScreenHeader title={t('orders.title')} />
        <OrdersSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={myOrdersStyles.container}>
      <ScreenHeader title={t('orders.title')} />

      {/* Search Bar */}
      <RView style={myOrdersStyles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
          style={myOrdersStyles.searchIcon}
        />
        <TextInput
          style={myOrdersStyles.searchInput}
          placeholder={t('orders.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <Button
            variant="outline"
            size="small"
            onPress={() => setSearchQuery('')}
            style={myOrdersStyles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Button>
        )}
      </RView>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={searchQuery ? t('explorer.noResults') : t('orders.emptyTitle')}
          subtitle={
            searchQuery
              ? t('explorer.noResultsSubtitle')
              : t('orders.emptySubtitle')
          }
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={myOrdersStyles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
