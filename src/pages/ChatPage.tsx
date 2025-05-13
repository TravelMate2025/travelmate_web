// src/pages/ChatPage.tsx
import { useEffect, useRef, useState } from "react";
import {
  createChat,
  fetchChat,
  fetchUserChats,
} from "../api/chat";
import AgentList from "../features/chat/AgentList";
import ChatInput from "../features/chat/ChatInput";
import Navbar from "./homePage/Navbar";
import ChatMessages from "../features/chat/ChatMessages";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { ChatWebSocket } from "../utils/websocket";
import ChatList from "./ChatList";

interface Message {
  id?: number;
  content: string;
  sender: string;
  timestamp: string;
  pending?: boolean;
  clientId?: string;
}

interface Chat {
  id: number;
  title: string;
  status: string;
  messages: Message[];
}

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const wsRef = useRef<ChatWebSocket | null>(null);

  if (!accessToken) return null;

  const initializeWebSocket = (chatId: number) => {
    if (!accessToken || !user) return;
  
    // If already connected to the same session, skip
    if (wsRef.current && wsRef.current.sessionId === chatId) {
      console.log("WebSocket already connected to this chat. Skipping reconnection.");
      return;
    }
  
    // Clean up old socket before making a new one
    wsRef.current?.close();
  
    const ws = new ChatWebSocket(chatId, accessToken);
  
    ws.onOpen(() => {
      console.log("WebSocket opened ✅");
      setWsConnected(true);
    });
  
    ws.onClose(() => {
      console.log("WebSocket closed ❌");
      setWsConnected(false);
    });
  
    ws.onMessage((msg: any) => {
      const normalizedMessage: Message = {
        id: msg.id,
        content: msg.message ?? msg.content,
        sender: msg.sender_id === user.id ? "user" : "admin",
        timestamp: msg.created_at ?? new Date().toISOString(),
        pending: false,
      };
    
      setActiveChat((prev) => {
        if (!prev) return prev;
    
        // Check for duplicate
        const exists = prev.messages.some(
          (m) =>
            m.id === normalizedMessage.id ||
            (m.pending &&
              m.content === normalizedMessage.content &&
              m.sender === "user")
        );
    
        if (exists) return prev;
    
        return {
          ...prev,
          messages: [...prev.messages, normalizedMessage],
        };
      });
    });
    
  
    ws.connect();
    wsRef.current = ws;
  };
  


  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchUserChats();
        setChats(data);
  
        if (data.length > 0) {
          const chat = await fetchChat(data[0].id);
  
          // ✅ Normalize messages from backend
          const normalizedMessages = chat.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.content ?? msg.message,
            sender: msg.sender === user?.id ? "user" : "admin",
            timestamp: msg.created_at ?? msg.timestamp,
            pending: false,
          }));
  
          setActiveChat({
            ...chat,
            messages: normalizedMessages,
          });
  
          initializeWebSocket(chat.id);
        }
  
      } catch (err: any) {
        setError(err.message || "Error fetching chats");
      } finally {
        setLoading(false);
      }
    };
  
    loadChats();
  
    return () => {
      wsRef.current?.close();
    };
  }, []);
  

  const handleSelectChat = async (chatId: number) => {
    try {
      const chat = await fetchChat(chatId);

      const normalizedMessages = chat.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content ?? msg.message,
        sender: msg.sender === user?.id ? "user" : "admin",
        timestamp: msg.created_at ?? msg.timestamp,
        pending: false,
      }));

      setActiveChat({ ...chat, messages: normalizedMessages });
      initializeWebSocket(chatId);
    } catch (err) {
      console.error("Error switching chat:", err);
    }
  };



  const handleSendMessage = async (message: string) => {
    if (!activeChat || !user || !wsRef.current || activeChat.status === "closed") return;

    const clientId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const pendingMsg: Message = {
      clientId,
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
      pending: true,
    };
    

    setActiveChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, pendingMsg] } : prev
    );

    wsRef.current.sendMessage(message, clientId);
  };

  const handleNewConversation = async (customTitle?: string) => {
    if (!user) return;

    try {
      setLoadingNewChat(true);
      setActiveChat(null);
      const newChat = await createChat(user.id, customTitle || "Let's Start a New Chat");
      const chatData = await fetchChat(newChat.id);
      setChats((prev) => [chatData, ...prev]);
      setActiveChat(chatData);
      initializeWebSocket(chatData.id);
    } catch (err) {
      console.error("Error starting new chat", err);
    } finally {
      setLoadingNewChat(false);
    }
  };

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
          Hello {user?.name?.split(" ")[0] || "User"}, We usually respond within 2 minutes.
        </p>
        <p className="text-gray-400 text-center mt-1 mb-4">
          Ask us anything or share your feedback with us.
        </p>

        <ChatList
          chats={chats}
          activeChatId={activeChat?.id ?? null}
          onSelectChat={handleSelectChat}
        />


        {loading ? (
          <div className="text-center mt-10 text-gray-500">Loading conversation...</div>
        ) : chats.length === 0 ? (
          <div className="text-center mt-10">
            <p>You have no conversations yet.</p>
            <button
              onClick={() => handleNewConversation()}
              className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loadingNewChat}
            >
              {loadingNewChat ? "Starting..." : "Start New Conversation"}
            </button>
          </div>
        ) : (
          <ChatMessages activeChat={activeChat} />
        )}
      </div>

      {!loading && activeChat && activeChat.status !== "closed" ? (
        <>
          {!wsConnected && (
            <p className="text-red-500 text-center text-sm mt-2">
              Connecting to server...
            </p>
          )}
          <ChatInput onSend={handleSendMessage} />
        </>
      ) : !loading && chats.length > 0 ? (
        <div className="text-center mt-4">
          <p>This conversation has been closed.</p>
          <button
            onClick={() => handleNewConversation()}
            className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loadingNewChat}
          >
            {loadingNewChat ? "Starting..." : "Start New Conversation"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ChatPage;
