import React from "react";
import { FaTimes, FaLink } from "react-icons/fa";
import { RiMailFill, RiWhatsappFill } from "react-icons/ri";

interface ShareModalProps {
  onClose: () => void;
  shareLink: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, shareLink }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg w-[610px] h-[214px] p-6 shadow-[0_6px_30px_rgba(0,0,0,0.8)]">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold mx-auto">Share</h2>
          <button onClick={onClose} className="text-gray-600 border border-gray-300 rounded-md p-1">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Share Buttons */}
        <div className="flex justify-around mt-6">
          {/* WhatsApp Share */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200"
          >
            <span className="bg-gray-200 p-1 rounded-md">
            <RiWhatsappFill size={20} className="text-green-500" /> 
            </span>
             
            <span>WhatsApp</span>
          </a>

          {/* Email Share */}
          <a
            href={`mailto:?subject=Check this out!&body=${encodeURIComponent(shareLink)}`}
            className="flex gap-2 px-10 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200"
          >
            <span className="bg-gray-200 p-1 rounded-md">
                <RiMailFill size={20} />
            </span>
            
            <span>Email</span>
          </a>

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200"
          >
            <span className="bg-gray-200 p-1 rounded-md">
            <FaLink size={20} />
            </span>
            <span>Copy Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
