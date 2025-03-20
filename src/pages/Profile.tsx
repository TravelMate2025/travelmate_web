import Navbar from "../components/2Navbar";
import Breadcrumbs from "../components/Breadcrumbs"
import UserData from "../components/UserData";
import UserOptions from "../components/UserOptions";
import DownloadApp from "../components/2DownloadApp";
import Footer from "../components/2Footer";

export default function Profile() {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col items-center mt-8">
        <UserData name="Elvis" email="elvis@example.com" />
      </div>
      <UserOptions />
      <div className="m-10"></div>
      <DownloadApp />
      <div className="m-10"></div>
      <Footer />
    </div>
  );
}
