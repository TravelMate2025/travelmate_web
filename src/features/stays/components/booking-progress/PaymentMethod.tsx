
import React, { useState } from "react";
import { FaRegCreditCard } from "react-icons/fa";
import mastercardLogo from "../../../../assets/images/mastercard-logo.png"
import visaLogo from "../../../../assets/images/visa-logo.png";
import AddNewCard from "../modals/AddNewCard";
// import { submitCardCVV } from "../../../../api/paymentApi";
import PaymentFailedModal from "../modals/PaymentFailedModal";

interface PaymentMethodProps {
  initialCards?: Card[];
}

interface Card {
  id: number;
  cardNumber: string;
  cardHolder: string;
  isDefault: boolean;
  type: "visa" | "mastercard";
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ initialCards = [] }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState(""); // Declare cvv state
  const [isDefault, setIsDefault] = useState(false);
  const [savedCards] = useState<Card[]>(initialCards);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  const maskCardNumber = (cardNumber: string) => "**** **** **** " + cardNumber.slice(-4);

  const handleCardSelect = (cardId: number) => {
    setSelectedCard(prev => (prev === cardId ? null : cardId));
  };

  // const handleSubmitCvv = async (cardId: number) => {
  //   if (!cvv || cvv.length < 3) {
  //     alert("Please enter a valid CVV");
  //     return;
  //   }

  //   try {
  //     // await submitCardCVV({ cardId, cvv });
  //     alert("CVV submitted successfully!");
  //   } catch (error) {
  //     alert("Failed to submit CVV.");
  //     console.error(error);
  //     setShowFailedModal(true);
  //   }
  // };

  const handleCloseModal = () => {
    setShowAddCardModal(false);
  };

  // const formValid =
  //   cardNumber.trim().length === 16 &&
  //   cardHolder.trim().length > 0 &&
  //   /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate) &&
  //   cvv.trim().length === 3;

  return (
    <div className="w-full md:w-[628px] space-y-4">
      <h3 className="text-lg font-semibold ml-5">Payment Method</h3>

      <div className="border-t border-b md:border border-gray-300 md:rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRegCreditCard className="text-gray-600" />
            <p className="font-medium">Card</p>
          </div>
          <div className="flex gap-2">
            <img
              src={mastercardLogo}
              alt="Mastercard"
              className="w-12 h-8 rounded-lg bg-white p-1 border border-gray-300 shadow"
            />
            <img
              src={visaLogo}
              alt="Visa"
              className="w-12 h-8 rounded-lg bg-white p-1 border border-gray-300 shadow"
            />
          </div>
        </div>

        {savedCards.length > 0 ? (
          <div className="space-y-4">
            {savedCards.map((card) => (
              <div key={card.id} className="border border-gray-300 rounded-lg p-4 w-full">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="selectedCard"
                    className="mr-3 w-5 h-5"
                    checked={selectedCard === card.id}
                    onChange={() => handleCardSelect(card.id)}
                  />
                  <img
                    src={card.type === "visa" ? visaLogo : mastercardLogo}
                    alt={card.type}
                    className="w-10 h-6 mr-4"
                  />
                  <div className="flex-grow">
                    <p className="font-medium flex items-center">
                      {card.cardHolder}
                      {card.isDefault && (
                        <span className="ml-2 text-xs border border-red-500 text-red-500 px-2 py-1 rounded-md">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-gray-600">{maskCardNumber(card.cardNumber)}</p>
                  </div>
                </div>

                {selectedCard === card.id && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="password"
                      placeholder="Enter CVV"
                      className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    <button
                      // onClick={() => handleSubmitCvv(card.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Use Card
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowAddCardModal(true)}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add New Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Inputs for adding new card (excluding CVV) */}
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

            <div>
              <label className="block mb-2 font-medium">Expiry Date</label>
              <input
                type="date"
                placeholder="MM/YY"
                className="w-full border border-gray-400 rounded-lg p-2 outline-none"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
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
          

            {/* Checkbox */}
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
                className="w-4 h-4 border rounded"
                disabled={!formValid}
              />
              <p className={`text-sm ${!formValid ? "text-gray-400" : "text-gray-700"}`}>
                Set as default payment method
              </p>
            </div> */}
          </div>
        )}
      </div>

      {showFailedModal && <PaymentFailedModal onClose={() => setShowFailedModal(false)} />}
      {showAddCardModal && <AddNewCard onClose={handleCloseModal} />}
    </div>
  );
};

export default PaymentMethod;
