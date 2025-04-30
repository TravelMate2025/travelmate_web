import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/index"

import { createNewChat, getUserChats, getChat, clearActiveChat, sendMessage } from "../features/chat/chatSlice";
   
import AgentList from "../features/chat/AgentList";
import ChatMessages from "../features/chat/ChatMessages";
import ChatInput from "../features/chat/ChatInput";
import Navbar from "./homePage/Navbar";
// import Breadcrumbs from "../components/Breadcrumbs";

const ChatPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat, chats, loading, error } = useSelector((state: any) => state.chat);
  const [loadingNewChat, setLoadingNewChat] = useState(false);

  // const breadcrumbs = [
  //   { name: "Home", link: "/" },
  //   { name: "Chat With Us" },
  // ];

  useEffect(() => {
    dispatch(getUserChats());
  }, [dispatch]);

  useEffect(() => {
    if (chats.length > 0) {
      // Load the latest chat automatically
      dispatch(getChat(chats[0].id));
    }
  }, [chats, dispatch]);

  const handleSendMessage = async (message: string) => {
    if (activeChat) {
      dispatch(sendMessage({ chatId: activeChat.id, text: message }));
    }
  };

  const handleNewConversation = async () => {
    try {
      setLoadingNewChat(true);
      dispatch(clearActiveChat());

      const userId = 41; // Replace this with your dynamic logged-in user id later
      const title = "Let's Start a New Chat";
  
      const newChat = await dispatch(createNewChat({ userId, title })).unwrap();
      dispatch(getChat(newChat.id));
    } catch (error) {
      console.error("Error starting new chat", error);
    } finally {
      setLoadingNewChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading chat...</p>
      </div>
    );
  }

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
      <div className="my-10"></div>
      {/* <Breadcrumbs items={breadcrumbs} /> */}
  
    <div className="text-left">
        <h1 className="text-xl font-bold mb-2 text-center sm:text-left">Chat with Us</h1>
    </div>

    <div className="flex-1 overflow-y-auto">
        <AgentList />
        <p className="text-gray-600 text-center">Hello Elvis, We usually respond within 2 minutes.</p>
        <p className="text-gray-400 text-center mt-1 mb-4">Ask us anything or share your feedback with us.</p>

        <ChatMessages />
    </div>

    {activeChat?.status === "CLOSED" ? (
        <div className="text-center mt-4">
        <p>This conversation has been closed.</p>
        <button
            onClick={handleNewConversation}
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
