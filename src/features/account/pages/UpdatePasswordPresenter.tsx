import { useState } from "react";
import Footer from "../../../components/2Footer";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Navbar from "../../../pages/homePage/Navbar";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import EnterNewPassword from "../components/EnterNewPassword";
import PasswordOtp from "../components/PasswordOtp";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

type UpdatePasswordPresenterProps = {
  hasReceivedOtp: boolean;
  setHasReceivedOtp: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfirmPassword: (userNewPassword: string) => Promise<void>;
  validateOtp: (passwordToken: string) => Promise<void>;
  isOtpValid:boolean;
  handleResendOtp: () => Promise<void>;
  loading: boolean;
  error?: string;
};

function UpdatePasswordPresenter({ 
  hasReceivedOtp,
  setHasReceivedOtp,
  handleConfirmPassword,
  validateOtp,
  isOtpValid,
  handleResendOtp,
  loading,
  error
}: UpdatePasswordPresenterProps) {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passUpdatedSuccessfully, setPassUpdatedSuccessfully] = useState<boolean>(false);

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/account" },
    { name: "Security", link: "/account/security" },
    { name: "Update Password" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="my-10"></div>
       {/* Breadcrumbs or Back Button */}
       {!isOtpValid &&
        <div className="ml-4 md:ml-10 flex items-center">
        {/* Mobile: Back arrow */}
        <Link
            to="/account/security"
            className="flex md:hidden items-center gap-x-22 mb-2 hover:text-blue-800"
        >
            <div className="bg-white border border-gray-300 rounded p-1.5 
        shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] 
        active:scale-95 transition-all duration-200 cursor-pointer w-[35px] flex items-center justify-center">
                <FaAngleLeft size={28} />
            </div>
            <span className="text-2xl font-semibold">Confirm Your Email</span>
        </Link>

        {/* Desktop: Show breadcrumbs */}
        <div className="hidden md:block">
            <Breadcrumbs items={breadcrumbs} />
        </div>
        </div>}

       {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasReceivedOtp && !isOtpValid &&
      <PasswordOtp
        handleResendOtp={handleResendOtp}
        validateOtp={validateOtp}
        loading={loading}
        error={error}
      />}
        
      {isOtpValid &&
        <EnterNewPassword
          setHasReceivedOtp={setHasReceivedOtp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          handleConfirmPassword={handleConfirmPassword}
          setPassUpdatedSuccessfully={setPassUpdatedSuccessfully}
          passUpdatedSuccessfully={passUpdatedSuccessfully}
        />}

      <div className="hidden md:block">
        <TravelmateApp />
      </div>
      <div className="m-10"></div>
      <Footer />
    </div>
  );
}

export default UpdatePasswordPresenter;

