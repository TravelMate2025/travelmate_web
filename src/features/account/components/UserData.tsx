import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function UserData() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-[#023E8A] text-white text-5xl font-bold">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          user.name.charAt(0).toUpperCase() || "U"
        )}
      </div>

      <h2 className="mt-3 text-lg font-semibold">{user.name ? user.name : "User"}</h2>
      <p className="text-gray-500">{user.email}</p>
    </div>
  );
}
