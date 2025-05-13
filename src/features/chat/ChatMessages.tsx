import { useEffect, useRef } from "react";

interface Message {
  id?: number;
  content: string;
  sender: string;
  timestamp: string;
  pending?: boolean;
  clientId?: string;
}

interface Chat {
  messages: Message[];
}

const ChatMessages = ({ activeChat }: { activeChat: Chat | null }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length]);

  if (!activeChat) {
    console.log("no active chat");
    return null;
  }

  return (
    <div className="flex flex-col gap-4 my-6 overflow-y-auto h-[60vh]">
      {activeChat.messages.map((msg, idx) => (
        <div
          key={`${msg.id ?? idx}-${msg.timestamp}`}
          className={`flex mb-6 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[60%] p-3 rounded-lg ${
              msg.pending ? "bg-yellow-100" : "bg-gray-100"
            }`}
          >
            <p>{msg.content}</p>
            <small className="text-gray-500 text-xs">
              {msg.pending
                ? "Pending..."
                : new Date(msg.timestamp).toLocaleString()}
            </small>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
