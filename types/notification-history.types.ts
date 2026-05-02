
export interface NotificationHistory {
  id: string;
  userId: string;
  type: 'order' | 'booking' | 'promotion' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationHistoryCreate {
  userId: string;
  type: 'order' | 'booking' | 'promotion' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
}
