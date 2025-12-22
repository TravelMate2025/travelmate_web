import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Info, Loader } from "lucide-react";
import { useState } from "react";
import Complete from "./Complete";
import { DeskProps } from "./Page";
import { ToastContainer } from "react-toastify";
import CountryCodeModal from "../../stays/components/modals/CountryCodeModal";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import FirstStep from "./components/FirstStep";
import PersonalInfo from "./components/PersonalInfo";
import PaymentMethod from "./components/PaymentMethod";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    borderTopWidth: 3,
    borderColor: theme.palette.grey[400],
    transition: "border-color 0.3s ease-in-out",
  },
  [`&.Mui-completed .MuiStepConnector-line`]: {
    borderColor: "#023E8A",
  },
  [`&.Mui-active .MuiStepConnector-line`]: {
    borderColor: "#023E8A",
  },
}));

const MobilePage = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  handleConfirm,
  isFormValids,
  handleSubmit,
  passFormData,
  setPassFormData,
  loadingSubmit,
  isTheFormValid,
  state,
  setState,
  handleChange,
  errors,
  submitted,
  handleCheckboxChange,
  handleChangePayment,
  handleBlur,
  formData,
  isFormValid,
  setIsTheFormValid,
}: DeskProps) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { car, departureInfo } = location.state || {};
  const [countryModal, setCountryModal] = useState(false);

  return (
    <div>
      <ToastContainer />
      {showAllModal && (
        <Complete closeDialog={() => setShowAllModal(false)} car={car} />
      )}
      {countryModal && (
        <CountryCodeModal
          closeDialog={() => setCountryModal(false)}
          formData={passFormData}
          setFormData={setPassFormData}
        />
      )}

      <div className="mt-4">
        <div className="lg:pt-20 pt-20 mb-6 flex justify-normal items-center px-6 gap-8">
          <div className=" p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <ArrowBackIosNewOutlinedIcon
              onClick={handleBack}
              className="font-bold cursor-pointer"
            />
          </div>
          <p className="text-center font-medium text-sm ">
            {steps[activeStep]}
          </p>
        </div>
        <Box sx={{ width: "100%" }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={<CustomConnector />}
          >
            {steps.map((label: any, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      "& .MuiStepConnector-line": {
                        borderColor: index < activeStep ? "#007BFF" : "#D3D3D3",
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        {!accessToken && (
          <div className="flex items-center gap-3 bg-red-50 p-2 rounded-md m-2 border border-[#D72638] mx-3 my-6">
            <Info stroke="#D72638" />
            <p className="text-[#181818] text-xs font-sans">
              To continue your booking, please create an account or log in.
            </p>
          </div>
        )}
        {/* FIRST STEP  */}
        {activeStep === 0 && (
          <FirstStep
            car={car}
            departureInfo={departureInfo}
            setShowAllModal={setShowAllModal}
          />
        )}

        {/* SECOND STEP*/}
        {activeStep === 1 && (
          <PersonalInfo
            setCountryModal={setCountryModal}
            passFormData={passFormData}
            setPassFormData={setPassFormData}
            state={state}
            setState={setState}
            handleChange={handleChange}
            submitted={submitted}
            errors={errors}
            handleBack={handleBack}
            handleNext={handleNext}
            handleConfirm={handleConfirm}
            handleCheckboxChange={handleCheckboxChange}
            handleChangePayment={handleChangePayment}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            setIsTheFormValid={setIsTheFormValid}
            isFormValids={isFormValids}
            isTheFormValid={isTheFormValid}
            steps={steps}
            activeStep={activeStep}
            formData={formData}
            handleBlur={handleBlur}
          />
        )}

        {/* THIRD STEP */}
        {activeStep === 2 && (
          <PaymentMethod
            car={car}
            passFormData={passFormData}
            setPassFormData={setPassFormData}
            state={state}
            setState={setState}
            handleChange={handleChange}
            submitted={submitted}
            errors={errors}
            handleBack={handleBack}
            handleNext={handleNext}
            handleConfirm={handleConfirm}
            handleCheckboxChange={handleCheckboxChange}
            handleChangePayment={handleChangePayment}
            handleSubmit={handleSubmit}
            isFormValid={isFormValid}
            setIsTheFormValid={setIsTheFormValid}
            isFormValids={isFormValids}
            isTheFormValid={isTheFormValid}
            steps={steps}
            activeStep={activeStep}
            formData={formData}
            handleBlur={handleBlur}
          />
        )}

        {/* BUTTONS  */}
        {activeStep === 2 ? (
          <div className="mx-6 my-6 flex items-center justify-center">
            <button
              className={`flex items-center justify-center gap-5 w-full lg:w-96 text-white bg-[#023E8A] h-[56px] rounded-[6px] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed
                `}
              disabled={!isFormValids || loadingSubmit}
              onClick={handleSubmit}
            >
              <span>Pay with Stripe</span>
              {loadingSubmit && (
                <Loader className="animate-spin " stroke="#ffffff" />
              )}
            </button>
          </div>
        ) : (
          <div className="mx-6 mb-20 flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-5 w-full lg:w-96 text-white h-[56px] rounded-[6px] cursor-pointer bg-[#023E8A]  disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                !accessToken ||
                loadingSubmit ||
                (activeStep === 1 && !isTheFormValid)
              }
              onClick={() => {
                activeStep === 0 ? handleNext() : handleConfirm();
              }}
            >
              <span>Continue</span>
              {loadingSubmit && (
                <Loader className="animate-spin " stroke="#ffffff" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePage;
