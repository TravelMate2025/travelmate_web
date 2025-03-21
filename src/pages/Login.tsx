import { useState } from "react";
import { MdLockOutline, MdOutlineEmail } from "react-icons/md";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import AuthNav from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Logging in with:", { email, password });
    
    setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 2000);
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Full-width Navbar */}
      <AuthNav />

      {/* Centered Content */}
      <div className="flex flex-col items-center flex-1 px-4">
        <div className="text-center w-full max-w-[660px] mt-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Enter Your Password</h2>

          <form onSubmit={handleLogin} className="text-left">
            {/* Email Input */}
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                <MdOutlineEmail />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                    if (e.target.value.length <= 45) setEmail(e.target.value);
                  }}
                className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="name@gmail.com"
                required
              />
            </div>

            {/* Password Input */}
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                <MdLockOutline />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                    if (e.target.value.length <= 20) setPassword(e.target.value);
                  }}
                className="w-full border rounded-lg pl-10 pr-12 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl focus:outline-none"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-6">
              <a href="/reset-password" className="text-[#023E8A] font-bold hover:underline">
                Forgot Password?
              </a>
            </div>


            {/* Submit Button */}
            <button
            type="submit"
            className="bg-[#0450A2] text-white font-semibold py-2 rounded-lg w-full hover:bg-[#023E8A] transition flex items-center justify-center"
            disabled={isLoading}
            >
            <span className={`${isLoading ? "mr-2" : ""}`}>Log In</span> {/* Log In text */}
            {isLoading && (
                <span className="ml-2">
                <Spinner size="20px" />
                </span>
            )}
            </button>

          </form>

          {/* Terms and Privacy */}
          <p className="text-gray-700 text-sm text-center mt-40">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
