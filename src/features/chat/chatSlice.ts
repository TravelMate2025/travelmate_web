import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createChat, fetchChat, fetchUserChats, markChatAsRead, sendChatMessage } from "../../api/chat";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  image?: string;
  pending: boolean;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
  assigned_admin: any;
  admin_info: any;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
};

// Async actions
export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async ({ userId, title }: { userId: number; title: string }) => {
    return await createChat(userId, title);
  }
);

export const getChat = createAsyncThunk(
  "chat/getChat",
  async (chatId: number) => {
    return await fetchChat(chatId);
  }
);

export const getUserChats = createAsyncThunk(
  "chat/getUserChats",
  async () => {
    return await fetchUserChats();
  }
);

export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (chatId: number) => {
    return await markChatAsRead(chatId);
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, text }: { chatId: number; text: string }, { dispatch }) => {
    const tempMessage = {
      id: uuidv4(), // temporary id
      sender: "user", // or your logged-in user id
      content: text,
      timestamp: new Date().toISOString(),
      pending: true, // custom field to mark it pending
    };

    // Optimistic update: add the temp message to the chat
    dispatch(addTemporaryMessage({ chatId, message: tempMessage }));

    // Send the actual message to the backend
    await sendChatMessage(chatId, text);

    // Fetch the updated chat after sending the message
    const updatedChat = await dispatch(getChat(chatId));

    // Dispatch the action to update the message (remove 'pending' status)
    dispatch(updateSentMessage({ chatId, updatedChat }));

    return null;
  }
);

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearActiveChat: (state) => {
      state.activeChat = null;
    },
    addTemporaryMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (state.activeChat && state.activeChat.id === chatId) {
        state.activeChat.messages.push(message);
      }
    },
    updateSentMessage: (state, action) => {
      const { chatId, updatedChat } = action.payload;
      if (state.activeChat && state.activeChat.id === chatId) {
        // Replace 'pending' messages with the actual ones
        state.activeChat.messages = updatedChat.messages.map((msg: Message) =>
          msg.pending ? { ...msg, pending: false } : msg
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.loading = false;
        state.activeChat = action.payload;
      })
      .addCase(getChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load chat";
      })
      .addCase(getUserChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      });
  },
});

export const { clearActiveChat, addTemporaryMessage, updateSentMessage } = chatSlice.actions;
export default chatSlice.reducer;
