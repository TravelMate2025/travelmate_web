import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSave?: () => void;
  saveText?: string;
}

export default function Modal({ isOpen, onClose, title, children, onSave, saveText = "Save" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-60  flex items-center justify-center z-[1100]">

    <div className="bg-white w-[500px] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)]">

        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">{children}</div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-gray-300 space-x-4">
          <button onClick={onClose} className="w-[100px] py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          {onSave && (
            <button onClick={onSave} className="min-w-35 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-blue-800">
              {saveText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
