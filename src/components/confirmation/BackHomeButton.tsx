import React from "react";
import { useNavigate } from "react-router-dom";

const BackHomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="bg-[#023E8A] w-full text-white px-6 py-2 rounded-lg mt-6 mb-15 hover:bg-blue-700"
      onClick={() => navigate("/")}
    >
      Back to Home
    </button>
  );
};

export default BackHomeButton;
