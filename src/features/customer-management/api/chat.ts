import api from "../../../api/services/api";

// Create Chat
export const createChat = async (userId: number, title: string) => {
  try {
    console.log(`[API] Creating chat for user ${userId}...`);
    console.log("Sent payload:", { user: userId, title });

    const response = await api.post("/user/chats/", { user: userId, title });
    console.log("[API] Chat created:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("[API] Failed to create chat:", error instanceof Error ? error.message : String(error));
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
  } catch (error: unknown) {
    console.error("[API] Failed to fetch chats:", error instanceof Error ? error.message : String(error));
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
  } catch (error: unknown) {
    console.error("[API] Failed to fetch chat:", error instanceof Error ? error.message : String(error));
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
  } catch (error: unknown) {
    console.error("[API] Failed to send message:", error instanceof Error ? error.message : String(error));
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
  } catch (error: unknown) {
    console.error("[API] Failed to mark chat as read:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};


export const deleteUserChat = async (id: number) => {
  try {
    console.log(`[API] Deleting chat session with ID: ${id}`);
    await api.delete(`/user/chats/${id}/delete_session/`);
    console.log("[API] Chat session deleted successfully");
  } catch (error: unknown) {
    console.error("[API] Failed to delete chat:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};
