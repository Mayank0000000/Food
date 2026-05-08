import { AddressCard } from '@/components/address/address-card';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { addressService } from '@/services/address.service';
import { useAppSelector } from '@/store/hooks';
import { createAddressesStyles } from '@/styles/screens/addresses.styles';
import { Address } from '@/types/address.types';
import { getAddressFromLocation } from '@/utils/address.utils';
import { requestLocationPermission } from '@/utils/locationUtils';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Addresses() {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createAddressesStyles(theme), [theme]);
  const { user } = useAppSelector((state) => state.auth);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [user])
  );

  const loadAddresses = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userAddresses = await addressService.getUserAddresses(user.id.toString());
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAddresses();
    setIsRefreshing(false);
  };

  const handleAddAddress = async () => {
    if (!user) return;

    try {
      setIsAddingAddress(true);

      // Request location permission
      const locationResult = await requestLocationPermission();

      if (!locationResult.granted || !locationResult.location) {
        console.log('Location permission denied');
        return;
      }

      const { latitude, longitude } = locationResult.location.coords;

      // Get address data from location
      const addressData = await getAddressFromLocation(latitude, longitude, addresses.length);

      await addressService.addAddress(user.id.toString(), addressData);
      await loadAddresses();
    } catch (error) {
      console.error('❌ Error adding address:', error);
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      await addressService.setDefaultAddress(addressId, user.id.toString());
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeletePress = (address: Address) => {
    setAddressToDelete(address);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!user || !addressToDelete) return;

    try {
      await addressService.deleteAddress(addressToDelete.id, user.id.toString());
      setShowDeleteAlert(false);
      setAddressToDelete(null);
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const renderAddressCard = ({ item }: { item: Address }) => (
    <AddressCard
      address={item}
      onDelete={handleDeletePress}
      onSetDefault={handleSetDefault}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('addresses.title')} showBackButton />
        <RView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </RView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('addresses.title')} showBackButton />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressCard}
        contentContainerStyle={[
          styles.listContent,
          addresses.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title={t('addresses.noAddresses')}
            subtitle={t('addresses.noAddressesSubtitle')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <RView style={styles.footer}>
        <Button
          title={t('addresses.addNewAddress')}
          onPress={handleAddAddress}
          loading={isAddingAddress}
          icon={<Ionicons name="add" size={20} color="#fff" />}
        />
      </RView>

      {/* Delete Confirmation Alert */}
      <Alert
        visible={showDeleteAlert}
        title={t('addresses.deleteAddress')}
        message={`${t('addresses.deleteAddressConfirm')} "${addressToDelete?.label}"?`}
        buttons={[
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              setShowDeleteAlert(false);
              setAddressToDelete(null);
            },
          },
          {
            text: t('common.delete'),
            style: 'destructive',
            onPress: handleConfirmDelete,
          },
        ]}
        onDismiss={() => {
          setShowDeleteAlert(false);
          setAddressToDelete(null);
        }}
      />
    </SafeAreaView>
  );
}
