import { useState } from "react";
import { Link } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import Logo from "/src/assets/Logo.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md py-4 px-6 md:px-14 flex items-center justify-between">
      {/* Left Side: Logo & Navigation Links */}
      <div className="flex items-center space-x-6 md:space-x-14">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <img src={Logo} alt="Travel Mate Logo" className="h-14" />
        </Link>

        <div className="hidden md:flex space-x-14">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/destinations" className="text-gray-700 hover:text-blue-600">Stays</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">Flight</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Cars</Link>
        </div>
      </div>

      {/* Account/Login Button */}
      <div className="hidden md:flex">
        <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition">
          Create an Account or Login
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-700 text-2xl" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden z-50">
          <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/destinations" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Stays</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Flight</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Cars</Link>
          <Link to="/create-account" className="px-4 py-2 bg-[#023E8A] text-white rounded-lg hover:bg-[#012A5D] transition" onClick={() => setIsOpen(false)}>
            Create an Account or Login
          </Link>
        </div>
      )}
    </nav>
  );
}
