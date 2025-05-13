import React from "react";

interface Chat {
  id: number;
  title: string;
  status: string;
}

interface ChatListProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChatId, onSelectChat }) => {
  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2 text-lg">Your Conversations</h2>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-3 rounded cursor-pointer border ${
              chat.id === activeChatId ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
            }`}
          >
            <p className="font-medium">{chat.title}</p>
            <p className="text-xs text-gray-500">Status: {chat.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
