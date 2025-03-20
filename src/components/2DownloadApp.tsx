import { FaGooglePlay, FaApple } from "react-icons/fa";
import QRCode from "../assets/images/QR-code.png";
import { MdOutlineEmail } from "react-icons/md";

export default function DownloadApp() {
  return (
    <section className="bg-white border border-gray-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center w-[1270px] mx-auto my-10 shadow-md shadow-gray-600/50">
      {/* Left Side - Text and Email Box */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900">Get the TravelMate App Now!</h2>
        <p className="text-gray-700 mt-2">
          Discover hotel, flight, and rental car deals exclusively in the app.
        </p>
        <p className="text-gray-700 mt-1">
          Download today to stay connected with important trip details.
        </p>

        {/* Email Input and Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative w-full sm:w-3/5">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
              <MdOutlineEmail />
            </span>
            <input
              type="email"
              placeholder="Enter Email Address"
              className="border border-gray-300 rounded-lg pl-12 pr-4 py-2 w-full h-10 focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
          <button className="bg-[#023E8A] text-white px-5 py-2 rounded-lg w-full sm:w-[150px] h-10 hover:bg-[#012A5D] transition">
            Send Link
          </button>
        </div>
      </div>

      {/* Right Side - App Store Buttons and QR Code */}
      <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row items-center justify-center md:justify-end space-y-6 md:space-y-0 md:space-x-6 mt-8 md:mt-0">
        {/* App Store Buttons */}
        <div className="space-y-5">
          <button className="flex items-center w-50 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            <span className="mr-2 text-xl">
              <FaGooglePlay />
            </span>
            <div>
              <p className="text-xs">Get it on</p>
              <p className="text-lg font-semibold">Google Play</p>
            </div>
          </button>
          <button className="flex items-center w-50 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
            <span className="mr-2 text-xl">
              <FaApple />
            </span>
            <div>
              <p className="text-xs">Download on the</p>
              <p className="text-lg font-semibold">App Store</p>
            </div>
          </button>
        </div>

        {/* QR Code */}
        <div className="p-1 border rounded-md border-gray-400">
          <img src={QRCode} alt="QR Code" className="w-[120px] h-auto border-gray-400" />
        </div>
      </div>
    </section>
  );
}
