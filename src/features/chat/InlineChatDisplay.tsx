import React from "react";
import { Chat } from "../../types/chat";
import { FiFileText } from "react-icons/fi";
import { parseISO } from "date-fns";

interface InlineChatDisplayProps {
  activeChat: Chat | null;
}

const InlineChatDisplay: React.FC<InlineChatDisplayProps> = ({ activeChat }) => {
  if (!activeChat) {
    return <div className="text-gray-500 italic">No chat selected.</div>;
  }

  // Combine messages and claim_history into one sorted array
  const combinedItems: Array<
    | {
        type: "message";
        data: typeof activeChat.messages[0];
      }
    | {
        type: "claim";
        data: {
          id: string | number;
          claim_note_text: string;
          timestamp: string;
        };
      }
    | {
        type: "system";
        message: string;
      }
  > = [];

  // Add claim history entries first
  if (activeChat.claim_history && activeChat.claim_history.length > 0) {
    activeChat.claim_history.forEach((claim) => {
      const noteText =
        claim.claim_note_text || claim.note || "Chat claim note unavailable.";
      combinedItems.push({
        type: "claim",
        data: {
          id: claim.id,
          timestamp: claim.timestamp,
          claim_note_text: noteText,
        },
      });
    });
  }

  // Add the "chat closed" system message if the chat is closed
  if (activeChat.status === "CLOSED") {
    combinedItems.push({
      type: "system",
      message: "This chat is closed. No further messages can be sent.",
    });
  }

  // Add messages
  if (activeChat.messages) {
    activeChat.messages.forEach((msg) => {
      combinedItems.push({ type: "message", data: msg });
    });
  }

  // Sort combined items by timestamp ascending
  combinedItems.sort((a, b) => {
    let dateA: Date;
    let dateB: Date;

    if (a.type === "message") {
      dateA = parseISO(a.data.timestamp);
    } else if (a.type === "claim") {
      dateA = parseISO(a.data.timestamp);
    } else {
      dateA = new Date(); // Or handle system message timestamp if available
    }

    if (b.type === "message") {
      dateB = parseISO(b.data.timestamp);
    } else if (b.type === "claim") {
      dateB = parseISO(b.data.timestamp);
    } else {
      dateB = new Date();
    }

    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="flex flex-col gap-2 py-2 overflow-y-auto">
      {combinedItems.map((item, idx) => {
        if (item.type === "claim") {
          // Render centered claim history note
          return (
            <div
              key={`claim-${item.data.id}`}
              className="text-sm md:text-base text-blue-800 bg-blue-50 text-center border border-blue-200 p-2 rounded-md my-2 max-w-full w-full mx-auto"
            >
              {item.data.claim_note_text}
            </div>
          );
        }

        if (item.type === "system") {
          return (
            <div
              key={`system-${idx}`}
              className="text-sm md:text-base text-gray-800 bg-gray-100 text-center border border-gray-300 p-2 rounded-md my-2 max-w-full w-full mx-auto"
            >
              {item.message}
            </div>
          );
        }

        const msg = item.data;
        const isUser = msg.sender === "user";
        const sender = msg.sender_info;
        const displayName =
          sender?.first_name?.trim() ||
          sender?.email?.split("@")[0] ||
          (isUser ? "User" : "Admin");

        const adminInitial =
          sender?.first_name?.charAt(0).toUpperCase() ||
          sender?.email?.charAt(0).toUpperCase() ||
          "A";

        // Filter out empty messages with no file
        if (msg.content?.trim() === "" && !msg.file_url) {
          return null;
        }

        return (
          <div
            key={`${msg.id ?? idx}-${msg.timestamp}`}
            className={`flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex ${
                isUser ? "flex-row-reverse items-end" : "gap-2 items-center"
              }`}
            >
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

                  {msg.file_url && (
                    <div className="mt-2">
                      {msg.file_type?.startsWith("image/") ? (
                        <>
                          <div className="border border-gray-300 rounded overflow-hidden max-w-full sm:max-w-xs break-words">
                            <img
                              src={msg.file_url}
                              alt={msg.file_name || "uploaded file"}
                              className="w-full h-auto object-contain rounded"
                            />
                          </div>
                          <a
                            href={msg.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline text-sm mt-2 inline-block ${
                              isUser ? "text-gray-100" : "text-blue-600"
                            }`}
                          >
                            View file
                          </a>
                        </>
                      ) : (
                        <div className="bg-white border border-gray-300 p-3 rounded text-sm max-w-full sm:max-w-xs break-words">
                          <div className="flex items-center gap-2">
                            <FiFileText className="w-14 h-10 text-gray-500" />

                            <p className="font-medium truncate">{msg.file_name}</p>
                          </div>
                          <a
                            href={msg.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-xs mt-2 inline-block"
                          >
                            View file
                          </a>
                        </div>
                      )}
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
          </div>
        );
      })}
    </div>
  );
};

export default InlineChatDisplay;