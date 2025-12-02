import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearSearchState } from "../../slice";

const BackHomeButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <button
      className="bg-[#023E8A] w-full text-white px-6 py-2 rounded-lg mt-6 mb-15 hover:bg-blue-700"
      onClick={() => {
        dispatch(clearSearchState());                                            
        navigate("/");
      }}
    >
      Back to Home
    </button>
  );
};

export default BackHomeButton;
