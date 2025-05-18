import { useEffect, useRef } from "react";
import { Chat } from "../../types/chat";


const ChatMessages = ({ activeChat }: { activeChat: Chat | null }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  if (!activeChat) {
    console.log("no active chat");
    return null;
  }

  return (
    <div className="flex flex-col gap-2 py-2 mb-20">
      {activeChat.messages.map((msg, idx) => {
        const isUser = msg.sender === "user";
        const sender = isUser ? activeChat.user_info : activeChat.admin_info;
        
        const displayName =
          sender?.first_name?.trim() ||
          sender?.email?.split("@")[0] ||
          (isUser ? "User" : "Admin");
        
        const adminInitial = sender?.first_name?.charAt(0).toUpperCase() || sender?.email?.charAt(0).toUpperCase() || "A";
        

        return (
          <div
            key={`${msg.id ?? idx}-${msg.timestamp}`}
            className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex ${isUser ? "flex-row-reverse items-end" : "gap-2 items-center"}`}>

            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-[#023E8A] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {adminInitial}
              </div>
            )}


              <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`w-fit min-w-[100px] max-w-[70%] md:max-w-[60%] p-3 text-sm rounded-lg ${
                    msg.pending
                      ? "bg-yellow-100 text-[#023E8A]"
                      : isUser
                      ? "bg-[#023E8A] text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.file_url && msg.file_type?.startsWith("image/") && (
                    <div className="mt-2">
                      <img
                        src={msg.file_url}
                        alt={msg.file_name || "uploaded file"}
                        className="max-w-xs rounded"
                      />
                    </div>
                  )}

                </div>

                <small className="text-gray-500 text-xs mt-1">
                  {isUser ? (
                    msg.pending
                      ? "Pending..."
                      : new Date(msg.timestamp).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                  ) : (
                    <>
                      {displayName}
                      <span className="mx-1">·</span>
                      {msg.pending
                        ? "Pending..."
                        : new Date(msg.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                    </>
                  )}
                </small>


              </div>
            </div>
            <div ref={bottomRef} />
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
