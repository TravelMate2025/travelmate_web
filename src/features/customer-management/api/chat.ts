import api from "../../../api/services/api";

// Create Chat
export const createChat = async (userId: number, title: string) => {
  try {

    const response = await api.post("/user/chats/", { user: userId, title });
    return response.data;
  } catch (error: unknown) {
    console.error("[API] Failed to create chat:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Fetch All User Chats
export const fetchUserChats = async () => {
  try {
    const response = await api.get("/user/chats/");
    return response.data.results;
  } catch (error: unknown) {
    console.error("[API] Failed to fetch chats:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Fetch a Single Chat
export const fetchChat = async (chatId: number) => {
  try {
    const response = await api.get(`/user/chats/${chatId}/`);
    return response.data;
  } catch (error: unknown) {
    console.error("[API] Failed to fetch chat:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};


// Send a Chat Message
export const sendChatMessage = async (chatId: number, text: string, senderId: number ) => {
  try {

    const payload = {
      session: chatId,      
      sender: senderId,      
      content: text,
    };

    const response = await api.post(`/chat/messages/`, payload);

    return response.data;
  } catch (error: unknown) {
    console.error("[API] Failed to send message:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};


// Mark Chat As Read
export const markChatAsRead = async (chatId: number) => {
  try {
    const response = await api.post(`/user/chats/${chatId}/mark_as_read/`, {});
    return response.data;
  } catch (error: unknown) {
    console.error("[API] Failed to mark chat as read:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};


export const deleteUserChat = async (id: number) => {
  try {
    await api.delete(`/user/chats/${id}/delete_session/`);
  } catch (error: unknown) {
    console.error("[API] Failed to delete chat:", error instanceof Error ? error.message : String(error));
    throw error;
  }
};
