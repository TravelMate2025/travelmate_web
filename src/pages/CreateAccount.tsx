import { useState } from "react";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner"; 
import { useNavigate } from "react-router-dom";
import { submitEmail } from "../api/auth"
import { toast } from "react-hot-toast";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
      }
  
      await submitEmail(email);
      toast.success("Verification email sent successfully.");
  
      localStorage.setItem("verify_email", email);
      navigate("/verify-page", { state: { email } });
  
    } catch (err: any) {
      console.error(err);
  
      const message = 
        err?.response?.data?.Message || 
        err?.response?.data?.error || 
        "Failed to send verification email. Please try again.";
  
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  


  return (
    <div className="h-screen flex flex-col relative bg-white">
      <AuthNavbar />

      {/* Page Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 transition">
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold text-[#023E8A]">Create an account or Log In</h1>
          <p className="text-gray-700 mt-2 w-full">
            Unlock personalized deals and earn rewards with your Travel Mate account.
          </p>
        </div>

        <div className="w-full max-w-[660px] px-6 mt-6">
          <form onSubmit={handleSubmit} className="text-left">
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                if (e.target.value.length <= 45) setEmail(e.target.value);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Name@email.com"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#023E8A] text-white py-2 rounded-lg mt-3 hover:bg-[#0450A2] transition"
              disabled={isLoading}
            >
              Continue
            </button>
          </form>

          <div className="flex items-center my-5">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button className="relative w-full border border-[#023E8A] text-[#023E8A] flex items-center justify-center py-2 rounded-lg mb-2 hover:bg-gray-100 transition">
            <span className="absolute left-4"><FaGoogle /></span>
            <span>Continue with Google</span>
          </button>

          <button className="relative w-full border border-[#023E8A] text-[#023E8A] flex items-center justify-center py-2 rounded-lg mb-2 hover:bg-gray-100 transition">
            <span className="absolute left-4"><FaApple /></span>
            <span>Continue with Apple</span>
          </button>

          <button className="relative w-full border border-[#023E8A] text-[#023E8A] flex items-center justify-center py-2 rounded-lg hover:bg-gray-100 transition">
            <span className="absolute left-4"><FaFacebook /></span>
            <span>Continue with Facebook</span>
          </button>

          <p className="text-gray-700 text-sm text-center mt-5">
            By continuing, you have read and agree with our{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">Terms of Use</a> and{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Spinner Overlay */}
      {isLoading && (
        <>
          <div className="fixed inset-0 bg-[#CCD8E8] opacity-50 z-40"></div>

    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <span className="h-[24px] w-[24px]">
      <Spinner  />
      </span>
    </div>
    
        </>
      )}
    </div>
  );
}
