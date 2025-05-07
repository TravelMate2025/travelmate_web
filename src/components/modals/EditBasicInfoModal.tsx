import Modal from "./Modal";
import { FaUser, FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createUserProfile } from "../../api/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; 


interface EditBasicInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserInfo: {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
  };
}

export default function EditBasicInfoModal({
  isOpen,
  onClose,
  currentUserInfo,
}: EditBasicInfoModalProps) {
  const [firstName, setFirstName] = useState(currentUserInfo.firstName);
  const [lastName, setLastName] = useState(currentUserInfo.lastName);
  const [gender, setGender] = useState(currentUserInfo.gender);
  const [dob, setDob] = useState(currentUserInfo.dob);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useSelector((state: RootState) => state.auth);
  const profileId = useSelector((state: RootState) => state.auth.user?.profileId);

    

  
  useEffect(() => {
    setFirstName(currentUserInfo.firstName);
    setLastName(currentUserInfo.lastName);
    setGender(currentUserInfo.gender);
    setDob(currentUserInfo.dob);
  }, [currentUserInfo]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!accessToken) {
        setError("Please login again to update your profile.");
        return;
      }

      if (!profileId) {
        setError("this user does not exist. Please contact customer support.");
        return;
      }

      const userData = { first_name: firstName, last_name: lastName, gender: gender, date_of_birth: dob, };
      console.log("Sending profile update:", userData);
      await createUserProfile(userData, accessToken, profileId);
      onClose();
      window.location.reload();
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        setError("Session expired. Please login again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Basic Information" onSave={handleSave}>
      <div className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block font-semibold mb-1">First Name</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaUser />
            </span>
            <input
              type="text"
              placeholder="Enter first name"
              className="w-full outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-semibold mb-1">Last Name</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaUser />
            </span>
            <input
              type="text"
              placeholder="Enter last name"
              className="w-full outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="">
          <label className="block font-semibold mb-2">Gender</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={gender === "Male"}
                className="mr-2"
                onChange={() => setGender("Male")}
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={gender === "Female"}
                className="mr-2"
                onChange={() => setGender("Female")}
              />
              Female
            </label>
            {/* <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="I prefer not to say"
                checked={gender === "I prefer not to say"}
                className="mr-2"
                onChange={() => setGender("I prefer not to say")}
              />
              I prefer not to say
            </label> */}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block font-semibold mb-1">Date of Birth</label>
          <div className="flex items-center border border-gray-300 p-2 rounded-md">
            <span className="text-gray-500 mr-2">
              <FaCalendarAlt />
            </span>
            <input
              type="date"
              className="w-full outline-none"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </Modal>
  );
}
