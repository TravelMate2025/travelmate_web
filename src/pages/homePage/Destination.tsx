import { useRef } from "react";
import Lagos from "../../assets/lagos.svg"
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useMediaQuery } from "react-responsive";




const Destination = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-[90%] m-auto">
        {isMobile ? (

           <div className="mt-[6px]">
        <div className="flex justify-between">
          <div>
            <p className="text-[16px] font-semibold font-inter text-[#181818]">
              Popular Destinations
            </p>
            <p className="font-normal text-[#4E4F52] font-inter text-[14px]">
              Most explored States
            </p>
          </div>
        </div>

       
        <div className="mt-[10px] w-full overflow-x-auto relative">
          <div 
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}  
            className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
          >
            {[...Array(10)].map((_, index) => (
              <div key={index} className="w-[250px] flex-shrink-0">
                <img src={Lagos} alt="Lagos image" className="w-full h-auto object-cover" />
                <p className="text-[14px] font-semibold font-inter text-[#181818]">
                  Lagos State
                </p>
                <p className="font-normal text-[12px] text-[#4E4F52] font-inter">
                  100 Properties
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

           ) : (

            // web view

  
      <div className="mt-[100px]">
        <div className="flex justify-between">
          <div>
            <p className="text-[24px] font-semibold font-inter text-[#181818]">
              Popular Destinations
            </p>
            <p className="font-normal text-[#4E4F52] font-inter">
              Most explored States
            </p>
          </div>

          {/* Scroll Buttons */}
          <div className="flex gap-[34px]">
            <div 
              onClick={scrollLeft} 
              className="w-[44px] h-[44px] cursor-pointer bg-white border border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
            >
              <KeyboardArrowLeftOutlinedIcon className="scale-150" />
            </div>

            <div 
              onClick={scrollRight} 
              className="w-[44px] h-[44px] bg-white border cursor-pointer border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
            >
              <KeyboardArrowRightOutlinedIcon className="scale-150" />
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="mt-[38px] w-full overflow-x-auto relative">
          <div 
            ref={scrollContainerRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}  
            className="flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
          >
            {[...Array(10)].map((_, index) => (
              <div key={index} className="w-[250px] flex-shrink-0">
                <img src={Lagos} alt="Lagos image" className="w-full h-auto object-cover" />
                <p className="text-[14px] font-semibold font-inter text-[#181818]">
                  Lagos State
                </p>
                <p className="font-normal text-[12px] text-[#4E4F52] font-inter">
                  100 Properties
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
       )}
    </div>
  );
};

export default Destination;
