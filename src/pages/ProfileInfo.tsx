import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import UserOptionsStacked from "../components/UserOptionsStacked";
import BasicInfo from "../components/BasicInfo";
import EditBasicInfoModal from "../components/modals/EditBasicInfoModal";
import EditContactInfoModal from "../components/modals/EditContactInfoModal";
import DeleteAccountModal from "../components/modals/DeleteAccountModal";
import Navbar from "./homePage/Navbar";
import TravelmateApp from "./homePage/TravelmateApp";
import Footer from "../components/2Footer";
import PaymentMethods from "./PaymentMethods";
import NotificationMethod from "./NotificationMethod";
import { useMediaQuery } from "react-responsive";
import { fetchUserProfile } from "../api/profile"; 
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { updateProfileId, updateUserName } from "../features/auth/authSlice";
import { setUserProfile as setProfileInRedux } from "../features/reduxslices/profileSlice"
import UserReviews from "../components/UserReviews";




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


export default function ProfileInfo() {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const navigate = useNavigate();
    const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
    const [showContactInfoModal, setShowContactInfoModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activeTab, setActiveTab] = useState("Profile");
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, accessToken } = useSelector((state: RootState) => state.auth);
    

    const dispatch = useDispatch();


    const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: "Account", link: "/account" },
        { name: activeTab },
    ];

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabFromQuery = queryParams.get("tab");

    useEffect(() => {
        if (tabFromQuery) {
            setActiveTab(tabFromQuery);
        }
    }, [tabFromQuery]);

    const handleOptionClick = (tab: string) => {
        setActiveTab(tab);
        navigate(`/profile-info?tab=${encodeURIComponent(tab)}`);
    };

    useEffect(() => {
        console.log("📍 Checking user and token:", user?.id, accessToken);
      
        if (!accessToken) {
          setIsLoading(false);
          setError("Session expired. Please log in again.");
          return;
        }
      
        const loadUserProfile = async () => {
          setIsLoading(true);
          setError(null);
      
          try {
            console.log("🚀 Loading user profile from API...");
            const profileData = await fetchUserProfile(accessToken);
      
            console.log("📦 Profile data received:", profileData);
            setUserProfile(profileData);
      
            if (profileData?.first_name && profileData?.last_name) {
              const fullName = `${profileData.first_name} ${profileData.last_name}`;
              dispatch(updateUserName(fullName));
              console.log("📝 Full name updated in Redux:", fullName);
            }

            if (profileData?.id) {
                dispatch(updateProfileId(profileData.id));
                console.log("📌 Profile ID saved in Redux:", profileData.id);
            }
      
            dispatch(setProfileInRedux(profileData));
            console.log("✅ Full user profile saved to Redux");
      
          } catch (err: any) {
            console.error("⚠️ Error loading profile:", err);
            setError(err.message || "Failed to load profile information.");
          } finally {
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          }
        };
      
        loadUserProfile();
      }, [accessToken]);
      
    
    

    return (
        <div>
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
              <div className="w-16 h-16 flex items-center justify-center bg-[#CCD8E8] rounded-full bg-opacity-50 z-50">
                <Spinner />
              </div>
            </div>
          )}


                {isMobile ? (
                // ... (Mobile layout - same as before, but using isLoading and userProfile)
                <div className="h-screen flex flex-col">
                    <Navbar />
                    <div className="mt-22">
                        <div className="w-[95%] m-auto">
                            <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row">
                                <div className="w-full md:w-2/3 space-y-6">
                                    {activeTab === "Profile" && (
                                        <>
                                        
                                        {error && <p className="min-w-[200px] border border-red-500 rounded-md text-center text-red-500 my-3 bg-red-50 p-1">{error}</p>}
                                            
                                            <BasicInfo
                                                title="Basic Information"
                                                fields={[
                                                    { label: "Name", value: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : null },
                                                    { label: "Gender", value: userProfile?.gender || null },
                                                    { label: "Date of Birth", value: userProfile?.date_of_birth || null },
                                                ]}
                                                onEdit={() => setShowBasicInfoModal(true)}
                                                isLoading={isLoading}
                                            />
                                            <BasicInfo
                                                title="Contact Information"
                                                fields={[
                                                    { label: "Email Address", value: userProfile?.email || null },
                                                    { label: "Mobile Number", value: userProfile?.mobile_number || null },
                                                    { label: "Address", value: userProfile?.address || null },
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
                                    )}

                                    {activeTab === "Payment Method" && <PaymentMethods />}
                                    {activeTab === "Notifications" && <NotificationMethod />}
                                    {activeTab === "Security" && (
                                        <div>
                                            <h2 className="text-2xl font-semibold">Security</h2>
                                            <p className="text-gray-600">Change your password, enable 2FA, etc.</p>
                                        </div>
                                    )}
                                    {activeTab === "Reviews" && (
                                        <div>
                                            <UserReviews reviews={[]} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-30">
                        <Footer />
                    </div>
                </div>
            ) : (
                // ... (Desktop layout - same as before, but using isLoading and userProfile)
                <div className="h-screen flex flex-col">
                    <Navbar />
                    <div className="my-10"></div>
                    <Breadcrumbs items={breadcrumbs} />

                    <div>
                        <div className="w-[95%] m-auto">
                        {error && <p className="min-w-[200px] border border-red-500 rounded-md text-center text-red-500 mr-2 my-3 bg-red-50 p-1">{error}</p>}
                            <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row">
                                <div className="w-full md:w-1/3">
                                    <UserOptionsStacked
                                        activeTab={activeTab}
                                        handleOptionClick={handleOptionClick}
                                    />
                                </div>

                                <div className="w-full md:w-2/3 space-y-6">
                                    {activeTab === "Profile" && (
                                        <>
                                            <BasicInfo
                                                title="Basic Information"
                                                fields={[
                                                    { label: "Name", value: userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : null },
                                                    { label: "Gender", value: userProfile?.gender || null },
                                                    { label: "Date of Birth", value: userProfile?.date_of_birth || null },
                                                ]}
                                                onEdit={() => setShowBasicInfoModal(true)}
                                                isLoading={isLoading}
                                            />
                                            <BasicInfo
                                                title="Contact Information"
                                                fields={[
                                                    { label: "Email Address", value: userProfile?.email || null },
                                                    { label: "Mobile Number", value: userProfile?.mobile_number || null },
                                                    { label: "Address", value: userProfile?.address || null },
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
                                    )}

                                    {activeTab === "Payment Method" && <PaymentMethods />}
                                    {activeTab === "Notifications" && <NotificationMethod />}
                                    {activeTab === "Security" && (
                                        <div>
                                            <h2 className="text-2xl font-semibold">Security</h2>
                                            <p className="text-gray-600">Change your password, enable 2FA, etc.</p>
                                        </div>
                                    )}
                                    {activeTab === "Reviews" && (
                                        <div>
                                            <UserReviews reviews={[]} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="my-10"></div>
                        <TravelmateApp />
                    </div>

                    <div className="my-10"></div>
                    <Footer />
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