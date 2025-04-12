
// import { useLocation, useNavigate  } from "react-router-dom";
// import { useEffect, useState } from "react";

// import Breadcrumbs from "../components/Breadcrumbs";
// import UserOptionsStacked from "../components/UserOptionsStacked";
// import BasicInfo from "../components/BasicInfo";
// import EditBasicInfoModal from "../components/modals/EditBasicInfoModal";
// import EditContactInfoModal from "../components/modals/EditContactInfoModal";
// import DeleteAccountModal from "../components/modals/DeleteAccountModal";
// import Navbar from "./homePage/Navbar";
// import TravelmateApp from "./homePage/TravelmateApp";
// import Footer from "../components/2Footer";
// import PaymentMethods from "./PaymentMethods";
// import NotificationMethod from "./NotificationMethod";
// import { useMediaQuery } from "react-responsive";

// export default function ProfileInfo() {
//   const isMobile = useMediaQuery({ maxWidth: 768 });
//    const navigate = useNavigate();
//   const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
//   const [showContactInfoModal, setShowContactInfoModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const [activeTab, setActiveTab] = useState("Profile"); // 👈 Track active tab

//   const breadcrumbs = [
//     { name: "Home", link: "/" },
//     { name: "Account", link: "/profile" },
//     { name: activeTab },
//   ];

//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const tabFromQuery = queryParams.get("tab");


//   useEffect(() => {
//     if (tabFromQuery) {
//       setActiveTab(tabFromQuery);
//     }
//   }, [tabFromQuery]);

//    const handleOptionClick = (tab: string) => {
//     setActiveTab(tab); // Make sure setActiveTab is defined in this component
//     navigate(`/profile-info?tab=${encodeURIComponent(tab)}`);
//   };

//   return (

//     <div>

//        {isMobile ? (

//             ""

//              ) : (

//     <div className="h-screen flex flex-col">
//       <Navbar />
//      <div className="my-10"></div>
//       <Breadcrumbs items={breadcrumbs} />
     

         

//               <div>
               
//                <div className="w-[95%] m-auto">
//      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row ">
//   {/* Sidebar */}
//   <div className="w-full md:w-1/3">
//     <UserOptionsStacked activeTab={activeTab} handleOptionClick={handleOptionClick} />
//   </div>

//   {/* Tab Content */}
//   <div className="w-full md:w-2/3 space-y-6">
//     {activeTab === "Profile" && (
//       <>
//         <BasicInfo
//           title="Basic Information"
//           fields={[
//             { label: "Name", value: "Elvis Igiebor" },
//             { label: "Gender", value: "Not Provided" },
//             { label: "Date of Birth", value: "Not Provided" },
//           ]}
//           onEdit={() => setShowBasicInfoModal(true)}
//         />
//         <BasicInfo
//           title="Contact Information"
//           fields={[
//             { label: "Email Address", value: "elvis@gmail.com" },
//             { label: "Mobile Number", value: "Not Provided" },
//             { label: "Address", value: "Not Provided" },
//           ]}
//           onEdit={() => setShowContactInfoModal(true)}
//         />
//         <button
//           className="w-full py-3 my-5 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
//           onClick={() => setShowDeleteModal(true)}
//         >
//           Delete Account
//         </button>
//       </>
//     )}

//     {activeTab === "Payment Method" && (
//       <div className="space-y-4">
//         <PaymentMethods />
//       </div>
//     )}

//     {activeTab === "Notifications" && (
//       <div>
//        <NotificationMethod />
//       </div>
//     )}

//     {activeTab === "Security" && (
//       <div>
//         <h2 className="text-2xl font-semibold">Security</h2>
//         <p className="text-gray-600">Change your password, enable 2FA, etc.</p>
//       </div>
//     )}

//     {activeTab === "Reviews" && (
//       <div>
//         <h2 className="text-2xl font-semibold">Reviews</h2>
//         <p className="text-gray-600">View and manage your reviews.</p>
//       </div>
//     )}
//   </div>
// </div>

//               </div>

//                <div className="my-10"></div>
//                 <TravelmateApp />
//               </div>
      
     


     
//       <div className="my-10"></div>
//       <Footer />

//             )}   

//       {/* Modals */}
//       <EditBasicInfoModal
//         isOpen={showBasicInfoModal}
//         onClose={() => setShowBasicInfoModal(false)}
//       />
//       <EditContactInfoModal
//         isOpen={showContactInfoModal}
//         onClose={() => setShowContactInfoModal(false)}
//       />
//       <DeleteAccountModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onDelete={() => console.log("Account Deleted")}
//       />
//     </div>
//     </div>
//   );
// }


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

export default function ProfileInfo() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/profile" },
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

  return (
    <div>
      {isMobile ? (


         <div className="h-screen flex flex-col">
          <Navbar />
          <div>
            <div className="w-[95%] m-auto">
              <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row">
           
                <div className="w-full md:w-2/3 space-y-6">
                  {activeTab === "Profile" && (
                    <>
                      <BasicInfo
                        title="Basic Information"
                        fields={[
                          { label: "Name", value: "Elvis Igiebor" },
                          { label: "Gender", value: "Not Provided" },
                          { label: "Date of Birth", value: "Not Provided" },
                        ]}
                        onEdit={() => setShowBasicInfoModal(true)}
                      />
                      <BasicInfo
                        title="Contact Information"
                        fields={[
                          { label: "Email Address", value: "elvis@gmail.com" },
                          { label: "Mobile Number", value: "Not Provided" },
                          { label: "Address", value: "Not Provided" },
                        ]}
                        onEdit={() => setShowContactInfoModal(true)}
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
                      <h2 className="text-2xl font-semibold">Reviews</h2>
                      <p className="text-gray-600">View and manage your reviews.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
       
          </div>

          <div className="mt-30">
          <Footer  />
          </div>
        </div>
        


      ) : (
        <div className="h-screen flex flex-col">
          <Navbar />
          <div className="my-10"></div>
          <Breadcrumbs items={breadcrumbs} />

          <div>
            <div className="w-[95%] m-auto">
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
                          { label: "Name", value: "Elvis Igiebor" },
                          { label: "Gender", value: "Not Provided" },
                          { label: "Date of Birth", value: "Not Provided" },
                        ]}
                        onEdit={() => setShowBasicInfoModal(true)}
                      />
                      <BasicInfo
                        title="Contact Information"
                        fields={[
                          { label: "Email Address", value: "elvis@gmail.com" },
                          { label: "Mobile Number", value: "Not Provided" },
                          { label: "Address", value: "Not Provided" },
                        ]}
                        onEdit={() => setShowContactInfoModal(true)}
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
                      <h2 className="text-2xl font-semibold">Reviews</h2>
                      <p className="text-gray-600">View and manage your reviews.</p>
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
      />
      <EditContactInfoModal
        isOpen={showContactInfoModal}
        onClose={() => setShowContactInfoModal(false)}
      />
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => console.log("Account Deleted")}
      />
    </div>
  );
}
