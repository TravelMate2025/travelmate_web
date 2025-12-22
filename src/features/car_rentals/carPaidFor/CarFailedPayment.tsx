import Footer from "../../../components/2Footer";
import Navbar from "../../../pages/homePage/Navbar";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import FailedIcon from "../../../assets/offerNot.svg";
import { Link } from "react-router";
const CarFailedPayment = () => {
  return (
    <div>
      <Navbar />
      <div className="lg:pt-24 pt-20">
        <div className="flex justify-normal items-center gap-2 cursor-pointer lg:pl-16 pl-10 border-b border-b-neutral-200 pb-5">
          <Link
            to="/"
            className=" p-[8px] bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] "
          >
            <ArrowBackIosNewOutlinedIcon />
          </Link>
          <p>Back to Home</p>
        </div>
        <main className="flex flex-col gap-3 items-center justify-center mt-20 lg:px-32 px-8 text-center">
          <img src={FailedIcon} alt="failure" className="w-24 h-24" />
          <h3 className="text-lg lg:text-xl font-semibold">Payment Failed!</h3>
          <p className="text-neutral-600">
            Unfortunately, we couldn't process your payment. This could be due
            to insufficient funds, incorrect card details, or your bank
            declining the transaction.
          </p>
          <p className="text-neutral-600">
            Your booking has not been confirmed. Please try again to complete
            your payment.
          </p>

          <button
            className="rounded-lg cursor-pointer p-2 w-[inherit] min-w-full hover:bg-[#598fd6] bg-[#023E8A] border-0 outline-0 text-white mt-12"
            onClick={() => window.location.reload}
          >
            Try Again
          </button>
          <button className="rounded-lg cursor-pointer p-2 w-[inherit] min-w-full text-[#023E8A] border border-[#023E8A]">
            <Link to="/">Back to home</Link>
          </button>
        </main>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default CarFailedPayment;
