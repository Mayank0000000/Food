import { OrderItem } from '@/components/orders/order-item';
import { OrdersSkeleton } from '@/components/orders/orders-skeleton';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { orderService } from '@/services/order.service';
import { useAppSelector } from '@/store/hooks';
import { myOrdersStyles } from '@/styles/screens/my-orders.styles';
import { Order } from '@/types/order.types';
import {
  filterOrdersByQuery,
  getCompletedOrders,
  sortOrdersByDate,
} from '@/utils/orderUtils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyOrders() {
  const router = useRouter();
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
      Alert.alert('Error', 'Failed to load orders. Please try again.');
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

  const handleReorder = (order: Order) => {
    Alert.alert('Reorder', 'Reorder functionality coming soon!');
  };

  const handleMenuPress = (order: Order) => {
    // Menu options functionality
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return <OrderItem order={item} onReorder={handleReorder} onMenuPress={handleMenuPress} />;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={myOrdersStyles.container}>
        <ScreenHeader title="Your Orders" />
        <OrdersSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={myOrdersStyles.container}>
      <ScreenHeader title="Your Orders" />

      {/* Search Bar */}
      <RView style={myOrdersStyles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={myOrdersStyles.searchIcon}
        />
        <TextInput
          style={myOrdersStyles.searchInput}
          placeholder="Search by restaurant or dish"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <Button
            variant="outline"
            size="small"
            onPress={() => setSearchQuery('')}
            style={myOrdersStyles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </Button>
        )}
      </RView>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={searchQuery ? 'No orders found' : 'No orders yet'}
          subtitle={
            searchQuery
              ? 'Try searching with different keywords'
              : 'Your completed orders will appear here'
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
              colors={['#FF6B35']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
