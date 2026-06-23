import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { socialGoogleLogin } from "../api/auth";
import { loginSuccess } from "../slices/authSlice";

type ApiErrorLike = {
  response?: {
    data?: {
      non_field_errors?: string[];
    };
  };
};

// Only mounts when VITE_GOOGLE_CLIENT_ID is configured — useGoogleLogin requires the context
// to be seeded with a real clientId or it throws.
function GoogleLoginButtonActive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let googleEmail = "";
      try {
        const access_token = tokenResponse.access_token;
        localStorage.setItem("google_access_token", access_token);

        if (!access_token) {
          toast.error("Google login failed: No access token received.");
          return;
        }

        try {
          const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
          });
          const googleUser = await userInfoRes.json();
          googleEmail = googleUser?.email || "";
        } catch (err) {
          console.error("Failed to fetch Google user info:", err);
        }

        const res = await socialGoogleLogin(access_token);

        toast.success("User successfully Logged in!");
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
          navigate("/", { replace: true });
        } else {
          toast.error("Unexpected response format. Please try again.");
          console.error("Unexpected Google login response:", res);
        }
      } catch (error: unknown) {
        console.error("Google login failed:", error);
        const backendError = (error as ApiErrorLike)?.response?.data;
        if (
          backendError?.non_field_errors?.includes(
            "User is already registered with this e-mail address."
          )
        ) {
          toast.success("This Google account is already registered. Please log in instead.");
          navigate("/login", { state: { email: googleEmail } });
        } else {
          toast.error("Google login failed. Please try again.");
          console.error("Google login error response:", backendError);
        }
      }
    },
    onError: () => {
      toast.error("Google login was unsuccessful.");
    },
    flow: "implicit",
    scope: "openid email profile",
  });

  return (
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
  );
}

// Wrapper — renders the active component only when clientId is configured.
// When not configured, shows the same button UI but alerts the user on click.
export default function GoogleLoginButton() {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() => toast.error("Google login is not configured for this environment.")}
        className="relative w-full border border-[#023E8A] text-[#023E8A] cursor-pointer flex items-center justify-center py-2 rounded-lg mb-2 hover:bg-gray-100 transition"
      >
        <span className="absolute left-4">
          <FaGoogle />
        </span>
        <span>Continue with Google</span>
      </button>
    );
  }

  return <GoogleLoginButtonActive />;
}
