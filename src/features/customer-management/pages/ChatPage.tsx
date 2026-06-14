import { useEffect, useRef, useState, useCallback } from "react";
import { format } from "date-fns";
// import { Howl } from 'howler';

import {
  createChat,
  fetchChat,
  fetchUserChats,
} from "../api/chat";
import AgentList from "../components/chat/AgentList";
import ChatInput from "../components/chat/ChatInput";
import Navbar from "../../../pages/homePage/Navbar";
import ChatMessages from "../components/chat/ChatMessages";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";
import { ChatWebSocket } from "../utils/websocket";
import { Chat, Message, SenderInfo } from "../types/chat";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from '../../../components/Breadcrumbs';
import ChatHistory from "../components/ChatHistory"
import InlineChatDisplay from "../components/chat/InlineChatDisplay";




const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Chat with us" },
];

// const notificationSound = new Howl({
//   src: ['/sounds/mixkit-bell-notification-933.wav'],
//   volume: 0.5,
// });

function toErrorString(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history">(
    localStorage.getItem("activeChatTab") as "active" | "history" | null || "active"
  );
  const navigate = useNavigate();
  const [localChats, setLocalChats] = useState(chats);
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const [isCurrentlyDesktop, setIsCurrentlyDesktop] = useState(window.innerWidth >= 768);

  // const [userHasInteracted, setUserHasInteracted] = useState(false);

  // useEffect(() => {
  //   if (notificationSoundRef.current) {
  //     notificationSoundRef.current.load();
  //   }
  // }, []);


  useEffect(() => {
    const handleInteraction = () => {
      // setUserHasInteracted(true);
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, []);


  
  // const [hasNewNotification, setHasNewNotification] = useState(false);
  // const [notificationMessage, setNotificationMessage] = useState("");

  // play notification sound
  // const playNotificationSound = useCallback(() => {
  //   if (userHasInteracted) {
  //     notificationSound.play();
  //   }
  // }, [userHasInteracted]);





  const refreshChats = async () => {
    try {
      const updatedChats = await fetchUserChats();
      setChats(updatedChats);
    }  catch (err) {
    console.error("Failed to refresh chats", toErrorString(err));
    }
  };

  useEffect(() => {
    refreshChats();
  }, []);


    const normalizeMessage = (msg: unknown, currentUserId: number, currentUserEmail: string | undefined): Message => {
    const m = msg as Record<string, unknown>;
    const textForFilename = (m.content as string) ?? (m.message as string) ?? "";
    const rawFileName = textForFilename.replace?.("Sent an attachment: ", "")?.trim?.() || "";
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
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      xls: "application/vnd.ms-excel",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      csv: "text/csv",
      txt: "text/plain",
    };


    const fileType = extension && mimeMap[extension] ? mimeMap[extension] : "application/octet-stream";

    // Determine if the sender is the current user using ID preference, then email fallback
    let isCurrentUserMessage = false;
    if (currentUserId && currentUserId !== 0) {
      isCurrentUserMessage = (m.sender_id === currentUserId || m.sender === currentUserId);
    } else if (currentUserEmail) {
      const senderInfo = m.sender_info as SenderInfo | undefined;
      isCurrentUserMessage = senderInfo?.email === currentUserEmail;
    }

    const senderInfo = m.sender_info as SenderInfo | undefined;

    return {
      id: (m.id as number) || 0,
      content: (m.content as string) ?? (m.message as string) ?? "",
      sender: isCurrentUserMessage ? "user" : "admin",
      timestamp: (m.created_at as string) ?? (m.timestamp as string) ?? new Date().toISOString(),
      pending: false,
      sender_info: senderInfo,
      first_name: senderInfo?.first_name || "Admin",
      file_url: (m.attachment_url as string) || (m.attachment as string) || undefined,
      file_name: rawFileName || "attachment",
      file_type: fileType,
    };
  };



  // Note: do not early-return here; hooks must be called in the same order.

  const initializeWebSocket = useCallback(
    (chatId: number) => {
      if (!accessToken || !user) return;
      // avoid reconnecting to same chat
      if (wsRef.current?.sessionId === chatId) return;
      wsRef.current?.close?.();

      const ws = new ChatWebSocket(chatId, accessToken);
      ws.onOpen(() => setWsConnected(true));
      ws.onClose(() => setWsConnected(false));
      ws.onMessage((raw: unknown) => {
        try {
          const msg = raw && typeof raw === 'string' ? JSON.parse(raw as string) : raw;
          const payload = msg as Record<string, unknown>;

          if (payload?.type === 'session_update' && payload?.status === 'CLOSED') {
            setActiveChat((prev) => {
              if (prev) {
                return { ...prev, status: 'CLOSED', systemMessageText: 'Your chat has been closed by an admin.' };
              }
              return prev;
            });
            return;
          }

          if (payload?.type === 'error') {
            const errorMessage = payload.message as string | undefined;
            if (
              errorMessage === 'This chat has been automatically closed due to inactivity.' ||
              errorMessage === 'This chat is closed. No further messages can be sent.'
            ) {
              setActiveChat((prev) => {
                if (prev) {
                  return { ...prev, status: 'CLOSED', systemMessageText: errorMessage };
                }
                return prev;
              });
              return;
            }
          }

          const normalizedMessage = normalizeMessage(payload, user.id, user.email);
          setActiveChat((prev) => {
            if (!prev) return prev;
            const newMessages = [...prev.messages];
            const matchIdx = newMessages.findIndex((m) => m.pending && m.sender === 'user' && m.content === normalizedMessage.content);
            if (matchIdx !== -1) {
              newMessages[matchIdx] = { ...normalizedMessage, pending: false };
            } else {
              const exists = newMessages.some((m) => m.id === normalizedMessage.id);
              if (!exists) {
                newMessages.push(normalizedMessage);
              }
            }
            return { ...prev, messages: newMessages };
          });
        } catch (e) {
          console.warn('Failed to parse ws message', e);
        }
      });
      ws.connect();
      wsRef.current = ws;
    },
    [accessToken, user]
  );

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchUserChats();
        setChats(data);
        setLocalChats(data);

        if (data.length > 0) {
          const chat = await fetchChat(data[0].id);
          const normalizedMessages = user
            ? chat.messages.map((msg: unknown) => normalizeMessage(msg, user.id, user.email))
            : [];
          setActiveChat({ ...chat, messages: normalizedMessages });
          initializeWebSocket(chat.id);
        }
      } catch (err: unknown) {
        setError(toErrorString(err) || 'Error fetching chats');
      } finally {
        setLoading(false);
      }
    };

    loadChats();
    return () => wsRef.current?.close?.();
  }, [user, initializeWebSocket]);


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
        ? chat.messages.map((msg: unknown) => normalizeMessage(msg, user.id, user.email))
        : [];

      setActiveChat({ ...chat, messages: normalizedMessages });
      initializeWebSocket(chatId);
    } catch (err) {
      console.error("Error switching chat:", toErrorString(err));
    } finally {
      setLoading(false); 
    }
  };

  const handleSendMessage = (message: string, file?: File) => {
    if (!activeChat || !user || !wsRef.current || activeChat.status === "closed" || !wsConnected) {
      console.warn("Cannot send message: WebSocket not connected or chat closed.");
      return;
    }

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
  
  


  const handleDeleteChat = (chatId: number) => {
    // Remove from list
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));

    // Clear active chat and close WebSocket
    if (activeChat?.id === chatId) {
      setActiveChat(null);
      wsRef.current?.close(); 
    }
  };




  const handleNewConversation = async (customTitle?: string) => {
    if (!user) return;
    try {
      setLoadingNewChat(true);
      setActiveChat(null);

      // Generate a dynamic default title with the month in words and a nice format
      const fallbackTitle = `Conversation on ${format(new Date(), "d MMMM yyyy 'at' h:mm a")}`;
      
      const newChat = await createChat(user.id, (customTitle?.trim() || fallbackTitle));

      const chatData = await fetchChat(newChat.id);
      setChats((prev) => [chatData, ...prev]);
      setActiveChat(chatData);
      initializeWebSocket(chatData.id);
      setActiveTab("active");
    } catch (err) {
      console.error("Error starting new chat", toErrorString(err));
    } finally {
      setLoadingNewChat(false);
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      setIsCurrentlyDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeChatTab", activeTab);
  }, [activeTab]);


  const isDesktop = () => isCurrentlyDesktop;

  const handleTabChange = (tab: "active" | "history") => {
    setActiveTab(tab);
  };
  

  if (error) {
  return (
    <>
      <div className="my-10 md:mt-6" />
      <Navbar />

      <div className="hidden md:ml-[-40px] md:block">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="flex flex-col items-center justify-center mt-24 px-4">
        <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl max-w-md w-full p-6 shadow-sm text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">We couldn’t load your chat now. Please try again later.</p>
          <p className="text-sm text-red-500 mb-6 break-words">
            Error: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    </>
  );
}


  return (
    <div className="flex flex-col min-h-screen sm:max-w-[93%] mx-auto p-4">
      <Navbar/>

      

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
          onClick={() => handleTabChange("active")}
          className={`w-1/2 text-center py-2 ${
            activeTab === "active"
              ? "border-b-2 border-orange-500 font-semibold"
              : "text-gray-600"
          }`}
        >
          Active Chat
        </button>
        <button
          onClick={() => handleTabChange("history")}
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

            ) : !activeChat && chats.length === 0 ? (
              <div className="text-center mt-10">
                <p>You have no conversations yet.</p>
                <button
                  onClick={() => handleNewConversation()}
                  className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                  disabled={loadingNewChat}
                >
                  {loadingNewChat ? "Starting..." : "Start New Conversation"}
                </button>
              </div>
            ) : (
              // console.log("ChatPage - activeChat.messages:", activeChat?.messages),
              // console.log("ChatPage - Redux User email:", user?.email),
              <ChatMessages activeChat={activeChat} />
            )}

          {!loading && activeChat ? (
              activeChat.status !== "CLOSED" ? (
                <>
                  {!wsConnected && (
                    <p className="text-red-500 text-center text-sm mt-2">
                      Connecting to server...
                    </p>
                  )}
                  <ChatInput onSend={handleSendMessage} />
                </>
              ) : (
                <div className="text-center mt-4">
                  <p>This conversation has been closed.</p>
                  <button
                    onClick={() => handleNewConversation()}
                    className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
                    disabled={loadingNewChat}
                  >
                    {loadingNewChat ? "Starting..." : "Start New Conversation"}
                  </button>
                </div>
              )
            ) : !loading && chats.length > 0 && !activeChat ? (
              <div className="text-center mt-4">
                <p>Select a chat to view messages.</p>
                <button
                  onClick={() => handleNewConversation()}
                  className="mt-2 bg-[#023E8A] text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
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
                loading={loading}
                onDeleteChat={handleDeleteChat}
              />
            </div>
            {isDesktop() && activeChat ? (
              <div className="hidden md:block md:w-1/2 border border-gray-300 rounded-md ml-2">
                <div className="p-4">
                  <h2 className="font-semibold mb-2">
                    {activeChat.assigned_admin_info?.first_name?.trim() ||
                    activeChat.assigned_admin_info?.email?.split("@")[0] ||
                    "Chat with Agent"}
                  </h2>
                  <InlineChatDisplay activeChat={activeChat} />
                  {activeChat.status === "closed" && (
                    <p className="text-center mt-4 p-4 text-gray-500 bg-gray-100 border border-gray-500 rounded-md"
                    >This conversation has been closed.</p>
                  )}
                </div>
              </div>
            ) : isDesktop() && !activeChat ? (
              <div className="md:block md:w-1/2 border border-gray-300 rounded-md ml-2 p-4">
                <p className="text-gray-500 italic">Select a chat from history to view details.</p>
              </div>
            
            ) : null }
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
