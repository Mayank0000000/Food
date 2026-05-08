import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItemDetailModal } from '@/components/menu/menu-item-detail-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { bookmarkService } from '@/services/bookmark.service';
import { useAppSelector } from '@/store/hooks';
import { createBookmarksStyles } from '@/styles/screens/bookmarks.styles';
import { Bookmark } from '@/types/bookmark.types';
import { MenuItem } from '@/types/menu.types';
import { removeBookmark } from '@/utils/bookmark.utils';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Bookmarks() {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const styles = useMemo(() => createBookmarksStyles(theme), [theme]);
  const { user } = useAppSelector((state) => state.auth);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [user])
  );

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userBookmarks = await bookmarkService.getUserBookmarks(user.id.toString());
      setBookmarks(userBookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadBookmarks();
    setIsRefreshing(false);
  };

  const handleItemPress = (menuItem: MenuItem) => {
    setSelectedItem(menuItem);
    setShowDetailModal(true);
  };

  const handleModalClose = () => {
    setShowDetailModal(false);
    // Reload bookmarks in case user removed bookmark from modal
    loadBookmarks();
  };

  const handleRemovePress = async (bookmark: Bookmark) => {
    if (!user) return;

    try {
      await removeBookmark(user.id.toString(), bookmark.menuItemId);
      // Reload bookmarks to reflect the change
      await loadBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('bookmarks.title')} showBackButton />
        <RView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </RView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('bookmarks.title')} showBackButton />
      
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item.menuItem}
            onPress={() => handleItemPress(item.menuItem)}
            onRemove={() => handleRemovePress(item)}
            showRemoveButton={true}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          bookmarks.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            iconSize={80}
            iconColor={colors.textTertiary}
            title={t('bookmarks.noBookmarks')}
            subtitle={t('bookmarks.noBookmarksSubtitle')}
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

      <MenuItemDetailModal
        visible={showDetailModal}
        item={selectedItem}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}
