import { useState } from "react";
import Navbar from "../components/2Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import UserOptionsStacked from "../components/UserOptionsStacked";
import BasicInfo from "../components/BasicInfo";
// import TravelmateApp from "./homePage/TravelmateApp";
import DownloadApp from "../components/2DownloadApp";
import Footer from "../components/2Footer";
import EditBasicInfoModal from "../components/modals/EditBasicInfoModal";
import EditContactInfoModal from "../components/modals/EditContactInfoModal";
import DeleteAccountModal from "../components/modals/DeleteAccountModal";


export default function ProfileInfo() {
    const [showBasicInfoModal, setShowBasicInfoModal] = useState(false);
    const [showContactInfoModal, setShowContactInfoModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const breadcrumbs = [
        { name: "Home", link: "/" },
        { name: "Account", link: "/profile" },
        { name: "Profile" },
    ];

    return (
        <div className="h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex max-w-[1280px] mx-auto mt-6 gap-6">
            <div className="w-2/4">
            <UserOptionsStacked />
            </div>

            <div className="w-3/4 space-y-6">
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

            {/* Delete Account Button */}
            <button
                className="w-full py-3 my-5 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
                onClick={() => setShowDeleteModal(true)}
                >
                Delete Account
            </button>
            </div>
        </div>
        {/* <TravelmateApp /> */}
            <div className="m-10"></div>
            <DownloadApp />
            <div className="m-10"></div>
            <Footer />

        <EditBasicInfoModal isOpen={showBasicInfoModal} onClose={() => setShowBasicInfoModal(false)} />
        <EditContactInfoModal isOpen={showContactInfoModal} onClose={() => setShowContactInfoModal(false)} />
        <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={() => console.log("Account Deleted")} />
    
    </div>
  );
}
