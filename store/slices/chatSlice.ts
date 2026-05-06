import { chatService } from '@/services/chat.service';
import { ChatMessage, ChatState } from '@/types/chat.types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
};

/**
 * Send message to chatbot (handles both AI and local intents)
 */
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, userId }: { message: string; userId?: string }, { rejectWithValue, getState }) => {
    try {
      // Get current messages from state for conversation history
      const state = getState() as { chat: ChatState };
      const conversationHistory = state.chat.messages
        .filter(msg => msg.role === 'user' || msg.role === 'bot') // Only user and bot messages
        .map(msg => ({
          role: msg.role as 'user' | 'bot',
          content: msg.content,
        }));

      const response = await chatService.sendMessage(message, userId, conversationHistory);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    loadMessagesFromStorage: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add bot response
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          role: 'bot',
          content: action.payload.message,
          timestamp: new Date().toISOString(),
          menuItems: action.payload.menuItems, // Include menu items if present
        };
        state.messages.push(botMessage);
        
        // Store navigation action if present (will be handled by the component)
        if (action.payload.navigationAction) {
          state.error = JSON.stringify(action.payload.navigationAction); // Temporary storage
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'bot',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        };
        state.messages.push(errorMessage);
      });
  },
});

export const {
  addMessage,
  clearMessages,
  setSessionId,
  clearError,
  loadMessagesFromStorage,
} = chatSlice.actions;

export default chatSlice.reducer;
