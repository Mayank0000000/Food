export type MessageRole = 'user' | 'bot' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  isError?: boolean;
  menuItems?: string[]; // Array of menu item IDs to display as cards
}

export interface QuickReply {
  id: string;
  label: string;
  action: string;
  type: 'ai' | 'local'; // ai = send to AI, local = handle in app
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

export interface AIResponse {
  message: string;
  suggestions?: string[];
  navigationAction?: NavigationAction;
  menuItems?: string[]; // Menu item IDs to display
}

export interface NavigationAction {
  type: 'explorer' | 'orders' | 'bookings' | 'dine-in' | 'order-tracking';
  params?: {
    filters?: {
      veg?: boolean | null;
      hasOffers?: boolean;
      sortBy?: string;
      minRating?: number | null;
    };
    category?: string;
    searchQuery?: string;
    orderId?: string;
  };
}

export interface LocalIntent {
  pattern: RegExp;
  handler: (query: string) => LocalIntentResponse;
  priority: number;
}

export interface LocalIntentResponse {
  message: string;
  navigationAction?: NavigationAction;
  menuItems?: string[]; // Menu item IDs to display
}
