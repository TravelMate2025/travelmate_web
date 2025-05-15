import React, { useRef, useState } from "react";
import { Chat } from "../types/chat";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
// import axios from "axios";


interface ChatHistoryProps {
  chats: Chat[];
  onSelectChat: (id: number) => void;
  onNewConversation: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chats, onSelectChat, onNewConversation }) => {
  const dragData = useRef<{ [key: string]: { startX: number; currentX: number } }>({});
  const [deletedChatIds, setDeletedChatIds] = useState<number[]>([]);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent, id: string | number) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragData.current[id] = { startX: clientX, currentX: clientX };
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent, id: string | number) => {
    if (!dragData.current[id]) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragData.current[id].currentX = clientX;

    const deltaX = clientX - dragData.current[id].startX;
    const el = document.getElementById(`chat-card-${id}`);
    if (el) {
      el.style.transform = `translateX(${Math.min(0, deltaX)}px)`;
    }
  };

  const handleDragEnd = (_e: React.TouchEvent | React.MouseEvent, id: number) => {
    if (!dragData.current[id]) return;
    const { startX, currentX } = dragData.current[id];
    const deltaX = currentX - startX;
  
    const el = document.getElementById(`chat-card-${id}`);
    if (el) {
      if (deltaX < -100) {
        // Temporarily remove from UI by adding to deletedChatIds state
        setDeletedChatIds((prev) => [...prev, id]);
        toast.success("Chat Deleted Successfully!");
        // Uncomment and replace with your actual delete API call when available:
        /*

        axios.delete(`/api/chats/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(() => {
            // Optionally confirm deletion success or refresh list
            toast.success("Chat Deleted Successfully!");
          })
          .catch(() => {
            // Optionally rollback deletion if needed
            toast.error("Failed to delete chat");
          });
        */

      } else {
        el.style.transition = "transform 0.3s ease";
        el.style.transform = "translateX(0)";
        setTimeout(() => {
          if (el) el.style.transition = "";
        }, 300);
      }
    }
  
    delete dragData.current[id];
  };
  

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="flex flex-col gap-4 flex-1 pt-4 overflow-auto">
        {chats
        .filter((chat) => !deletedChatIds.includes(chat.id))
        .map((chat) => {
          const preview = chat.last_message?.content
            ? chat.last_message.content.slice(0, 80)
            : "No message yet";

          const adminInitial =
            chat.admin_info?.first_name?.trim()
              ? chat.admin_info.first_name.trim().charAt(0).toUpperCase()
              : chat.admin_info?.email?.charAt(0).toUpperCase() || "?";

          return (
            <div key={chat.id} className="relative">
              <div className="absolute top-0 bottom-0 right-0 w-20 bg-red-600 flex items-center justify-center rounded-lg">
                <MdDeleteOutline className="h-10 w-10 text-white" />
              </div>

              <div
                id={`chat-card-${chat.id}`}
                onClick={() => onSelectChat(chat.id)}
                onMouseDown={(e) => handleDragStart(e, chat.id)}
                onTouchStart={(e) => handleDragStart(e, chat.id)}
                onMouseMove={(e) => handleDragMove(e, chat.id)}
                onTouchMove={(e) => handleDragMove(e, chat.id)}
                onMouseUp={(e) => handleDragEnd(e, chat.id)}
                onTouchEnd={(e) => handleDragEnd(e, chat.id)}
                onMouseLeave={(e) => handleDragEnd(e, chat.id)}
                className="cursor-pointer flex items-start p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition relative z-10"
                style={{ touchAction: "pan-y" }}
              >
                <div className="w-10 h-10 rounded-full bg-[#023E8A] text-white flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                  {adminInitial}
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold">{chat.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{preview}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t bg-white p-4 flex justify-center">
        <button
          onClick={onNewConversation}
          className="w-full max-w-[100%] md:max-w-[500px] bg-[#023E8A] text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;
