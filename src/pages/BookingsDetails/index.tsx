import Breadcrumbs from "../../components/Breadcrumbs";
import Navbar from "../homePage/Navbar";
import Footer from "../../components/2Footer";
// import BookingStaysDetails from "./stays";
// import BookingTransfersDetails from "./transfers";
// import BookingConfirmationPage from "../../features/stays/pages/BookingConfirmationPage";


const BookingDetails = () => {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Bookings", link: "/bookings" },
    { name: "Booking Details" },
  ];
  return (
    <div className="mt-24">
      <Navbar />
      <Breadcrumbs items={breadcrumbs} />
      {/* <BookingConfirmationPage /> */}
      <Footer />
    </div>
  );
};

export default BookingDetails;
