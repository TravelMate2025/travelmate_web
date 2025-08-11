import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { FaQuestion, FaRegEnvelope } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { MdOutlineMessage } from "react-icons/md";

const FloatingChatButton = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wasDragged = useRef(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const draggableRef = useRef<HTMLDivElement | null>(null); // 👈 Add this line

  const options = [
    {
      title: "FAQs",
      description: "Find quick answers to popular travel questions.",
      icon: <FaQuestion size={24} />,
      path: "/faqs",
    },
    {
      title: "Tickets",
      description: "View or manage your support tickets easily.",
      icon: <FaRegEnvelope size={24} />,
      path: "/tickets",
    },
    {
      title: "Chat with Us",
      description: "Talk to a live agent for immediate help.",
      icon: <MdOutlineMessage size={24} />,
      path: "/chat-with-us",
    },
  ];

  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

const handleStart = (_e: any, data: any) => {
  wasDragged.current = false;
  dragStartPos.current = { x: data.x, y: data.y };
};

const handleStop = (_e: any, data: any) => {
  const dx = data.x - dragStartPos.current.x;
  const dy = data.y - dragStartPos.current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 5) {
    setOpen(true);
  }
};


  const handleDrag = () => {
    wasDragged.current = true;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Floating Draggable Button */}
      <Draggable
        nodeRef={draggableRef} // 👈 Pass nodeRef here
        onStart={handleStart}
        onDrag={handleDrag}
        onStop={handleStop}
      >
        <div ref={draggableRef} className="fixed bottom-10 right-4 z-50">
          <button
            className="w-14 h-14 bg-[#023E8A] text-white rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
          >
            <MdOutlineMessage className="h-8 w-8" />
          </button>
        </div>
      </Draggable>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="flex flex-col bg-white rounded-xl shadow-2xl w-[90%] max-w-md overflow-hidden"
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(option.path)}
                className={`flex items-center justify-between p-4 transition hover:bg-gray-100 ${
                  index === options.length - 1 ? "" : "border-b border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <div>{option.icon}</div>
                  <div>
                    <p className="font-medium text-gray-800">{option.title}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
                <FiChevronRight size={20} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
