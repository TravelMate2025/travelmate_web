import { Link } from "react-router-dom";
import Navbar from "../homePage/Navbar";
import Footer from "../../components/2Footer";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import notFound from "../../assets/offerNot.svg"

const NotFound = () => {
  return (
    <div>
      <Navbar />
      <div className="lg:pt-24 pt-20">
        <div className="flex justify-normal items-center gap-2 cursor-pointer lg:pl-16 pl-10 border-b border-b-neutral-200 pb-5">
          <Link
            to="/bookings"
            className=" p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] "
          >
            <ArrowBackIosNewOutlinedIcon />
          </Link>
          <p>Back to Bookings</p>
        </div>
        <main className="flex flex-col gap-3 items-center justify-center mt-20 lg:px-32 px-8 text-center">
          <img src={notFound} alt="failure" className="w-24 h-24" />
          <h3 className="text-lg lg:text-2xl font-semibold">
            Booking Not found
          </h3>
          <p className="text-neutral-600">
            Unfortunately, that didnt bring up anything
          </p>
          <button className="rounded-lg cursor-pointer p-2 w-[inherit] min-w-full text-[#023E8A] border border-[#023E8A]">
            <Link to="/bookings">Back to Bookings</Link>
          </button>
        </main>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;
