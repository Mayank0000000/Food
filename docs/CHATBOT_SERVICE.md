# Chatbot Service Documentation

## Overview

The Chatbot Service is a hybrid AI-powered customer support system that combines local intent recognition with cloud-based AI (Groq API) to provide intelligent, context-aware responses for the FooD restaurant app.

## Architecture

### Hybrid Approach

The service uses a two-tier architecture:

1. **Local Intent Recognition** (Priority 1-2)
   - Pattern-based matching for common queries
   - Instant responses without API calls
   - Navigation actions and app control
   - Zero latency, works offline

2. **AI-Powered Responses** (Fallback)
   - Groq API with Llama 3.3 70B model
   - Context-aware responses using order history
   - Menu-aware recommendations
   - Natural language understanding

## Features

### 🎯 Local Intent Recognition

The service recognizes and handles the following intents locally:

#### Food Filters
- **Vegetarian Menu**: `"show me veg dishes"`, `"display vegetarian food"`
- **Non-Vegetarian Menu**: `"show non-veg items"`, `"show me non-vegetarian food"`

#### Order Management
- **Track Order**: `"track my order"`, `"where is my order"`
- **View Orders**: `"show my orders"`, `"order history"`

#### Table Booking
- **Book Table**: `"book a table"`, `"reserve table"`, `"make a reservation"`
- **View Bookings**: `"view my bookings"`, `"check reservations"`

#### Menu Browsing
- **Show Menu**: `"show menu"`, `"browse dishes"`, `"view food items"`
- **Offers**: `"show offers"`, `"any discounts"`, `"view deals"`

#### Information Queries
- **Delivery Time**: `"delivery time"`, `"how long"`, `"when will it arrive"`
- **Payment Methods**: `"payment options"`, `"how to pay"`
- **Restaurant Timings**: `"opening hours"`, `"when open"`

#### App Control
- **Theme Switching**: `"switch to dark mode"`, `"enable light theme"`

### 🤖 AI-Powered Features

#### Context-Aware Responses
- Uses user's last 3 orders for personalized recommendations
- Time-of-day awareness (morning/afternoon/evening)
- Suggests variety based on order history

#### Menu-Aware Intelligence
- Complete menu context provided to AI
- Only recommends items actually available
- Prevents hallucination of non-existent dishes
- Category-aware suggestions

#### Smart Menu Queries
Automatically detects and handles menu-specific queries:
- `"show me top rated non-veg dishes"`
- `"recommend something under 300"`
- `"show me biryani"`
- `"do you have pizza"`

#### Conversation History
- Maintains last 6 messages for context
- Enables multi-turn conversations
- Coherent follow-up responses

## API Integration

### Groq API Configuration

```typescript
API URL: https://api.groq.com/openai/v1/chat/completions
Model: llama-3.3-70b-versatile
Max Tokens: 150
Temperature: 0.7
```

### Environment Variables

```bash
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at: https://console.groq.com/keys

## Data Structures

### AIResponse

```typescript
interface AIResponse {
  message: string;                    // Bot's text response
  suggestions?: string[];             // Quick reply suggestions
  navigationAction?: NavigationAction; // App navigation
  menuItems?: string[];               // Menu item IDs to display as cards
  themeAction?: ThemeAction;          // Theme change action
}
```

### NavigationAction

```typescript
interface NavigationAction {
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
```

### LocalIntent

```typescript
interface LocalIntent {
  pattern: RegExp;                    // Regex pattern to match
  handler: (query: string) => LocalIntentResponse;
  priority: number;                   // Lower = higher priority
}
```

## Usage

### Basic Message Sending

```typescript
import { chatService } from '@/services/chat.service';

const response = await chatService.sendMessage(
  "show me veg dishes",
  userId,
  conversationHistory
);

// Response contains:
// - message: "Sure! I'll show you all our delicious vegetarian dishes..."
// - navigationAction: { type: 'explorer', params: { filters: { veg: true } } }
```

### With Conversation History

```typescript
const history = [
  { role: 'user', content: 'What do you recommend?' },
  { role: 'bot', content: 'Based on your orders, I suggest...' }
];

const response = await chatService.sendMessage(
  "Something spicy",
  userId,
  history
);
```

### Quick Replies

```typescript
const quickReplies = chatService.getQuickReplies();

// Returns:
// [
//   { id: '1', label: '📋 Show Menu', action: 'show menu', type: 'local' },
//   { id: '2', label: '🚚 Track Order', action: 'track my order', type: 'local' },
//   ...
// ]
```

## Intent Priority System

Intents are processed in priority order (lower number = higher priority):

- **Priority 1**: Critical actions (veg/non-veg filters, tracking, theme switching)
- **Priority 2**: General queries (menu browsing, offers, information)

If multiple patterns match, the highest priority intent is executed.

## Menu Query Detection

The service automatically detects menu-related queries using:

1. **Keyword Detection**: `recommend`, `suggest`, `top rated`, `best`, `popular`, `dish`, `food`
2. **Filter Detection**: `veg`, `non-veg`, `rated`, `under`, `price`
3. **Specific Item Search**: `"show me biryani"`, `"do you have pizza"`

### Menu Query Processing

```typescript
// Example: "show me top rated non-veg dishes under 500"

1. Fetch all menu items
2. Filter by non-veg
3. Fetch ratings for each item
4. Sort by average rating
5. Filter by price <= 500
6. Return top 6 items as cards
```

## Context Building

### User Context

```typescript
// Built from user's order history
User's last 3 orders: Biryani, Pizza, Burger | Pasta, Salad | Sandwich
Current time: evening (18:00)
Use this to make personalized recommendations.
```

### Menu Context

```typescript
// Complete menu provided to AI
=== RESTAURANT MENU (Complete List) ===

Biryani:
Chicken Biryani 🍖 (₹350), Veg Biryani 🌱 (₹280), ...

Pizza:
Margherita Pizza 🌱 (₹320), Pepperoni Pizza 🍖 (₹420), ...

⚠️ IMPORTANT: Only recommend items from this menu.
```

## Fallback Mechanism

If Groq API is unavailable or not configured:

```typescript
private getFallbackResponse(message: string): string {
  const responses = [
    "I'm here to help! Try 'show menu', 'track order', or 'book table'.",
    "I can help you navigate! Try 'show veg food' or 'view offers'.",
    ...
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
```

## Error Handling

### API Errors
- Logs error details to console
- Returns fallback response
- Graceful degradation to local intents

### Network Errors
- Catches fetch failures
- Provides helpful fallback messages
- Maintains app functionality

### Invalid Responses
- Validates AI response format
- Falls back to generic responses
- Prevents app crashes

## Performance Optimization

### Local Intent First
- Zero latency for common queries
- No API calls needed
- Works offline

### Menu Query Caching
- Menu items fetched once per query
- Ratings cached during processing
- Efficient filtering and sorting

### Conversation History Limit
- Only last 6 messages sent to AI
- Reduces token usage
- Maintains context relevance

### Response Length Limit
- Max 150 tokens per response
- Keeps responses concise
- Reduces API costs

## Integration with App

### Navigation Actions

```typescript
// In chat screen component
if (response.navigationAction) {
  switch (response.navigationAction.type) {
    case 'explorer':
      router.push({
        pathname: '/(tabs)/explorer',
        params: response.navigationAction.params
      });
      break;
    case 'orders':
      router.push('/my-orders');
      break;
    // ... other cases
  }
}
```

### Menu Item Cards

```typescript
// Display menu items as interactive cards
if (response.menuItems && response.menuItems.length > 0) {
  return (
    <View>
      {response.menuItems.map(itemId => (
        <MenuItemCard key={itemId} itemId={itemId} />
      ))}
    </View>
  );
}
```

### Theme Actions

```typescript
// Handle theme switching
if (response.themeAction) {
  dispatch(setTheme(response.themeAction.mode));
}
```

## Testing

### Test Local Intents

```typescript
// Test veg filter
await chatService.sendMessage("show me veg dishes");
// Expected: Navigation to explorer with veg filter

// Test order tracking
await chatService.sendMessage("track my order");
// Expected: Navigation to orders screen
```

### Test AI Responses

```typescript
// Test menu recommendations
await chatService.sendMessage(
  "recommend top rated non-veg dishes",
  userId
);
// Expected: Menu items with ratings

// Test context awareness
await chatService.sendMessage(
  "something different from last time",
  userId,
  history
);
// Expected: Personalized recommendation
```

### Test Fallback

```typescript
// Test without API key
process.env.EXPO_PUBLIC_GROQ_API_KEY = '';
await chatService.sendMessage("hello");
// Expected: Fallback response with quick commands
```

## Best Practices

### 1. Always Provide User ID
```typescript
// ✅ Good
await chatService.sendMessage(message, userId, history);

// ❌ Bad
await chatService.sendMessage(message);
```

### 2. Maintain Conversation History
```typescript
// ✅ Good - maintains context
const [history, setHistory] = useState([]);
const response = await chatService.sendMessage(msg, userId, history);
setHistory([...history, { role: 'user', content: msg }, { role: 'bot', content: response.message }]);

// ❌ Bad - no context
await chatService.sendMessage(msg, userId);
```

### 3. Handle All Response Types
```typescript
// ✅ Good - handles all actions
if (response.navigationAction) { /* navigate */ }
if (response.menuItems) { /* show cards */ }
if (response.themeAction) { /* change theme */ }

// ❌ Bad - only shows message
console.log(response.message);
```

### 4. Error Handling
```typescript
// ✅ Good
try {
  const response = await chatService.sendMessage(msg, userId);
  // handle response
} catch (error) {
  showError("Failed to send message. Please try again.");
}

// ❌ Bad - no error handling
const response = await chatService.sendMessage(msg, userId);
```

## Extending the Service

### Adding New Local Intents

```typescript
// Add to localIntents array
{
  pattern: /cancel\s+(my\s+)?order/i,
  handler: () => ({
    message: "To cancel your order, please go to My Orders and select the order you want to cancel.",
    navigationAction: {
      type: 'orders',
    },
  }),
  priority: 1,
}
```

### Adding New Navigation Types

```typescript
// 1. Update NavigationAction type
type: 'explorer' | 'orders' | 'bookings' | 'dine-in' | 'order-tracking' | 'profile';

// 2. Handle in app
case 'profile':
  router.push('/edit-profile');
  break;
```

### Customizing AI Behavior

```typescript
// Modify system prompt in sendToGroq()
const systemPrompt = `You are a helpful assistant for a restaurant app.
Your role is to:
- Answer questions about menu and services
- Be friendly and concise
- Keep responses under 100 words
- [Add your custom instructions here]
${context ? `\nContext: ${context}` : ''}`;
```

## Troubleshooting

### Issue: AI not responding
**Solution**: Check if `EXPO_PUBLIC_GROQ_API_KEY` is set in `.env`

### Issue: Wrong menu items recommended
**Solution**: Verify menu context is being built correctly in `buildMenuContext()`

### Issue: Navigation not working
**Solution**: Ensure navigation action type matches app routes

### Issue: Slow responses
**Solution**: 
- Check network connection
- Verify Groq API status
- Consider reducing conversation history length

### Issue: Context not working
**Solution**: Ensure user ID is passed and order service is accessible

## API Costs

### Groq API (Recommended)
- **Free Tier**: 14,400 requests/day
- **Model**: Llama 3.3 70B Versatile
- **Speed**: ~100 tokens/second
- **Cost**: FREE (no credit card required)

### Token Usage per Request
- System prompt: ~100 tokens
- User context: ~200 tokens
- Conversation history: ~300 tokens (6 messages)
- User message: ~20 tokens
- Response: ~150 tokens
- **Total**: ~770 tokens per request

## Security Considerations

### API Key Protection
- Store in `.env` file (not committed to git)
- Use `EXPO_PUBLIC_` prefix for client-side access
- Never log API keys

### User Data Privacy
- Order history used only for context
- No personal data sent to AI
- Conversation history not persisted

### Input Validation
- Sanitize user input before sending to AI
- Limit message length
- Prevent injection attacks

## Future Enhancements

### Planned Features
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Order placement via chat
- [ ] Image recognition for food items
- [ ] Proactive notifications
- [ ] Chat history persistence
- [ ] Analytics and insights

### Potential Improvements
- [ ] Add more local intents
- [ ] Implement caching for AI responses
- [ ] Add typing indicators
- [ ] Support for rich media (images, videos)
- [ ] Integration with payment system
- [ ] Feedback mechanism for responses

## Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Llama 3.3 Model Card](https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct)


