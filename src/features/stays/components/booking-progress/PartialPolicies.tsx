import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import PoliciesModal from "../modals/PoliciesModal";

const PartialPolicies: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full space-y-2">
        {isMobile && (
          <div className="flex justify-between items-center px-5">
            <h3 className="text-lg font-semibold">Policies</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 font-medium flex items-center gap-1"
            >
              Show all <span className="text-xl">{">"}</span>
            </button>
          </div>
        )}

        <div className="md:border border-gray-300 md:rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start">
            <p className="font-medium text-gray-700">Check In & Check Out</p>
            <ul className="mt-4 ml-8 list-disc md:ml-40">
              <li>Valid ID card required at Check in time</li>
              <li>Check In time: 4:00pm</li>
              <li>Checkout Time: 6:00pm</li>
            </ul>
          </div>
        </div>
      </div>

      {isModalOpen && <PoliciesModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default PartialPolicies;
