import { useCallback, useEffect } from "react";
import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { InfoProvider } from "../features/account/api/info";

export function AboutPage() {

  const getAbout = useCallback(async()=>{
    try {
      const res = await InfoProvider.getAboutDetails()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  },[])
  
  useEffect(()=>{
    getAbout
  },[getAbout])
  return (
    <>
      <Navbar />
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-6 lg:space-y-8">
        <div>
          <p className="text-[#181818] hidden lg:block text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            About TravelMate
          </p>
          <p className="text-[#181818] lg:hidden text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            About Us
          </p>
          <p className="text-sm lg:text-lg mt-2">
            At TravelMate, we make travel seamless and stress-free. Whether
            you're booking flights, finding the perfect stay, or renting a car,
            we provide a one-stop solution for all your travel needs. With an
            easy-to-use platform and a commitment to customer satisfaction,
            TravelMate ensures that every journey is smooth, affordable, and
            memorable. Wherever you're headed, let TravelMate be your trusted
            travel companion.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
