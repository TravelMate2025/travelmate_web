import { useEffect, useState } from "react";
import BasicInfo from "../../stays/components/BasicInfo";
import EditBasicInfoModal from "../components/EditBasicInfoModal";
import EditContactInfoModal from "../components/EditContactInfoModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import Navbar from "../../../pages/homePage/Navbar";
import { useMediaQuery } from "react-responsive";
import { fetchUserProfile } from "../api/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { updateProfileId, updateUserName } from "../slices/authSlice";
import { setUserProfile as setProfileInRedux } from "../slices/profileSlice";

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  gender: string | null;
  date_of_birth: string | null;
  email: string;
  mobile_number: string | null;
  address: string | null;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message;
    return message || fallback;
  }
  return fallback;
};

export function ProfileInfoSettings() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    if (!accessToken) {
      setIsLoading(false);
      setError("Session expired. Please log in again.");
      return;
    }

    const loadUserProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const profileData = await fetchUserProfile(accessToken);

        setUserProfile(profileData);

        if (profileData?.first_name && profileData?.last_name) {
          const fullName = `${profileData.first_name} ${profileData.last_name}`;
          dispatch(updateUserName(fullName));
        }

        if (profileData?.id) {
          dispatch(updateProfileId(profileData.id));
        }

        dispatch(setProfileInRedux(profileData));
      } catch (err: unknown) {
        console.error("⚠️ Error loading profile:", err);
        setError(getErrorMessage(err, "Failed to load profile information."));
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    loadUserProfile();
  }, [accessToken, dispatch]);


  if(isLoading){
    return(
      <div className="h-[50vh] inset-0 z-50 flex items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center bg-[#CCD8E8] rounded-full bg-opacity-50 z-50">
            <Spinner />
          </div>
        </div>
    )
  }

  return (
    <div>
      

      {isMobile ? (
        // ... (Mobile layout - same as before, but using isLoading and userProfile)
        <div className="h-screen">
          <Navbar />
          <div className="mt-22">
            <div className="w-[95%] m-auto">
              <>
                {error && (
                  <p className="min-w-[200px] border border-red-500 rounded-md text-center text-red-500 my-3 bg-red-50 p-1">
                    {error}
                  </p>
                )}

                <BasicInfo
                  title="Basic Information"
                  fields={[
                    {
                      label: "Name",
                      value: userProfile
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : null,
                    },
                    {
                      label: "Gender",
                      value: userProfile?.gender || null,
                    },
                    {
                      label: "Date of Birth",
                      value: userProfile?.date_of_birth || null,
                    },
                  ]}
                  onEdit={() => setShowBasicInfoModal(true)}
                  isLoading={isLoading}
                />
                <BasicInfo
                  title="Contact Information"
                  fields={[
                    {
                      label: "Email Address",
                      value: userProfile?.email || null,
                    },
                    {
                      label: "Mobile Number",
                      value: userProfile?.mobile_number || null,
                    },
                    {
                      label: "Address",
                      value: userProfile?.address || null,
                    },
                  ]}
                  onEdit={() => setShowContactInfoModal(true)}
                  isLoading={isLoading}
                />

                <button
                  className="w-full py-3 my-5 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </>
            </div>
          </div>
        </div>
      ) : (
        // ... (Desktop layout - same as before, but using isLoading and userProfile)
        <div className="h-screen flex flex-col">

          <div>
            <div className="w-[95%] m-auto">
              {error && (
                <p className="min-w-[200px] border border-red-500 rounded-md text-center text-red-500 mr-2 my-3 bg-red-50 p-1">
                  {error}
                </p>
              )}
              <div className="">
                <div className="space-y-6">
                  <>
                    <BasicInfo
                      title="Basic Information"
                      fields={[
                        {
                          label: "Name",
                          value: userProfile
                            ? `${userProfile.first_name} ${userProfile.last_name}`
                            : null,
                        },
                        {
                          label: "Gender",
                          value: userProfile?.gender || null,
                        },
                        {
                          label: "Date of Birth",
                          value: userProfile?.date_of_birth || null,
                        },
                      ]}
                      onEdit={() => setShowBasicInfoModal(true)}
                      isLoading={isLoading}
                    />
                    <BasicInfo
                      title="Contact Information"
                      fields={[
                        {
                          label: "Email Address",
                          value: userProfile?.email || null,
                        },
                        {
                          label: "Mobile Number",
                          value: userProfile?.mobile_number || null,
                        },
                        {
                          label: "Address",
                          value: userProfile?.address || null,
                        },
                      ]}
                      onEdit={() => setShowContactInfoModal(true)}
                      isLoading={isLoading}
                    />

                    <button
                      className="w-full py-3 my-5 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <EditBasicInfoModal
        isOpen={showBasicInfoModal}
        onClose={() => setShowBasicInfoModal(false)}
        currentUserInfo={{
          firstName: userProfile?.first_name ?? "",
          lastName: userProfile?.last_name ?? "",
          gender: userProfile?.gender ?? "",
          dob: userProfile?.date_of_birth ?? "",
        }}
      />

      <EditContactInfoModal
        isOpen={showContactInfoModal}
        onClose={() => setShowContactInfoModal(false)}
        currentUserInfo={userProfile} // You might want to pass relevant contact info here
        // onUpdate={handleUpdateContactInfo} // Implement this if you have a separate contact info update
      />
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        // onDelete={() => console.log("Account Deleted")}
      />
    </div>
  );
}
