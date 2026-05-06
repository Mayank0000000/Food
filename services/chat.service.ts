import { ENV } from '@/config/env';
import { AIResponse, LocalIntent, LocalIntentResponse } from '@/types/chat.types';

/**
 * Local intent handlers for app-specific queries
 */
const localIntents: LocalIntent[] = [
  // VEG/NON-VEG FOOD FILTERS
  {
    pattern: /show\s+(me\s+)?(veg|vegetarian)\s+(dishes|items|food|menu|options)/i,
    handler: (query) => ({
      message: "Sure! I'll show you all our delicious vegetarian dishes. Taking you to the menu now...",
      navigationAction: {
        type: 'explorer',
        params: {
          filters: {
            veg: true,
            hasOffers: false,
            sortBy: 'relevance',
            minRating: null,
          },
        },
      },
    }),
    priority: 1,
  },
  {
    pattern: /show\s+(me\s+)?(non[\s-]?veg|non[\s-]?vegetarian|nonveg)\s+(dishes|items|food|menu|options)/i,
    handler: (query) => ({
      message: "Great choice! Here are all our non-vegetarian dishes. Redirecting you now...",
      navigationAction: {
        type: 'explorer',
        params: {
          filters: {
            veg: false,
            hasOffers: false,
            sortBy: 'relevance',
            minRating: null,
          },
        },
      },
    }),
    priority: 1,
  },
  {
    pattern: /(show|display|view)\s+(me\s+)?(all\s+)?(veg|vegetarian)/i,
    handler: (query) => ({
      message: "Opening vegetarian menu for you! 🌱",
      navigationAction: {
        type: 'explorer',
        params: {
          filters: {
            veg: true,
            hasOffers: false,
            sortBy: 'relevance',
            minRating: null,
          },
        },
      },
    }),
    priority: 1,
  },
  {
    pattern: /(show|display|view)\s+(me\s+)?(all\s+)?(non[\s-]?veg|non[\s-]?vegetarian|nonveg)/i,
    handler: (query) => ({
      message: "Opening non-vegetarian menu for you! 🍖",
      navigationAction: {
        type: 'explorer',
        params: {
          filters: {
            veg: false,
            hasOffers: false,
            sortBy: 'relevance',
            minRating: null,
          },
        },
      },
    }),
    priority: 1,
  },
  
  // TRACK ORDER
  {
    pattern: /track\s+(my\s+)?order/i,
    handler: () => ({
      message: "You can track your order from the Home screen or by going to 'My Orders' in the Account tab. Taking you to My Orders...",
      navigationAction: {
        type: 'orders',
      },
    }),
    priority: 1,
  },
  
  // VIEW ORDERS
  {
    pattern: /(show|view|see|check)\s+(my\s+)?(orders|order history)/i,
    handler: () => ({
      message: "Opening your order history now...",
      navigationAction: {
        type: 'orders',
      },
    }),
    priority: 1,
  },
  
  // BOOK TABLE / DINE-IN
  {
    pattern: /(book|reserve|make)\s+(a\s+)?(table|reservation|booking|dine)/i,
    handler: () => ({
      message: "Let me help you book a table! Opening the dine-in booking page...",
      navigationAction: {
        type: 'dine-in',
      },
    }),
    priority: 1,
  },
  
  // VIEW BOOKINGS
  {
    pattern: /(view|check|see|show)\s+(my\s+)?(bookings|reservations|tables)/i,
    handler: () => ({
      message: "Here are your table bookings...",
      navigationAction: {
        type: 'bookings',
      },
    }),
    priority: 1,
  },
  
  // SHOW MENU (GENERAL)
  {
    pattern: /(show|view|see|browse|display)\s+(the\s+)?(menu|dishes|food items)/i,
    handler: () => ({
      message: "Opening our full menu for you! You can browse all categories and filter by your preferences.",
      navigationAction: {
        type: 'explorer',
      },
    }),
    priority: 2,
  },
  
  // OFFERS/DISCOUNTS
  {
    pattern: /(show|view|check|any)\s+(me\s+)?(offers|discounts|coupons|deals|promotions)/i,
    handler: () => ({
      message: "Great! Let me show you dishes with special offers and discounts...",
      navigationAction: {
        type: 'explorer',
        params: {
          filters: {
            veg: null,
            hasOffers: true,
            sortBy: 'relevance',
            minRating: null,
          },
        },
      },
    }),
    priority: 2,
  },
  
  // DELIVERY TIME
  {
    pattern: /(delivery|delivery time|how long|when will|eta)/i,
    handler: () => ({
      message: "Our typical delivery time is 30-45 minutes. You can track your order in real-time from the Home screen once it's placed!",
    }),
    priority: 2,
  },
  
  // PAYMENT METHODS
  {
    pattern: /(payment|pay|payment methods|how to pay|payment options)/i,
    handler: () => ({
      message: "We accept both Cash on Delivery (COD) and Online Payment. You can choose your preferred payment method during checkout.",
    }),
    priority: 2,
  },
  
  // RESTAURANT TIMINGS
  {
    pattern: /(timings|hours|open|close|opening hours|when open)/i,
    handler: () => ({
      message: "We're open from 10:00 AM to 11:00 PM every day. You can place orders for delivery or dine-in during these hours.",
    }),
    priority: 2,
  },
];

class ChatService {
  private apiKey: string;
  private apiUrl: string;
  private provider: 'gemini' | 'groq' | 'none';

  constructor() {
    // Check which API key is available (prioritize Groq as it's more reliable)
    if (ENV.GROQ_API_KEY) {
      this.provider = 'groq';
      this.apiKey = ENV.GROQ_API_KEY;
      this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    } else if (ENV.GEMINI_API_KEY) {
      this.provider = 'gemini';
      this.apiKey = ENV.GEMINI_API_KEY;
      this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    } else {
      // No AI provider configured - will use local intents only
      this.provider = 'none';
      this.apiKey = '';
      this.apiUrl = '';
    }
  }

  /**
   * Check if query matches any local intent
   */
  private checkLocalIntent(query: string): LocalIntentResponse | null {
    // Sort by priority
    const sortedIntents = [...localIntents].sort((a, b) => a.priority - b.priority);

    for (const intent of sortedIntents) {
      if (intent.pattern.test(query)) {
        return intent.handler(query);
      }
    }

    return null;
  }

  /**
   * Send message to AI (Groq or Gemini)
   */
  private async sendToAI(message: string, context?: string, conversationHistory?: Array<{role: string, content: string}>): Promise<string> {
    if (this.provider === 'none' || !this.apiKey) {
      // Provide helpful fallback responses without AI
      return this.getFallbackResponse(message);
    }

    if (this.provider === 'groq') {
      return this.sendToGroq(message, context, conversationHistory);
    } else {
      return this.sendToGemini(message, context, conversationHistory);
    }
  }

  /**
   * Fallback responses when no AI is configured
   */
  private getFallbackResponse(message: string): string {
    const responses = [
      "I'm here to help! For the best experience, you can use quick commands like 'show menu', 'track order', or 'book table'.",
      "I can help you navigate the app! Try saying 'show veg food', 'view offers', or 'restaurant timings'.",
      "Looking for something specific? Try commands like 'show menu', 'track my order', or 'book a table'.",
      "I'm your restaurant assistant! Use commands like 'show offers', 'payment methods', or 'restaurant timings' for quick help.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Send to Groq API (Fast and Free!)
   */
  private async sendToGroq(message: string, context?: string, conversationHistory?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are a helpful customer support assistant for a restaurant mobile app. 
Your role is to:
- Answer questions about the restaurant, menu, and services
- Be friendly, concise, and helpful
- Keep responses under 100 words
- ONLY recommend or mention items that are in the provided menu list
- If asked about items NOT in the menu, clearly say "We don't have that item" or "That's not available"
- If asked about app features, guide users appropriately
${context ? `\nContext: ${context}` : ''}`;

    try {
      // Build messages array with conversation history
      const messages: any[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // Add conversation history (last 6 messages for context)
      if (conversationHistory && conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-6);
        messages.push(...recentHistory);
      }

      // Add current user message
      messages.push({
        role: 'user',
        content: message,
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Fast and free model
          messages,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Groq API Error:', data);
        return this.getFallbackResponse(message);
      }

      const aiMessage = data.choices?.[0]?.message?.content;

      if (!aiMessage) {
        console.error('Invalid Groq response format:', data);
        return this.getFallbackResponse(message);
      }

      return aiMessage.trim();
    } catch (error: any) {
      console.error('Groq API Error:', error.message);
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Send to Gemini API
   */
  private async sendToGemini(message: string, context?: string, conversationHistory?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are a helpful customer support assistant for a restaurant mobile app. 
Your role is to:
- Answer questions about the restaurant, menu, and services
- Be friendly, concise, and helpful
- Keep responses under 100 words
- ONLY recommend or mention items that are in the provided menu list
- If asked about items NOT in the menu, clearly say "We don't have that item" or "That's not available"
- If asked about app features, guide users appropriately
${context ? `\nContext: ${context}` : ''}`;

    try {
      // Build conversation text with history
      let conversationText = systemPrompt;
      
      // Add conversation history (last 6 messages)
      if (conversationHistory && conversationHistory.length > 0) {
        const recentHistory = conversationHistory.slice(-6);
        conversationText += '\n\n=== Previous Conversation ===\n';
        recentHistory.forEach(msg => {
          const label = msg.role === 'user' ? 'User' : 'Assistant';
          conversationText += `${label}: ${msg.content}\n`;
        });
        conversationText += '=== End Previous Conversation ===\n';
      }
      
      conversationText += `\n\nUser: ${message}`;

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: conversationText,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle quota exceeded error
        if (data.error?.code === 429) {
          console.log('Gemini quota exceeded, using fallback response');
          return this.getFallbackResponse(message);
        }
        
        // Handle other errors
        throw new Error(data.error?.message || 'Failed to get AI response');
      }

      const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiMessage) {
        throw new Error('Invalid AI response format');
      }

      return aiMessage.trim();
    } catch (error: any) {
      console.error('Gemini API Error:', error.message);
      // Return fallback response instead of throwing error
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Main method to send message (hybrid approach)
   */
  async sendMessage(
    message: string, 
    userId?: string, 
    conversationHistory?: Array<{role: 'user' | 'bot', content: string}>
  ): Promise<AIResponse> {
    try {
      // First, check if it's a local intent
      const localResponse = this.checkLocalIntent(message);

      if (localResponse) {
        return {
          message: localResponse.message,
          navigationAction: localResponse.navigationAction,
          menuItems: localResponse.menuItems,
        };
      }

      // Check if it's a menu query
      if (this.isMenuQuery(message)) {
        return await this.handleMenuQuery(message, userId);
      }

      // Build context with user's order history AND full menu
      let context = '';
      if (userId) {
        context = await this.buildUserContext(userId);
      }
      
      // Add full menu context
      const menuContext = await this.buildMenuContext();
      context = context ? `${context}\n\n${menuContext}` : menuContext;

      // Convert conversation history to AI format (user/assistant roles)
      const aiHistory = conversationHistory?.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // If no local intent matched, send to AI with context and history
      const aiResponse = await this.sendToAI(message, context, aiHistory);

      return {
        message: aiResponse,
      };
    } catch (error: any) {
      console.error('Chat service error:', error);
      throw new Error(error.message || 'Failed to process message');
    }
  }

  /**
   * Check if query is asking about menu items
   */
  private isMenuQuery(message: string): boolean {
    const menuKeywords = [
      'show me', 'recommend', 'suggest', 'top rated', 'best',
      'popular', 'dish', 'food', 'menu item',
      'under', 'cheap', 'expensive', 'price',
      'spicy', 'mild', 'sweet',
    ];
    
    const lowerMessage = message.toLowerCase();
    
    // Check if asking for specific item by name (e.g., "show me biryani", "do you have pizza")
    const specificItemPattern = /(show me|show|get me|i want|do you have|have)\s+([a-z\s]+)/i;
    const match = message.match(specificItemPattern);
    if (match) {
      const itemName = match[2].trim();
      // If it's a reasonable item name (2-20 chars), treat as menu query
      if (itemName.length >= 3 && itemName.length <= 30) {
        return true;
      }
    }
    
    // Must contain menu keyword AND (veg/non-veg OR rating OR price OR dish)
    const hasMenuKeyword = menuKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasFilter = lowerMessage.includes('veg') || 
                     lowerMessage.includes('rated') || 
                     lowerMessage.includes('popular') ||
                     lowerMessage.includes('under') ||
                     lowerMessage.includes('price') ||
                     lowerMessage.includes('dish');
    
    return hasMenuKeyword && hasFilter;
  }

  /**
   * Handle menu-specific queries by fetching actual menu items
   */
  private async handleMenuQuery(message: string, userId?: string): Promise<AIResponse> {
    try {
      // Import services dynamically
      const { menuService } = await import('./menu.service');
      const { reviewService } = await import('./review.service');
      
      // Get all menu items
      const allItems = await menuService.getMenu();
      
      const lowerMessage = message.toLowerCase();
      
      // Filter based on query
      let filtered = allItems;
      
      // Check if searching for specific item name (e.g., "show me biryani", "do you have pizza")
      const specificItemPattern = /(show me|show|get me|i want|do you have|have)\s+([a-z\s]+)/i;
      const match = message.match(specificItemPattern);
      
      if (match) {
        const searchTerm = match[2].trim().toLowerCase();
        
        // Search by item name or category
        const nameMatches = filtered.filter((item: any) => 
          item.name.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        );
        
        if (nameMatches.length > 0) {
          filtered = nameMatches;
          
          // If found items, return them as cards
          const itemType = nameMatches[0].category || searchTerm;
          let responseMessage = `Here ${nameMatches.length === 1 ? 'is' : 'are'} ${nameMatches.length} ${itemType} ${nameMatches.length === 1 ? 'item' : 'items'} for you:\n\n`;
          responseMessage += `Tap any dish below to see details and add to cart! 👇`;
          
          return {
            message: responseMessage,
            menuItems: nameMatches.slice(0, 6).map((item: any) => String(item.id)),
          };
        }
      }
      
      // Filter by veg/non-veg
      if (lowerMessage.includes('non-veg') || lowerMessage.includes('nonveg') || lowerMessage.includes('non veg')) {
        filtered = filtered.filter((item: any) => !item.veg);
      } else if (lowerMessage.includes('veg') && !lowerMessage.includes('non')) {
        filtered = filtered.filter((item: any) => item.veg);
      }
      
      // For "top rated" queries, fetch ratings and sort by them
      if (lowerMessage.includes('top rated') || lowerMessage.includes('best') || lowerMessage.includes('highest rated')) {
        // Fetch ratings for all filtered items
        const itemsWithRatings = await Promise.all(
          filtered.map(async (item: any) => {
            const stats = await reviewService.getMenuItemStats(item.id);
            return {
              ...item,
              averageRating: stats.averageRating,
              totalReviews: stats.totalReviews,
            };
          })
        );
        
        // Sort by average rating (descending), then by total reviews
        filtered = itemsWithRatings.sort((a: any, b: any) => {
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          return b.totalReviews - a.totalReviews;
        });
        
        // Filter out items with no reviews for "top rated" queries
        filtered = filtered.filter((item: any) => item.totalReviews > 0);
      }
      
      // Filter by price
      const priceMatch = lowerMessage.match(/under\s+(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        filtered = filtered.filter((item: any) => item.price <= maxPrice);
      }
      
      if (lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
        filtered = filtered.filter((item: any) => item.price <= 300);
      }
      
      if (lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
        filtered = filtered.filter((item: any) => item.price >= 400);
      }
      
      // Sort by price if not already sorted by rating
      if (!lowerMessage.includes('top rated') && !lowerMessage.includes('best') && !lowerMessage.includes('highest rated')) {
        filtered.sort((a: any, b: any) => b.price - a.price);
      }
      
      // Limit to top 6 items
      filtered = filtered.slice(0, 6);
      
      if (filtered.length === 0) {
        return {
          message: "Sorry, I couldn't find any dishes matching your criteria. Try browsing our full menu!",
          navigationAction: {
            type: 'explorer',
          },
        };
      }
      
      // Build response message
      const itemType = lowerMessage.includes('non-veg') || lowerMessage.includes('nonveg') ? 'non-vegetarian' : 
                      lowerMessage.includes('veg') ? 'vegetarian' : '';
      const ratingText = lowerMessage.includes('top rated') || lowerMessage.includes('best') ? 'top-rated ' : '';
      
      let responseMessage = `Here are ${filtered.length} ${ratingText}${itemType} dishes for you:\n\n`;
      responseMessage += `Tap any dish below to see details and add to cart! 👇`;
      
      // Return menu item IDs (convert to string)
      return {
        message: responseMessage,
        menuItems: filtered.map((item: any) => String(item.id)),
      };
      
    } catch (error) {
      console.error('Failed to handle menu query:', error);
      return {
        message: "I can help you find dishes! Try asking 'show me top rated non-veg dishes' or 'recommend something under 300'.",
      };
    }
  }

  /**
   * Build context from user's order history
   */
  private async buildUserContext(userId: string): Promise<string> {
    try {
      // Import order service dynamically to avoid circular dependencies
      const { orderService } = await import('./order.service');
      
      // Get user's orders
      const orders = await orderService.getUserOrders(userId);
      
      if (orders.length === 0) {
        return '';
      }

      // Sort by date (most recent first) and get last 3 orders
      const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      // Extract item names from recent orders
      const orderHistory = recentOrders.map(order => {
        const itemNames = order.items.map(item => item.name).join(', ');
        return itemNames;
      });

      // Get current time info
      const now = new Date();
      const hour = now.getHours();
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

      // Build context string
      const context = `
User's last 3 orders: ${orderHistory.join(' | ')}
Current time: ${timeOfDay} (${hour}:00)
Use this to make personalized recommendations. Suggest variety if they ordered the same thing recently.`;

      return context;
    } catch (error) {
      console.error('Failed to build user context:', error);
      return ''; // Return empty context if fails
    }
  }

  /**
   * Build menu context for AI (compressed list of available items)
   */
  private async buildMenuContext(): Promise<string> {
    try {
      // Import menu service dynamically
      const { menuService } = await import('./menu.service');
      
      // Get all menu items
      const allItems = await menuService.getMenu();
      
      if (allItems.length === 0) {
        return '';
      }

      // Group items by category
      const categories: { [key: string]: string[] } = {};
      
      allItems.forEach((item: any) => {
        const category = item.category || 'Other';
        if (!categories[category]) {
          categories[category] = [];
        }
        const vegLabel = item.veg ? '🌱' : '🍖';
        categories[category].push(`${item.name} ${vegLabel} (₹${item.price})`);
      });

      // Build compressed menu string
      let menuContext = '\n=== RESTAURANT MENU (Complete List) ===\n';
      
      Object.keys(categories).forEach(category => {
        menuContext += `\n${category}:\n`;
        menuContext += categories[category].join(', ') + '\n';
      });
      
      menuContext += '\n⚠️ IMPORTANT: Only recommend items from this menu. If asked about items not listed here, say we don\'t have them.';

      return menuContext;
    } catch (error) {
      console.error('Failed to build menu context:', error);
      return ''; // Return empty context if fails
    }
  }

  /**
   * Get suggested quick replies
   */
  getQuickReplies() {
    return [
      { id: '1', label: '📋 Show Menu', action: 'show menu', type: 'local' as const },
      { id: '2', label: '🚚 Track Order', action: 'track my order', type: 'local' as const },
      { id: '3', label: '🎫 View Offers', action: 'show offers', type: 'local' as const },
      { id: '4', label: '🍽️ Book Table', action: 'book a table', type: 'local' as const },
      { id: '5', label: '🌱 Show Veg', action: 'show veg food', type: 'local' as const },
      { id: '6', label: '🍖 Show Non-Veg', action: 'show non veg food', type: 'local' as const },
    ];
  }
}

export const chatService = new ChatService();
