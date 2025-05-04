import { useEffect, useState} from "react";
import {
  createChat,
  fetchChat,
  fetchUserChats,
  sendChatMessage,
} from "../api/chat";
import AgentList from "../features/chat/AgentList";
import ChatInput from "../features/chat/ChatInput";
import Navbar from "./homePage/Navbar";
import ChatMessages from "../features/chat/ChatMessages";
import { RootState } from "../store";
import { useSelector } from "react-redux";


interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  pending?: boolean;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  messages: Message[];
}

const ChatPage = () => {
  const [, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
   
 
  if (!accessToken) return null;


  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchUserChats();
        setChats(data);
        if (data.length > 0) {
          const chat = await fetchChat(data[0].id);
          setActiveChat(chat);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching chats");
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!activeChat || !user) return;
    try {
      const sent = await sendChatMessage(activeChat.id, message, user.id);
      setActiveChat((prev) =>
        prev
          ? { ...prev, messages: [...prev.messages, sent] }
          : prev
      );
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleNewConversation = async (customTitle?: string) => {
    if (!user) {
      console.error("User is not logged in");
      return; // Handle the case where user is null (e.g., show an error or redirect)
    }
  
    try {
      setLoadingNewChat(true);
      setActiveChat(null);
      const userId = user.id;
      const title = customTitle || "Let's Start a New Chat"; // Fallback to default title
  
      const newChat = await createChat(userId, title);
      const chatData = await fetchChat(newChat.id);
      setChats((prev) => [chatData, ...prev]);
      setActiveChat(chatData);
    } catch (err) {
      console.error("Error starting new chat", err);
    } finally {
      setLoadingNewChat(false);
    }
  };
  

  // if (loading)
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <p>Loading chat...</p>
  //     </div>
  //   );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading chat: {error}</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen sm:max-w-[93%] mx-auto p-4">
      <Navbar />
      <div className="my-10"></div>
      <div className="text-left">
        <h1 className="text-xl font-bold mb-2 text-center sm:text-left">Chat with Us</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AgentList />
        <p className="text-gray-600 text-center">
          Hello Elvis, We usually respond within 2 minutes.
        </p>
        <p className="text-gray-400 text-center mt-1 mb-4">
          Ask us anything or share your feedback with us.
        </p>
        <ChatMessages activeChat={activeChat} />
      </div>
      {activeChat?.status === "CLOSED" ? (
        <div className="text-center mt-4">
          <p>This conversation has been closed.</p>
          <button
            onClick={() => handleNewConversation ()}
            className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loadingNewChat}
          >
            {loadingNewChat ? "Starting..." : "Start New Conversation"}
          </button>
        </div>
      ) : (
        <ChatInput onSend={handleSendMessage} />
      )}
    </div>
  );
};

export default ChatPage;
