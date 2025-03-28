import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import Logo from "/src/assets/Logo.svg";

export default function AuthNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-2 shadow-md bg-white border-b border-gray-300">
      <button 
        onClick={() => navigate(-1)} 
        className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md shadow-sm p-2"
      >
        <IoChevronBack size={24} />
      </button>

      <img src={Logo} alt="Travel Mate Logo" className="h-20" />
      <div className="w-8"></div>
    </nav>
  );
}
