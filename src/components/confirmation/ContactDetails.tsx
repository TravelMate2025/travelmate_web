import React from "react";

const ContactDetails: React.FC = () => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold text-left mt-2">Contact</h2>
      <div className="text-lg p-4 rounded-lg flex justify-between border border-gray-300">
        <span className="font-semibold text-gray-600">Customer Support</span>
        <span>+234 800 123 4567</span>
      </div>
      
    </div>
  );
};

export default ContactDetails;
