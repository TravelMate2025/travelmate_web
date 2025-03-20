interface UserDataProps {
  name: string;
  email: string;
  profileImage?: string;
}

export default function UserData({ name, email, profileImage }: UserDataProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* Profile Image */}
      <div className="w-[150px] h-[150px] flex items-center justify-center rounded-full bg-[#023E8A] text-white text-5xl font-bold">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
            name.charAt(0).toUpperCase()
        )}
      </div>

      {/* User Details */}
      <h2 className="mt-3 text-lg font-semibold">{name}</h2>
      <p className="text-gray-500">{email}</p>
    </div>
  );
}
