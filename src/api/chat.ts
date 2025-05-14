import api from "../../src/api/services/api";

// Create Chat
export const createChat = async (userId: number, title: string) => {
  try {
    console.log(`[API] Creating chat for user ${userId}...`);
    const response = await api.post("/user/chats/", { user: userId, title });
    console.log("[API] Chat created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[API] Failed to create chat:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch All User Chats
export const fetchUserChats = async () => {
  try {
    console.log("[API] Fetching all user chats...");
    const response = await api.get("/user/chats/");
    console.log("[API] User chats fetched:", response.data.results);
    return response.data.results;
  } catch (error: any) {
    console.error("[API] Failed to fetch chats:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch a Single Chat
export const fetchChat = async (chatId: number) => {
  try {
    console.log(`[API] Fetching chat ID ${chatId}...`);
    const response = await api.get(`/user/chats/${chatId}/`);
    console.log("[API] Chat fetched:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[API] Failed to fetch chat:", error.response?.data || error.message);
    throw error;
  }
};


// Send a Chat Message
export const sendChatMessage = async (chatId: number, text: string, senderId: number ) => {
  try {
    console.log(`[API] Sending message to chat ${chatId}...`);

    const payload = {
      session: chatId,      
      sender: senderId,      
      content: text,
    };

    const response = await api.post(`/chat/messages/`, payload);

    console.log("[API] Message sent:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[API] Failed to send message:", error.response?.data || error.message);
    throw error;
  }
};


// Mark Chat As Read
export const markChatAsRead = async (chatId: number) => {
  try {
    console.log(`[API] Marking chat ${chatId} as read...`);
    const response = await api.post(`/user/chats/${chatId}/mark_as_read/`, {});
    console.log("[API] Chat marked as read:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[API] Failed to mark chat as read:", error.response?.data || error.message);
    throw error;
  }
};
