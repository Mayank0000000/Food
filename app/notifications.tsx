import { EmptyState } from '@/components/ui/empty-state';
import { RView } from '@/components/ui/rview';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { notificationHistoryService } from '@/services/notification-history.service';
import { useAppSelector } from '@/store/hooks';
import { createNotificationsStyles } from '@/styles/screens/notifications.styles';
import { NotificationHistory } from '@/types/notification-history.types';
import {
    cleanNotificationTitle,
    formatNotificationTime,
    getNotificationHistoryIcon,
    getNotificationHistoryIconColor,
} from '@/utils/notificationUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  const { t } = useCMS();
  const { theme, colors } = useTheme();
  const notificationsStyles = useMemo(() => createNotificationsStyles(theme), [theme]);
  const { user } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userNotifications = await notificationHistoryService.getUserNotifications(
        user.id.toString()
      );
      
      // Clean up corrupted emoji titles using utility function
      const cleanedNotifications = userNotifications.map(notification => ({
        ...notification,
        title: cleanNotificationTitle(notification.title, notification.type),
      }));
      
      setNotifications(cleanedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const handleNotificationPress = async (notification: NotificationHistory) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await notificationHistoryService.markAsRead(notification.id);
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationHistory }) => {
    return (
      <TouchableOpacity
        style={[
          notificationsStyles.notificationItem,
          !item.isRead && notificationsStyles.unreadItem,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <RView style={notificationsStyles.iconContainer}>
          <RView
            style={[
              notificationsStyles.iconCircle,
              { backgroundColor: `${getNotificationHistoryIconColor(item.type)}15` },
            ]}
          >
            <Ionicons
              name={getNotificationHistoryIcon(item.type) as any}
              size={24}
              color={getNotificationHistoryIconColor(item.type)}
            />
          </RView>
        </RView>

        <RView style={notificationsStyles.contentContainer}>
          <RView style={notificationsStyles.headerRow}>
            <Text
              variant="body"
              style={[
                notificationsStyles.title,
                !item.isRead && notificationsStyles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.isRead && <RView style={notificationsStyles.unreadDot} />}
          </RView>

          <Text
            variant="caption"
            style={notificationsStyles.body}
            numberOfLines={2}
          >
            {item.body}
          </Text>

          <Text variant="caption" style={notificationsStyles.time}>
            {formatNotificationTime(item.createdAt)}
          </Text>
        </RView>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={notificationsStyles.container}>
        <ScreenHeader title={t('notifications.title')} />
        <RView style={notificationsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="body" style={notificationsStyles.loadingText}>
            {t('common.loading')}
          </Text>
        </RView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={notificationsStyles.container}>
      <ScreenHeader title={t('notifications.title')} />

      {notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title={t('notifications.emptyTitle')}
          subtitle={t('notifications.emptySubtitle')}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={notificationsStyles.listContent}
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
