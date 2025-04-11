


import { useState } from "react";
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

export default function ProfileInfo() {
  const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [activeTab, setActiveTab] = useState("Profile"); // 👈 Track active tab

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/profile" },
    { name: activeTab },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="my-10"></div>
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Content */}
      <div className="w-[95%] m-auto">
     <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row ">
  {/* Sidebar */}
  <div className="w-full md:w-1/3">
    <UserOptionsStacked activeTab={activeTab} onOptionClick={setActiveTab} />
  </div>

  {/* Tab Content */}
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

    {activeTab === "Payment Method" && (
      <div className="space-y-4">
        <PaymentMethods />
      </div>
    )}

    {activeTab === "Notifications" && (
      <div>
       <NotificationMethod />
      </div>
    )}

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
      <div className="my-10"></div>
      <Footer />

      {/* Modals */}
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
