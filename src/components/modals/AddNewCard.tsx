import React, { useState } from "react";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";

const AddNewCardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const validate = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!cardNumber.trim()) newErrors.cardNumber = true;
    if (!cardHolder.trim()) newErrors.cardHolder = true;
    if (!expiryDate.trim()) newErrors.expiryDate = true;
    if (!cvv.trim()) newErrors.cvv = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Card Added Successfully");
      onClose();
    }
  };

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="flex items-center gap-1 text-red-600 text-sm mt-1">
        <FaExclamationCircle /> Enter {field.replace(/([A-Z])/g, " $1").toLowerCase()}.
      </p>
    ) : null;

  return (
    <div className="fixed inset-0 top-12 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg w-[500px] h-[91%] p-6 shadow-[0_9px_60px_rgba(0,0,0,0.9)] z-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold w-full text-center">Add New Card</h2>
          <button className="text-gray-600 p-2 border border-gray-300 rounded-md hover:bg-gray-200" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <hr className="text-gray-300 mb-6"/>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-400 rounded-lg p-2 outline-none"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            {renderError("cardNumber")}
          </div>
          <div>
            <label className="block font-medium">Cardholder's Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full border border-gray-400 rounded-lg p-2 outline-none"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
            {renderError("cardHolder")}
          </div>
         
            <div >
              <label className="block font-medium">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
              {renderError("expiryDate")}
            </div>
            <div >
              <label className="block font-medium">CVV</label>
              <input
                type="password"
                placeholder="123"
                className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
              {renderError("cvv")}
            </div>
    
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              className="w-4 h-4 border rounded"
            />
            <p className="text-sm text-gray-700">Set as default payment method</p>
          </div>
        </div>

        {/* Footer */}
        <div className="my-4 flex justify-end">
          <button
            className="bg-[#023E8A] text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCardModal;
