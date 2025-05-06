import api from '../../src/api/services/api';

// Create Chat
export const createChat = async (userId: number, title: string) => {
  try {
    console.log("Creating chat for user:", userId, "with title:", title);
    const response = await api.post("/user/chats/", { user: userId, title });
    console.log("Chat created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating chat:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch Single Chat
export const fetchChat = async (chatId: number) => {
  try {
    console.log("Fetching chat with ID:", chatId);
    const response = await api.get(`/user/chats/${chatId}/`);
    console.log("Fetched chat data:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching chat:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch All User Chats
export const fetchUserChats = async () => {
  try {
    console.log("Fetching all user chats...");
    const response = await api.get("/user/chats/");
    console.log("Fetched user chats:", response.data.results);
    return response.data.results;
  } catch (error: any) {
    console.error("Error fetching user chats:", error.response?.data || error.message);
    throw error;
  }
};

// Mark Chat As Read
export const markChatAsRead = async (chatId: number) => {
  try {
    console.log("Marking chat as read:", chatId);
    const response = await api.post(`/user/chats/${chatId}/mark_as_read/`);
    console.log("Chat marked as read:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error marking chat as read:", error.response?.data || error.message);
    throw error;
  }
};

// Send Chat Message
export const sendChatMessage = async (chatId: number, text: string) => {
  try {
    console.log(`Sending message to chat ${chatId}:`, text);
    const response = await api.post(`/user/chats/${chatId}/messages/`, {
      content: text,
    });
    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending message:", error.response?.data || error.message);
    throw error;
  }
};
