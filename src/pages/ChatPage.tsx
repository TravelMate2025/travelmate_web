import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
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
import { Chat } from "../types/chat";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from '../components/Breadcrumbs';
import ChatHistory from "../components/ChatHistory"
import InlineChatDisplay from "../features/chat/InlineChatDisplay";


export interface SenderInfo {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  profile_pics?: string;
}

interface Message {
  sender_info?: SenderInfo;
  id?: number;
  content: string;
  sender: string;
  timestamp: string;
  pending?: boolean;
  first_name?: string;
  file_url?: string; 
  file_name?: string;
  file_type: any;
}


const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Chat with us" },
];


const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const navigate = useNavigate();
  const [localChats, setLocalChats] = useState(chats);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const wsRef = useRef<ChatWebSocket | null>(null);


  const refreshChats = async () => {
    try {
      const updatedChats = await fetchUserChats();
      setChats(updatedChats);
    }  catch (err) {
    console.error("Failed to refresh chats", err);
    }
  };

  useEffect(() => {
    refreshChats();
  }, []);


    const normalizeMessage = (msg: any, currentUserId: number): Message => {
    const rawFileName = msg.content?.replace("Sent an attachment: ", "").trim() || "";
    const extension = rawFileName.split(".").pop()?.toLowerCase();

    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      doc: "application/msword",
    };

    const fileType = extension && mimeMap[extension] ? mimeMap[extension] : "application/octet-stream";

    return {
      id: msg.id,
      content: msg.content ?? msg.message ?? "",
      sender: msg.sender_id === currentUserId || msg.sender === currentUserId ? "user" : "admin",
      timestamp: msg.created_at ?? msg.timestamp ?? new Date().toISOString(),
      pending: false,
      sender_info: msg.sender_info || undefined,
      first_name: msg.sender_info?.first_name || "Admin",
      file_url: msg.file_url || msg.attachment || undefined,
      file_name: rawFileName || "attachment",
      file_type: fileType,
    };
  };



  if (!accessToken) return null;

  const initializeWebSocket = (chatId: number) => {
    if (!accessToken || !user) return;

    if (wsRef.current && wsRef.current.sessionId === chatId) return;

    wsRef.current?.close();
    const ws = new ChatWebSocket(chatId, accessToken);

    ws.onOpen(() => setWsConnected(true));
    ws.onClose(() => {
      setWsConnected(false);
      // When the WebSocket closes, update the activeChat status to 'closed'
      setActiveChat((prev) => {
        if (prev) {
          return { ...prev, status: "closed" };
        }
        return prev;
      });
    });
    ws.onMessage((msg: any) => {
      const normalizedMessage = normalizeMessage(msg, user.id);
      setActiveChat((prev) => {
        if (!prev) return prev;
        const newMessages = [...prev.messages];
        const matchIdx = newMessages.findIndex((m) => {
          const timeDiff = Math.abs(
            new Date(m.timestamp).getTime() -
            new Date(normalizedMessage.timestamp).getTime()
          );
        
          return (
            m.pending &&
            (m.content === normalizedMessage.content || (m.file_name && normalizedMessage.file_url)) &&
            timeDiff < 3000
          );
        });
        

        if (matchIdx !== -1) {
          newMessages[matchIdx] = normalizedMessage;
        } else {
          const exists = newMessages.some((m) => m.id === normalizedMessage.id);
          if (!exists) newMessages.push(normalizedMessage);
        }

        return {
          ...prev,
          messages: newMessages,
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
        setLocalChats(data); 

        if (data.length > 0) {
          const chat = await fetchChat(data[0].id);
          const normalizedMessages = user
            ? chat.messages.map((msg: any) => normalizeMessage(msg, user.id))
            : [];




          setActiveChat({ ...chat, messages: normalizedMessages });
          initializeWebSocket(chat.id);
        }
      } catch (err: any) {
        setError(err.message || "Error fetching chats");
      } finally {
        setLoading(false);
      }
    };
    

    loadChats();
    return () => wsRef.current?.close();
  }, [user]);


  useEffect(() => {
    setLocalChats(chats);
  }, [chats]);
  

  const handleSelectChat = async (chatId: number) => {
    try {
      setLoading(true);
      setActiveChat(null); 
      setActiveTab("active");

      const chat = await fetchChat(chatId);
      const normalizedMessages = user
        ? chat.messages.map((msg: any) => normalizeMessage(msg, user.id))
        : [];

      setActiveChat({ ...chat, messages: normalizedMessages });
      initializeWebSocket(chatId);
    } catch (err) {
      console.error("Error switching chat:", err);
    } finally {
      setLoading(false); 
    }
  };

  const handleSendMessage = (message: string, file?: File) => {
    if (!activeChat || !user || !wsRef.current || activeChat.status === "closed") return;
  
    const timestamp = new Date().toISOString();
  
    // Automatically generate a caption if none is provided with a file
    const autoCaption = file && (!message || message.trim() === "")
      ? `Sent an attachment: ${file.name}`
      : message;

    const pendingMsg: Message = {
      content: autoCaption,
      sender: "user",
      timestamp,
      pending: true,
      file_name: file?.name,
      file_type: file?.type,
      sender_info: undefined
    };
  
    setActiveChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, pendingMsg] } : prev
    );
  
    wsRef.current.sendMessage(autoCaption, file);

  };
  
  


  const handleNewConversation = async (customTitle?: string) => {
    if (!user) return;
    try {
      setLoadingNewChat(true);
      setActiveChat(null);

      // Generate a dynamic default title with the month in words and a nice format
      const fallbackTitle = `Conversation on ${format(new Date(), "d MMMM yyyy 'at' h:mm a")}`;
      
      const newChat = await createChat(user.id, customTitle || fallbackTitle);

      const chatData = await fetchChat(newChat.id);
      setChats((prev) => [chatData, ...prev]);
      setActiveChat(chatData);
      initializeWebSocket(chatData.id);
      setActiveTab("active");
    } catch (err) {
      console.error("Error starting new chat", err);
    } finally {
      setLoadingNewChat(false);
    }
  };



    const isDesktop = () => window.innerWidth >= 768;


  

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading chat: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen sm:max-w-[93%] mx-auto p-4">
      <Navbar />
      

      <div className="my-10 md:mt-6" />
      <div className='hidden md:ml-[-40px] md:block '>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="flex items-center md:hidden py-2 mb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md p-2"
        >
          <IoChevronBack size={24} />
        </button>
  
        <h1 className="text-2xl font-bold ml-16">Chat with Us</h1>
      </div>
      <h1 className="text-xl font-bold text-center hidden md:block sm:text-left mb-4">Chat with Us</h1>

      {/* Tab Buttons */}
      <div className="flex w-full mb-4 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("active")}
          className={`w-1/2 text-center py-2 ${
            activeTab === "active"
              ? "border-b-2 border-orange-500 font-semibold"
              : "text-gray-600"
          }`}
        >
          Active Chat
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`w-1/2 text-center py-2 ${
            activeTab === "history"
              ? "border-b-2 border-orange-500 font-semibold"
              : "text-gray-600"
          }`}
        >
          Chat History
        </button>
      </div>


      <div className="flex-1 overflow-y-auto">
        {activeTab === "active" ? (
          <>
            <AgentList activeChat={activeChat} />
            <p className="text-gray-600 text-center">
              Hello {user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "User"}, We usually respond within 2 minutes.
            </p>

            <p className="text-gray-400 text-center mt-1 mb-4">
              Ask us anything or share your feedback with us.
            </p>

            {loading ? (
              <div className="space-y-4 p-4">
                <div className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="animate-pulse flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>

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
          </>
        ) : (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <ChatHistory
                chats={localChats}
                onSelectChat={handleSelectChat}
                onNewConversation={() => handleNewConversation()}
                refreshChats={refreshChats}
              />
            </div>
            {isDesktop() && activeChat && activeChat.assigned_admin_info && (
              <div className="hidden md:block md:w-1/2 border border-gray-300 rounded-md ml-2">
                <div className="p-4">
                  <h2 className="font-semibold mb-2">
                  {activeChat.assigned_admin_info.first_name?.trim() ||
                   activeChat.assigned_admin_info.email?.split("@")[0] ||
                   "Chat with Agent"}
                </h2>
                  <InlineChatDisplay activeChat={activeChat} />
                  {activeChat.status === "closed" && (
                    <p className="text-center mt-4 text-gray-500">This chat is closed.</p>
                  )}
                </div>
              </div>
            )}
            {!isDesktop() && (
              <div className="w-full">
                {/* On mobile, ChatHistory takes the full width */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
