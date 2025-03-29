import React, { useState } from "react";
import { FaRegCreditCard } from "react-icons/fa";
import mastercardLogo from "../../assets/images/mastercard-logo.png";
import visaLogo from "../../assets/images/visa-logo.png";

const PaymentMethod: React.FC = () => {
  // State management
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  return (
    <div className="w-full md:w-[628px] space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold">Payment Method</h3>

      {/* Body */}
      <div className="border border-gray-300 rounded-lg p-6 space-y-4">
        {/* Payment Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRegCreditCard className="text-gray-600" />
            <p className="font-medium">Card</p>
          </div>
          <div className="flex gap-2">
            <img src={mastercardLogo} alt="Mastercard" className="w-12 h-8 rounded-lg bg-white p-1 border border-gray-300 shadow" />
            <img src={visaLogo} alt="Visa" className="w-12 h-8 rounded-lg bg-white p-1 border border-gray-300 shadow" />
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full border border-gray-400 rounded-lg p-2 outline-none"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Cardholder's Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full border border-gray-400 rounded-lg p-2 outline-none"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
          </div>

        
            <div className="">
              <label className="block mb-2 font-medium">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div className="">
              <label className="block mb-2 font-medium">CVV</label>
              <input
                type="password"
                placeholder="123"
                className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>

        </div>

        {/* Checkbox */}
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
    </div>
  );
};

export default PaymentMethod;
