import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import UserOptionsStacked from "../components/UserOptionsStacked";
import BasicInfo from "../components/BasicInfo";
import Footer from "../pages/homePage/Footer"
import EditBasicInfoModal from "../components/modals/EditBasicInfoModal";
import EditContactInfoModal from "../components/modals/EditContactInfoModal";
import DeleteAccountModal from "../components/modals/DeleteAccountModal";
import Navbar from "./homePage/Navbar";
import TravelmateApp from "./homePage/TravelmateApp";

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
            <Navbar />
            <div className="my-10"></div>
            <Breadcrumbs items={breadcrumbs} />

            {/* Main Content */}
            <div className="flex flex-col md:flex-row max-w-[1280px] mx-auto mt-6 gap-4 md:gap-6 px-4 md:px-0">
                {/* Sidebar */}
                <div className="w-full md:w-1/3">
                    <UserOptionsStacked />
                </div>

                {/* Profile Info Section */}
                <div className="w-full md:w-2/3 space-y-6">
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

            {/* Download App & Footer */}
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
