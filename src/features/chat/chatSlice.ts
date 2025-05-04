// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createChat,
//   fetchChat,
//   fetchUserChats,
//   markChatAsRead,
//   sendChatMessage,
// } from "../../api/chat";
// import { v4 as uuidv4 } from "uuid";
// import { RootState } from "../../store"; // Ensure this points to your actual store definition

// interface Message {
//   id: number | string;
//   sender: string;
//   content: string;
//   timestamp: string;
//   image?: string;
//   pending: boolean;
// }

// interface Chat {
//   id: number;
//   title: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   messages: Message[];
//   assigned_admin: any;
//   admin_info: any;
// }

// interface ChatState {
//   chats: Chat[];
//   activeChat: Chat | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ChatState = {
//   chats: [],
//   activeChat: null,
//   loading: false,
//   error: null,
// };

// // Helper to extract and validate token
// const getAuthToken = (state: RootState): string => {
//   const token = state.auth.accessToken;
//   if (!token) throw new Error("Missing access token");
//   return token;
// };

// // Async actions
// export const createNewChat = createAsyncThunk<
//   any,
//   { userId: number; title: string },
//   { state: RootState }
// >("chat/createNewChat", async ({ userId, title }, { getState }) => {
//   const token = getAuthToken(getState());
//   return await createChat(userId, title, token);
// });

// export const getChat = createAsyncThunk<
//   Chat,
//   number,
//   { state: RootState }
// >("chat/getChat", async (chatId, { getState }) => {
//   const token = getAuthToken(getState());
//   return await fetchChat(chatId, token);
// });

// export const getUserChats = createAsyncThunk<
//   Chat[],
//   void,
//   { state: RootState }
// >("chat/getUserChats", async (_, { getState }) => {
//   const token = getAuthToken(getState());
//   return await fetchUserChats(token);
// });

// export const markAsRead = createAsyncThunk<
//   any,
//   number,
//   { state: RootState }
// >("chat/markAsRead", async (chatId, { getState }) => {
//   const token = getAuthToken(getState());
//   return await markChatAsRead(chatId, token);
// });

// export const sendMessage = createAsyncThunk<
//   void,
//   { chatId: number; text: string; senderId: string },
//   { state: RootState; dispatch: any }
// >("chat/sendMessage", async ({ chatId, text, senderId }, { dispatch, getState }) => {
//   const token = getAuthToken(getState());
//   console.log("Dispatching sendMessage thunk with:", { chatId, text, senderId });

//   const tempMessage = {
//     id: uuidv4(),
//     sender: senderId,
//     content: text,
//     timestamp: new Date().toISOString(),
//     pending: true,
//   };

//   dispatch(addTemporaryMessage({ chatId, message: tempMessage }));
//   await sendChatMessage(chatId, text, token);

//   const result = await dispatch(getChat(chatId));
//   const updatedChat = result.payload as Chat;

//   dispatch(updateSentMessage({ chatId, updatedChat }));
// });

// // Slice
// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     clearActiveChat: (state) => {
//       state.activeChat = null;
//     },
//     addTemporaryMessage: (state, action) => {
//       const { chatId, message } = action.payload;
//       if (state.activeChat && state.activeChat.id === chatId) {
//         state.activeChat.messages.push(message);
//       }
//     },
//     updateSentMessage: (state, action) => {
//       const { chatId, updatedChat } = action.payload;
//       if (state.activeChat && state.activeChat.id === chatId) {
//         state.activeChat.messages = updatedChat.messages.map((msg: Message) =>
//           msg.pending ? { ...msg, pending: false } : msg
//         );
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getChat.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getChat.fulfilled, (state, action) => {
//         state.loading = false;
//         state.activeChat = action.payload;
//       })
//       .addCase(getChat.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to load chat";
//       })
//       .addCase(getUserChats.fulfilled, (state, action) => {
//         state.chats = action.payload;
//       });
//   },
// });

// export const { clearActiveChat, addTemporaryMessage, updateSentMessage } = chatSlice.actions;
// export default chatSlice.reducer;
