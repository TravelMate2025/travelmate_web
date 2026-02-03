import { FaCheck } from "react-icons/fa";
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

function SuccessModal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[220px] h-[220px] flex flex-col items-center justify-center">

        <div className="bg-blue-950 w-[70px] h-[70px] rounded-full flex items-center justify-center mb-4">
          <FaCheck size={34} color="white" />
        </div>

        <div className="text-gray-800 text-center font-semibold">{children}</div>
      </div>
    </div>
  );
}

function ModalBody({ children }: ModalProps) {
  return <div>{children}</div>;
}

SuccessModal.Body = ModalBody;

export default SuccessModal;
