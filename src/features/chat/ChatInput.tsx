import { useRef, useState } from "react";
import { MdOutlineImage } from "react-icons/md";

const ChatInput = ({ onSend }: { onSend: (text: string, file?: File) => void }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = () => {
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSend("", file);
      e.target.value = ""; // reset input
    }
  };

  return (
    <div className="fixed bottom-0 right-0 left-0 p-3 bg-white">
      <div className="flex items-center px-2 py-3 md:p-5 rounded-md border border-gray-300">
        <button
          className="mr-2 text-xl"
          onClick={() => fileInputRef.current?.click()}
        >
          <MdOutlineImage size={34} />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-grow min-w-[120px] border rounded px-3 py-2 md:px-4 md:py-2 text-sm md:text-base max-w-full"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-[#023E8A] text-white px-4 py-2 rounded text-sm md:text-base cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
