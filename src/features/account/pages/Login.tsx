import { useState } from "react";
import { MdLockOutline } from "react-icons/md";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import AuthNav from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { loginSuccess, updateProfileId, updateUserName } from "../slices/authSlice";
import { useLocation } from "react-router-dom";
import { loginUser } from "../api/auth";
import { setUserProfile as setProfileInRedux } from "../slices/profileSlice"
import { toast } from "react-hot-toast";
import { fetchUserProfile } from "../api/profile";

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  
  const location = useLocation();
  const redirectedEmail = location.state?.email;
  const email = redirectedEmail || user.email || localStorage.getItem("email") || localStorage.getItem("verify_email") || "Not available";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Step 1: Authenticate and save basic user info to Redux
      const res = await loginUser(email || "", password);
  
      // Step 2: Dispatch basic auth info to Redux (no temporary empty name here)
      dispatch(
        loginSuccess({
          accessToken: res.access,
          refreshToken: res.refresh,
          user: {
            id: res.setup_info.id,
            email: res.setup_info.email,
            name: `${res.setup_info.first_name || ""} ${res.setup_info.last_name || ""}`.trim(),
          },
          registrationComplete: res.registration_complete,
        })
      );

      localStorage.setItem("accessToken", res.access);
      localStorage.setItem("refreshToken", res.refresh);
      localStorage.setItem("email", res.setup_info.email);
  
      // Step 3: Fetch full user profile
      const profileData = await fetchUserProfile(res.access);
  
      // Ensure the profile data is saved in Redux
      dispatch(setProfileInRedux(profileData));
  
      // Step 4: Update full name if needed (already set during login step, but ensure consistency)
      const fullName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim();
      if (fullName) {
        dispatch(updateUserName(fullName));
      }
  
      // Step 5: Update profile ID if available
      if (profileData.id) {
        dispatch(updateProfileId(profileData.id));
      }
  
      // Step 6: Check for missing profile information
      const isProfileIncomplete = !profileData.first_name || !profileData.last_name || !profileData.gender || !profileData.date_of_birth;
  
      if (isProfileIncomplete) {
        toast.success(`Welcome back, ${fullName || "User"}!, Please navigate to the profile page to complete your profile`);
        navigate("/");
      } else {
        toast.success(`Welcome back, ${fullName || "User"}!`);
        navigate("/");
      }
  
    } catch (err: any) {
      let errorMsg = "Something went wrong. Please try again.";
      const serverMessage = err.response?.data?.Message;
  
      if (
        serverMessage &&
        serverMessage.includes("The password you entered doesn't match our records")
      ) {
        errorMsg = "Invalid email or password.";
      } else if (serverMessage) {
        errorMsg = serverMessage;
      }
  
      toast.error(errorMsg);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AuthNav />
      <div className="flex flex-col items-center flex-1 px-4">
        <div className="text-center w-full max-w-[660px] mt-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Enter Your Password
          </h2>

          <form onSubmit={handleLogin} className="text-left">
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <div className="mb-4 flex items-center py-2 text-gray-600">
              <span>{email || "Not available"}</span>
            </div>

            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
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

            <div className="text-right mb-6">
              <a
                href="/reset-password"
                className="text-[#023E8A] font-bold hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="bg-[#0450A2] text-white font-semibold py-2 rounded-lg w-full hover:bg-[#023E8A] transition flex items-center justify-center"
              disabled={isLoading}
            >
              <span className={`${isLoading ? "mr-2" : ""}`}>Log In</span>
              {isLoading && (
                <span className="ml-2">
                  <Spinner size="20px" />
                </span>
              )}
            </button>
          </form>

          <p className="text-gray-700 text-sm text-center mt-40">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#023E8A] font-medium hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
