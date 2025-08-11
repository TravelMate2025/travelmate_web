import Breadcrumbs from "../../../components/Breadcrumbs"
import UserData from "../components/UserData";
import UserOptions from "../components/UserOptions";
import Footer from "../../../components/2Footer";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import Navbar from "../../../pages/homePage/Navbar";

export default function Profile() {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="my-10"></div>
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col items-center mt-8">
        <UserData />
      </div>
      <UserOptions />
      <div className="m-10"></div>
      <TravelmateApp />
      <div className="m-10"></div>
      <Footer />
    </div>  
  );
}
