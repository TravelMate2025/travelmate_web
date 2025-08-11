import { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import AuthNavbar from "../components/AuthNavbar";
import Spinner from "../components/Spinner"; 
import { useNavigate } from "react-router-dom";
import { submitEmail } from "../api/auth"
import { toast } from "react-hot-toast";

import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/authSlice";
import { socialGoogleLogin } from "../api/auth";
// import { facebookLogin } from "../utils/firebase";


export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!email || !email.includes("@")) {
        toast.error("Please enter a valid email address.");
        return;
      }
  
      const res = await submitEmail(email);
      console.log("📥 Backend Response:", res);
  
      if (res?.Error === false && res?.Message) {
        toast.success(res.Message || "Verification OTP sent to your email.");
        localStorage.setItem("verify_email", email);
        navigate("/verify-page", { state: { email } });
      } else {
        // Handle unexpected structure even in success
        toast.error(res?.Message || "Failed to send verification email. Please try again.");
      }
  
    } catch (err: any) {
      console.error(err);
  
      if (err?.response?.data?.Message === "Enter your password to log in.") {
        navigate("/login", { state: { email } });
        return;
      }
  
      const message =
        err?.response?.data?.Message ||
        err?.response?.data?.error ||
        "Failed to send verification email. Please try again.";
  
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  



  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let googleEmail = "";
      
      try {
        const access_token = tokenResponse.access_token;
        console.log("Google Access Token:", access_token);
  
        if (!access_token) {
          toast.error("Google login failed: No access token received.");
          return;
        }
  
        // Fetch user info from Google
        try {
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          const googleUser = await userInfoRes.json();
          googleEmail = googleUser?.email || "";
          console.log("Fetched Google email:", googleEmail);
        } catch (err) {
          console.error("Failed to fetch Google user info:", err);
        }
  
        const res = await socialGoogleLogin(access_token);
  
        // Check if response contains expected access/refresh tokens
        toast.success("Logging In...");
        console.log("Google login success response:", res);
        if (res?.access && res?.refresh) {
          dispatch(
            loginSuccess({
              accessToken: res.access,
              refreshToken: res.refresh,
              user: {
                id: res.user?.id ?? 0,
                email: res.user?.email ?? "",
                name: res.user?.name ?? "",
              },
              registrationComplete: res.registration_complete ?? false,
            })
          );
          localStorage.setItem("accessToken", res.access);
          localStorage.setItem("refreshToken", res.refresh);
          localStorage.setItem("email", res.user?.email ?? googleEmail ?? "");
          navigate("/");
        } else {
          toast.error("Unexpected response format. Please try again.");
          console.error("Unexpected Google login response:", res);
        }
      } catch (error: any) {
        console.error("Google login failed:", error);
  
        const backendError = error?.response?.data;
  
        // Handle known error: already registered
        if (
          backendError?.non_field_errors?.includes("User is already registered with this e-mail address.")
        ) {
          toast.success("This Google account is already registered. Please log in instead.");
          navigate("/login", { state: { email: googleEmail } }); // ✅ pass the fetched email here
        } else {
          // Generic fallback
          toast.error("Google login failed. Please try again.");
          console.error("Google login error response:", backendError);
        }
      }
    },
    onError: () => {
      toast.error("Google login was unsuccessful.");
    },
    flow: "implicit",
    scope: "openid email profile", // ✅ make sure this is included
  });
  




  return (
    <div className="h-screen flex flex-col relative bg-white">
      <AuthNavbar />

      {/* Page Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 transition mt-5">
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold">Create an account or Log In</h1>
          <p className="text-gray-700 mt-2 w-full">
            Enter your Email address and we'll use it to create an account or log you in.
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

          <button
            type="button"
            onClick={() => googleLogin()}
            className="relative w-full border border-[#023E8A] text-[#023E8A] cursor-pointer flex items-center justify-center py-2 rounded-lg mb-2 hover:bg-gray-100 transition"
          >
            <span className="absolute left-4">
              <FaGoogle />
            </span>
            <span>Continue with Google</span>
          </button>

          <button 
           className="relative w-full border border-[#023E8A] text-[#023E8A] cursor-pointer flex items-center justify-center py-2 rounded-lg mb-2 hover:bg-gray-100 transition">
            <span className="absolute left-4"><FaApple /></span>
            <span>Continue with Apple</span>
          </button>

          <p className="text-gray-700 text-sm text-center mt-15">
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
