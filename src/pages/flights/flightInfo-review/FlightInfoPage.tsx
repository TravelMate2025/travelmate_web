
import Navbar from "../../homePage/Navbar";



import Footer from "../../../components/2Footer";
import Step1 from "../../../features/flights/components/Steps/Step1";
import Step2 from "../../../features/flights/components/Steps/Step2";
import Step3 from "../../../features/flights/components/Steps/Step3";
import StepLayout, { useStepContext } from "../../../features/flights/components/Steps/StepLayout";




const StepContent = () => {
  const { activeStep } = useStepContext();
  const getContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2/>
      case 2:
        return <Step3/>
      default:
        return null;
    }
  };
  return <div>{getContent()}</div>;
};

const FlightInfoPage = () => {



  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex-1 my-24 w-[90%] mx-auto">
      
        <StepLayout>
          <StepContent />
        </StepLayout>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default FlightInfoPage;
