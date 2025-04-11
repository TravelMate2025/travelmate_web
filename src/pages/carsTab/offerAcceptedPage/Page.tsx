
import React, {useState, useEffect} from 'react'
import Navbar from '../../homePage/Navbar';
import { Card, Rating, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import SpeedIcon from '@mui/icons-material/Speed';
import carImage from "../../../assets/carImage.svg";
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import circle from "../../../assets/circle.svg"
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Divider, InputAdornment, TextField, FormControlLabel } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import Switch from '@mui/material/Switch';
import {Checkbox } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import master from "../../../assets/master.svg";
import visa from "../../../assets/visa.svg"
import { Link } from 'react-router-dom';
import Footer from "../../../components/2Footer"
import { useMediaQuery } from "react-responsive";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";


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

const Page = () => {

    const steps = [
  'Booking Overview',
  'Passenger Information',
  'Passenger Details',
];

const isMobile = useMediaQuery({ maxWidth: 768 });
    const carList = [
            {
            id: 1,
              image: carImage,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <LuggageOutlinedIcon />,
              speed:<SpeedIcon />,
              spaceleft: "3 Seats",
              full: "4 Bags",
              refundable: "Full refund if cancelled 24 hours before pick up",
              noShows:"Cancellation allowed 24 hours before pick up",
              perDay:"Price",
              price: "₦14,000",
              button:"Select Car",
            }
    ];
 const value = 4.5;

     const [state, setState] = useState({
     gilad: true,
     jason: false,
     antoine: true,
   });
 
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setState({
       ...state,
       [event.target.name]: event.target.checked,
     });
   };
 

     const [formData, setFormData] = useState({
       cardNumber: "",
       cardHolder: "",
       expiryDate: "",
       cvv: "",
       agreement: false,
     });
   
     const [touched, setTouched] = useState({
     cardNumber: false,
     cardHolder: false,
     expiryDate: false,
     cvv: false,
   });
   
   
   const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name } = e.target;
     setTouched((prev) => ({ ...prev, [name]: true }));
   };
   
   
     const [errors, setErrors] = useState({
       cardNumber: false,
       cardHolder: false,
       expiryDate: false,
       cvv: false,
     });
   
     const validateFields = () => {
       const newErrors = {
         cardNumber: formData.cardNumber.length !== 16,
         cardHolder: formData.cardHolder.trim() === "",
         expiryDate: formData.expiryDate === "",
         cvv: formData.cvv.length !== 3,
       };
   
       setErrors(newErrors);
   
       return !Object.values(newErrors).includes(true);
     };
   
   
   const handleChangePayment = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
   };
   
   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData((prev) => ({ ...prev, agreement: e.target.checked }));
   };
   
   const [isFormValid, setIsFormValid] = useState(false);
   
   
   useEffect(() => {
     setIsFormValid(validateFields() && formData.agreement);
   }, [formData]);
   
   const handleSubmit = () => {
     if (isFormValid) {
       console.log("Form submitted successfully!");
     } else {
       console.log("Form has errors, please fix them.");
     }
   };
   
    const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };


  const [passFormData, setPassFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
});

const [isTheFormValid, setIsTheFormValid] = useState(false);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  setPassFormData((prev) => ({
    ...prev,
    [id]: value,
  }));
};


useEffect(() => {
  // Validation: Check if all fields are filled
  const isValid =
    passFormData.firstName.trim() !== "" &&
    passFormData.lastName.trim() !== "" &&
    passFormData.email.trim() !== "" &&
    /\S+@\S+\.\S+/.test(passFormData.email) && // Email validation
    passFormData.phoneNumber.trim() !== "" &&
    /^\d+$/.test(passFormData.phoneNumber) && // Ensures phone is numbers only
    passFormData.dateOfBirth.trim() !== "";

  setIsTheFormValid(isValid);
}, [passFormData]);


const isFormValids =
  !errors.cardNumber &&
  !errors.cardHolder &&
  !errors.expiryDate &&
  !errors.cvv &&
  formData.cardNumber &&
  formData.cardHolder &&
  formData.expiryDate &&
  formData.cvv;


  return (
    <div>
        <div><Navbar/></div>
       <div>
         {isMobile ? (

        <div>

        <div className="mt-4">
        {activeStep === 0 && 
        <div>

        <div className="mb-6 ">
            <div style={{ position: "absolute", left: "28px", top: "76px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <ArrowBackIosNewOutlinedIcon onClick={handleBack} className="font-bold " />
            </div>
            <p className="text-center font-medium text-[20px]  mt-[80px]">{steps[activeStep]}</p>
        </div>

            <div>
                <div>
                     <Box sx={{ width: "100%" }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel
                        StepIconProps={{
                            sx: {
                            color: index <= activeStep ? "#023E8A" : "#D3D3D3", // Active/Completed = Blue, Inactive = Grey
                            // fontSize: "16px",
                            "& .MuiSvgIcon-root": {
                                backgroundColor: index <= activeStep ? "#023E8A" : "#D3D3D3", // Change background color
                                color: "#fff", // White text inside step icon
                            
                            
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

               
                </div>

        <div className='mb-[20px] mt-[20px] w-[90%] m-auto'>

            <div className='border-1  border-[#023E8A] w-full bg-[#CCD8E81A] pt-[10px] pb-[10px] pr-[10px] pl-[10px] rounded-[8px]'>

            <div className='flex gap-1'>
                <div>
                     <div><ErrorOutlineIcon className=' text-[#023E8A] mt-[-4px]' /></div>
                </div>
                <div className='text-[#181818] text-[14px]'>Cancellation allowed 24 hours before pick up</div>
            </div>

            </div>
        </div>

            <div className="flex gap-[8px] justify-between w-[90%] m-auto ">
                <div className='flex gap-[4px]'>
                  <img src={circle} alt="" className="w-[50px] h-[50px]" />
                  <div >
                    <div className="flex gap-[2px] mt-[4px]">
                    <p className="mt-[2px] text-[#181818] text-[14px]">Elvis</p>
                      <div>
                        <Stack direction="row">
                            <Rating value={1} max={1} readOnly sx={{ fontSize: "14px", marginTop:"5px" }} />
                            <Typography variant="body1" sx={{ fontSize: "14px", marginTop:"2px" }}>
                            {value}
                            </Typography>
                        </Stack>
                        </div>

                  </div >
                     <div className="mt-[2px]">
                      <p className="text-[#67696D] text-[14px] ">Red Toyota Corolla</p>
                    </div>
                    </div>
                  </div>
                     <div className="">
                        {carList.map((car) => (
                        <div key={car.id} className="flex justify-between gap-[8px]">
                            <div className="">
                            <img src={car.image} alt="" className="h-[70px] w-[50px] mt-[-8px]" />
                            </div>
                        </div>
                        ))}
                    </div>
            </div>

            <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />

        
                    <div className="w-[90%] m-auto">
                                    <p className="text-[16px] font-inter font-medium text-[#181818]">Trip Details</p>
                                    <div className=" mt-[10px]">
                                        <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <div>
                                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up location</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[14px] font-inter">Ikeja</p></div>
                                        </div>
                
                
                                            <div className="flex justify-between">
                                            <div>
                                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up Date</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[14px] font-inter">Feb 10, 2025</p></div>
                                        </div>

                                           <div className="flex justify-between">
                                            <div>
                                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Pick Up Time</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[14px] font-inter">3:30 PM</p></div>
                                        </div>


                                           <div className="flex justify-between">
                                            <div>
                                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Drop Off Location</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[14px] font-inter">Victoria Island</p></div>
                                        </div>
                                        </div>
                                    </div>
                    </div>
            <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />



             <div className="w-[90%] m-auto">
                            <p className="text-[16px] font-inter font-medium text-[#181818]">Car Details</p>
                            <div className=" mt-[10px]">
                            <div className="flex flex-col gap-1">
                            <div className="flex justify-between">
                            <div>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Type</p>
                            </div>
                            <div><p className="text-[#181818] text-[14px] font-inter">Red Toyota Corolla</p></div>
                            </div>
                                    
                            <div className="flex justify-between">
                            <div>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Seats</p>
                            </div>
                            <div>
                            <p className="text-[14px] text-[#181818]">3 Seats</p>
                            </div>
                            </div>
                    
                                <div className="flex justify-between">
                                <div>
                                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Luggages</p>
                                </div>
                                <div><p className="text-[#181818] text-[14px] font-inter">Up to 4 Luggages</p></div>
                                </div>

                                  <div className="flex justify-between">
                                <div>
                                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Plate Number</p>
                                </div>
                                <div><p className="text-[#181818] text-[14px] font-inter">AA1234FT</p></div>
                                </div>
                                </div>
                            </div>
            </div>
            <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />


              <div className="w-[90%] m-auto">
                    <p className="text-[16px] font-inter font-medium text-[#181818]">Driver Details</p>
                    <div className=" mt-[10px]">
                    <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                    <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Name</p>
                    </div>
                    <div><p className="text-[#181818] text-[14px] font-inter">Elvis Igiebor</p></div>
                    </div>
                
                
                    <div className="flex justify-between">
                    <div>
                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Rating</p>
                    </div>
                    <div>
                    <Stack direction="row">
                    <Rating value={1} max={1} readOnly sx={{ fontSize: "14px", marginTop:"5px" }} />
                    <Typography variant="body1" sx={{ fontSize: "14px", marginTop:"2px" }}>
                    {value}
                    </Typography>
                    </Stack>
                    </div>

                </div>

                <div className="flex justify-between">
                <div>
                <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Phone Number</p>
                </div>
                <div><p className="text-[#181818] text-[14px] font-inter">090123456782</p></div>
                </div>
                </div>
                </div>
            </div>

             <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />

               <div className="w-[90%] m-auto">
                    <p className="text-[16px] font-inter font-medium text-[#181818]">Price Summary</p>
                    <div className="mt-[10px]">
                        <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                        <div>
                        <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Total</p>
                        </div>
                        <div><p className="text-[#181818] text-[14px] font-inter">₦40,000</p></div>
                        </div>
                        </div>
                        </div>
                    </div>

                <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />


                <div className='w-[90%] m-auto'>
                         <p className="text-[16px] font-inter font-medium text-[#181818]">Refunds and Cancellations
                            
                         </p>
                         <div className='mt-[10px]'>
                                <div>
                                    <div className='flex gap-4 mb-[10px]'>
                                        <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"8px"}}/>
                                        <p>Cancellations allowed 24 hours before pick Up</p>
                                    </div>
                                </div>

                                  <div>
                                    <div className='flex gap-4'>
                                        <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"8px"}}/>
                                        <p>Full refund if cancelled 24 hours before pick up</p>
                                    </div>
                                </div>
                         </div>
                </div>

                <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />


                <Divider sx={{marginTop:"60px", marginBottom:"20px"}} />

                   {/* <Link to="/car-payment-successful"> */}
                    <div className="w-[90%] m-auto mb-20">
                        <button
                        className="w-full text-white h-[56px] rounded-[6px] cursor-pointer bg-[#023E8A]"
                        // disabled={!isFormValid}
                        onClick={handleNext} 
                        disabled={activeStep === steps.length - 1}
                        >
                        {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                        </button>
                    </div>
                    {/* </Link> */}

            </div>

              
              <Footer/>
        </div>
        }

        
        {activeStep === 1 && 
        <div>

        <div className="mb-6 ">
            <div style={{ position: "absolute", left: "28px", top: "76px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <ArrowBackIosNewOutlinedIcon onClick={handleBack} className="font-bold " />
            </div>
            <p className="text-center font-medium text-[20px]  mt-[80px]">{steps[activeStep]}</p>
        </div>

        <div>

               <Box sx={{ width: "100%" }}>
                 <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    connector={<CustomConnector />}
                >
                    {steps.map((label, index) => (
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

                <Divider sx={{marginTop:"8px", marginBottom:"8px"}} />

                <div className='w-[90%] m-auto'>
                         <div className=' mt-[10px]'>
        
                         <div>
                            <div>
                                <div className='flex justify-between gap-6 w-[100%]'>
                                <div className='text-start '>
                                    <p className='text-[17px] font-inter font-medium text-[#181818]'>Use my Profile Information</p>
                                    <p className='text-[#4E4F52] font-normal text-[14px]'>The fields will be automatically field based on your information with us</p>
                                </div>

                    <div className="">
                    <FormControlLabel
                        className="w-full "
                        control={<Switch checked={state.jason} onChange={handleChange} name="jason"  />}
                        label=""
                    />
                    </div>

                        </div>

                               
                                <Divider sx={{marginBottom:"16px", marginTop:"16px"}} />


                                <p className="text-[20px] font-inter font-semibold text-[#181818] text-start">Primary Driver</p>

                                <div className='flex-col gap-4 w-full'> 
                                    <div className="flex-1 ">
                                        <div className='flex flex-col mt-[10px] mb-[10px]'>     
                                            <label htmlFor="firstName" className="mb-1 text-[16px] text-start font-medium">First Name</label>
                                            <TextField
                                                id="firstName"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter First Name"
                                                 value={passFormData.firstName}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>


                                            <div className='flex flex-col mt-[10px] mb-[10px]'>     
                                            <label htmlFor="lastName" className="mb-1 text-[16px] text-start font-medium">Last Name</label>
                                            <TextField
                                                id="lastName"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Last Name"
                                                value={passFormData.lastName}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>

                                        <div className='flex flex-col mb-[10px]'>     
                                            <label htmlFor="email" className="mb-1 text-[16px] text-start font-medium">Email Address</label>
                                            <TextField
                                                id="email"
                                                variant="outlined"
                                                size="small"
                                                placeholder="name@email.com"
                                                 value={passFormData.email}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                    

                                        <div className='flex flex-col mb-[10px]'>     
                                            <label htmlFor="phoneNumber" className="mb-1 text-[16px] text-start font-medium">Phone Number</label>
                                            <TextField
                                                id="phoneNumber"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Phone Number"
                                                 value={passFormData.phoneNumber}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>


                                 <div className='flex flex-col'>     
                                            <label htmlFor="dateOfBirth" className="mb-1 text-[16px] text-start font-medium">Date Of Birth</label>
                                            <TextField
                                                id="dateOfBirth"
                                                type='date'
                                                variant="outlined"
                                                size="small"
                                                placeholder=""
                                                 value={passFormData.dateOfBirth}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                    <DateRangeOutlinedIcon />
                                                    </InputAdornment>
                                                ),
                                                }}
                                                sx={{
                                                width: "100%",
                                                
                                                "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                                                }}
                                            />
                                </div>
                                        

                            </div>
                         </div>
                         </div>
                </div>


                <Divider sx={{marginTop:"60px", marginBottom:"20px"}} />


                   <div className="w-[90%] m-auto mb-20">
                       <button
                        className={`w-full text-white h-[56px] rounded-[6px] ${
                            isTheFormValid ? "bg-[#023E8A]" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isTheFormValid}
                        onClick={handleNext}
                        >
                        {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                        </button>
                    </div>

        </div>

        <Footer />

        </div>
        }




        {activeStep === 2 && 
        <div>

             <div className="mb-6 ">
            <div style={{ position: "absolute", left: "28px", top: "76px" }} className="w-[40px] h-[40px] p-[8px]  bg-white border-[0.5px] border-[#EBECED] shadow-md rounded-[4px] ">
            <ArrowBackIosNewOutlinedIcon onClick={handleBack} className="font-bold " />
            </div>
            <p className="text-center font-medium text-[20px]  mt-[80px]">{steps[activeStep]}</p>
        </div>

               <Box sx={{ width: "100%" }}>
                 <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    connector={<CustomConnector />}
                >
                    {steps.map((label, index) => (
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

                {/* <Divider sx={{marginTop:"8px", marginBottom:"8px"}} /> */}


                    <div className="w-[90%] m-auto mt-[30px]">
                                        <p className="text-[16px] font-inter font-medium text-[#181818]">Payment Method</p>
                                        <div className=" mt-[10px]">
                                        <div className='flex justify-between mb-[25px]'>
                                            <div>
                                                <CreditCardIcon className='w-[35px] h-[35px]' /> <span className='text-[14px]'>Card</span>
                                            </div>
                                            <div className='flex gap-3'>
                                                <img src={master} alt='master-card' className='w-[35px] h-[35px]' />
                                                <img src={visa} alt='visa-card' className='w-[35px] h-[35px]'/>
                                            </div>
                
                                        </div>
                
                                        <div className="flex flex-col mb-[15px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Card Number</label>
                                            <TextField
                                            name="cardNumber"
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            placeholder="1234 5678 9876 0192"
                                            value={formData.cardNumber}
                                            onChange={handleChangePayment}
                                            onBlur={handleBlur}
                                            error={errors.cardNumber && touched.cardNumber}
                                             helperText={errors.cardNumber && touched.cardNumber ? "Card number must be 16 digits" : ""}
                                             sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardNumber ? (errors.cardNumber ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[15px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Cardholder's Name</label>
                                            <TextField
                                            name="cardHolder"
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter Name"
                                            value={formData.cardHolder}
                                            onChange={handleChangePayment}
                                            error={errors.cardHolder && touched.cardHolder}
                                            helperText={errors.cardHolder && touched.cardHolder ? "Cardholder's name is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardHolder ? (errors.cardHolder ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[15px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Expiry Date</label>
                                            <TextField
                                            name="expiryDate"
                                            type="month"
                                            variant="outlined"
                                            size="small"
                                            value={formData.expiryDate}
                                            onChange={handleChangePayment}
                                            error={errors.expiryDate && touched.expiryDate}
                                            helperText={errors.expiryDate && touched.expiryDate ? "Expiry date is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.expiryDate ? (errors.expiryDate ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[15px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">CVV</label>
                                            <TextField
                                            name="cvv"
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleChangePayment}
                                            error={errors.cvv && touched.cvv}
                                            helperText={errors.cvv && touched.cvv ? "CVV must be 3 digits" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cvv ? (errors.cvv ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                                        
                                        <FormControlLabel
                                        className='mt-[-10px]'
                                            control={
                                            <Checkbox disabled={!isFormValids} />
                                        }
                                        label="Set as default Payment Method"
                                        />
            
                                        </div>
                                        </div>


                                         <div className="w-[90%] m-auto mt-[25px]">
                                                            <p className="text-[14px] font-inter font-medium text-[#181818]">Price Summary</p>
                                                            <div className=" mt-[10px]">
                                                                <div className="flex flex-col gap-1">
                                                                <div className="flex justify-between">
                                                                    <div>
                                                                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Standard King Room</p>
                                                                    <p className="text-[12px] font-inter font-normal text-[#4E4F52]">1 Room <CircleIcon sx={{width:"6px", height:"6px"}} /> 7 Nights</p>
                                                                    </div>
                                                                    <div><p className="text-[#181818] text-[14px] font-inter">₦70,000</p></div>
                                                                </div>
                                        
                                        
                                                                    <div className="flex justify-between mt-[10px]">
                                                                    <div>
                                                                    <p className="text-[14px] font-inter font-normal text-[#4E4F52]">Taxes (15%)</p>
                                       
                                                                    </div>
                                                                    <div><p className="text-[#181818] text-[14px] font-inter">₦10,000</p></div>
                                                                </div>
                                        
                                        
                                        
                                                                <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
                                                                <div className="flex justify-between">
                                                                    <p className='text-[14px]'>Total to pay today</p>
                                                                    <p className='text-[#023E8A] font-medium text-[14px]'>₦80,000</p>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }}  />


                                                        <Divider sx={{ marginTop: "90px", marginBottom: "8px" }}  />

                
                                                <div className="w-[90%] m-auto mt-[20px]">
                                                    <FormControlLabel
                                                    control={<Checkbox checked={formData.agreement} onChange={handleCheckboxChange} />}
                                                    label={
                                                        <p className="text-[11px]">
                                                        I agree to the <span className="text-[#023E8A]">booking conditions, TravelMate terms and conditions, and Privacy Policy.</span>
                                                        </p>
                                                    }
                                                    />
                                                </div>
                                                        
                                                        <Link to="/car-payment-successful">
                                                        <div className="mt-[20px] mb-[30px]  w-[90%] m-auto">
                                                            <button
                                                            className={`w-full text-white h-[56px] rounded-[6px] cursor-pointer ${
                                                                isFormValid ? "bg-[#023E8A]" : "bg-gray-400 cursor-not-allowed"
                                                            }`}
                                                            disabled={!isFormValid}
                                                            onClick={handleSubmit}
                                                            >
                                                            Make Payment
                                                            </button>
                                                        </div>
                                                        </Link>


                                            {/* <div className="mt-[98.5px]">
                                            <Footer />
                                            </div> */}
            
        </div>
        }
    </div>

            


        </div>

         ) : (

            // web view

        <div>
           <div className='mb-[32px] mt-[95px] w-[90%] m-auto'>

            <div className='border-1  border-[#023E8A] w-full bg-[#CCD8E81A] pt-[16px] pb-[16px] pr-[12px] pl-[12px] rounded-[8px]'>

            <div className='flex gap-2'>
                <div>
                     <div><ErrorOutlineIcon className=' text-[#023E8A]' /></div>
                </div>
                <div className='text-[#181818]'>Cancellation allowed 24 hours before pick up</div>
            </div>

            </div>
        </div>
            <div className='w-[90%] m-auto'>
            {carList.map((car) => (
        <Card key={car.id} className="p-[20px] w-[100%] h-[200px] cursor-pointer" >
        {/* <div className="flex flex-col sm:flex-row gap-[10px]"> */}
        <div className="flex justify-between gap-[8px] ">
          <div className="flex gap-[8px] ">
          <img src={circle} alt="" className='w-[76px] h-[76px]' />
          <div >
            <div className="flex gap-[2px]">
            <p className="mt-[10px] text-[#181818] text-[16px]">Elvis</p>
              <Stack direction="row" sx={{marginTop:"10px"}}>
              <Rating
                value={1} 
                max={1} 
                readOnly
              />
              <Typography variant="body1">{value}</Typography>
            </Stack>
          </div >
             <div className="mt-[4px]">
              <p className="text-[#67696D] text-[16px] ">Red Toyota Corolla</p>
            </div>

          </div>
             
          </div>

          

        <div className='relative top-[30px]'>
            <img src={car.image} alt="" className='h-[102px] w-[102px]' />
        </div>

        </div>
             <div className="flex gap-[3px] mb-[4px] mt-[-18px]"> 
            <p>{car.seatLeft} {car.spaceleft}</p>
            <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"10px" ,marginLeft:"2px"}}/>
            <div>{car.fuelIcon} {car.full}</div>
          </div>


              <div>

                  <div className="flex gap-[2px]  mb-[4px]">
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                    <p className="text-[#2D9C5E]">{car.noShows}</p>
                </div>

                 <div className="flex gap-[2px]">
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                    <p className="text-[#2D9C5E]">{car.refundable}</p>
                </div>

                
            </div>
          </Card>
            ))}
            </div>
            

            <div className='flex justify-between w-[90%] m-auto  gap-6'>
            <div className='mt-[30px] '>             
            <div className=''>
                         <p className="text-[20px] font-inter font-medium text-[#181818]">Passenger Information</p>
                         <div className='border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]'>
        
                         <div>
                            <div>
                                <div className='flex justify-between'>
                                <div>
                                    <p className='text-[17px] font-inter font-medium text-[#181818]'>Use my Profile Information</p>
                                    <p className='text-[#4E4F52] font-normal text-[14px]'>The fields will be automatically field based on your information with us</p>
                                </div>

                                <div>
                                     {/* <Switch {...label} defaultChecked /> */}

                                      <FormControlLabel
                                        control={
                                            <Switch checked={state.jason} onChange={handleChange} name="jason" />
                                        }
                                        label=""
                                        />
                                    
                                </div>
                                </div>

                               
                                <Divider sx={{marginBottom:"16px", marginTop:"16px"}} />
                                <p className="text-[20px] font-inter font-semibold text-[#181818]">Primary Passenger: Adult</p>

                                <div className='flex justify-between gap-6 w-full'> 
                                    <div className="flex-1 ">
                                        <div className='flex flex-col mt-[20px] mb-[20px]'>     
                                            <label htmlFor="firstName" className="mb-1 text-[14px]">First Name</label>
                                            <TextField
                                                id="firstName"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter First Name"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>

                                        <div className='flex flex-col mb-[20px]'>     
                                            <label htmlFor="email" className="mb-1 text-[14px]">Email Address</label>
                                            <TextField
                                                id="email"
                                                variant="outlined"
                                                size="small"
                                                placeholder="name@email.com"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className='flex flex-col mt-[20px] mb-[20px]'>     
                                            <label htmlFor="lastName" className="mb-1 text-[14px]">Last Name</label>
                                            <TextField
                                                id="lastName"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Last Name"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <PersonOutlineOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>

                                        <div className='flex flex-col mb-[20px]'>     
                                            <label htmlFor="phoneNumber" className="mb-1 text-[14px]">Phone Number</label>
                                            <TextField
                                                id="phoneNumber"
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Phone Number"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <EmailOutlinedIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    "& .MuiInputBase-root": { height: "44px", borderRadius:"8px" },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>


                                 <div className='flex flex-col'>     
                                            <label htmlFor="from" className="mb-1 text-[14px]">Date Of Birth</label>
                                            <TextField
                                                id="dateOfBirth"
                                                type='date'
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Phone Number"
                                                // value={from}
                                                // onClick={handleFromClick}
                                                InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                    <DateRangeOutlinedIcon />
                                                    </InputAdornment>
                                                ),
                                                }}
                                                sx={{
                                                width: "100%",
                                                
                                                "& .MuiInputBase-root": { height: "44px", borderRadius:"8px", },
                                                }}
                                            />
                                        </div>
                                        

                            </div>
                         </div>
                         </div>
            </div>
                    
            <div className='mt-[30px]'>
                         <p className="text-[20px] font-inter font-medium text-[#181818]">Refunds and Cancellations
                            
                         </p>
                         <div className='border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]'>
                                <div>
                                    <p className='mb-[28px]'>Cancellations</p>
                                    <div className='flex gap-4 mb-[28px]'>
                                        <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"8px"}}/>
                                        <p>Cancellations allowed 24 hours before pick Up</p>
                                    </div>
                                </div>

                                <Divider />

                                  <div>
                                    <p className='mb-[28px] mt-[28px]'>Refunds</p>
                                    <div className='flex gap-4'>
                                        <CircleIcon  sx={{width:"4px", height:"4px", marginTop:"8px"}}/>
                                        <p>Full refund if cancelled 24 hours before pick up</p>
                                    </div>
                                </div>
                         </div>
            </div>
            </div>

            <div>
                 <div className="mt-[30px]">
                                    <p className="text-[20px] font-inter font-medium text-[#181818]">Price Summary</p>
                                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                                        <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Total</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                                        </div>
                                        </div>
                                    </div>
                    </div>



                    <div className="mt-[30px]">
                                    <p className="text-[20px] font-inter font-medium text-[#181818]">Trip Details</p>
                                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                                        <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Pick Up location</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                                        </div>
                
                
                                            <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Pick Up Date</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">Feb 10, 2025</p></div>
                                        </div>

                                           <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Pick Up Time</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">3:30 PM</p></div>
                                        </div>


                                           <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Drop Off Location</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">Victoria Island</p></div>
                                        </div>
                                        </div>
                                    </div>
                    </div>

                     <div className="mt-[30px]">
                                    <p className="text-[20px] font-inter font-medium text-[#181818]">Driver Details</p>
                                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                                        <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Name</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">Elvis Igiebor</p></div>
                                        </div>
                
                
                                            <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Rating</p>
                                            </div>
                                            <div>
                                                <Stack direction="row">
                                                    <Rating
                                                        value={1} 
                                                        max={1} 
                                                        readOnly
                                                    />
                                                    <Typography variant="body1">{value}</Typography>
                                                    </Stack>
                                                </div>
                                        </div>

                                           <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Phone Number</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">090123456782</p></div>
                                        </div>
                                        </div>
                                    </div>
                    </div>



                    <div className="mt-[30px]">
                        <p className="text-[20px] font-inter font-medium text-[#181818]">Payment Method</p>
                        <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                        <div className='flex justify-between mb-[25px]'>
                            <div>
                                <CreditCardIcon /> <span>Card</span>
                            </div>
                            <div className='flex gap-3'>
                                <img src={master} alt='master-card' />
                                <img src={visa} alt='visa-card' />
                            </div>

                        </div>

                        <div className="flex flex-col mb-[20px]">
                            <label className="mb-[12px] text-[#181818] font-medium text-[14px]">Card Number</label>
                            <TextField
                            name="cardNumber"
                            type="number"
                            variant="outlined"
                            size="small"
                            placeholder="1234 5678 9876 0192"
                            value={formData.cardNumber}
                            onChange={handleChangePayment}
                            onBlur={handleBlur}
                            error={errors.cardNumber && touched.cardNumber}
                             helperText={errors.cardNumber && touched.cardNumber ? "Card number must be 16 digits" : ""}
                             sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                height: "44px",
                                borderRadius: "8px",
                                borderColor: touched.cardNumber ? (errors.cardNumber ? "red" : "#818489") : "#818489",
                                },
                            }}
                            />
                        </div>

                        <div className="flex flex-col mb-[20px]">
                            <label className="mb-[12px] text-[#181818] font-medium text-[14px]">Cardholder's Name</label>
                            <TextField
                            name="cardHolder"
                            type="text"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Name"
                            value={formData.cardHolder}
                            onChange={handleChangePayment}
                            error={errors.cardHolder && touched.cardHolder}
                            helperText={errors.cardHolder && touched.cardHolder ? "Cardholder's name is required" : ""}
                                sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                height: "44px",
                                borderRadius: "8px",
                                borderColor: touched.cardHolder ? (errors.cardHolder ? "red" : "#818489") : "#818489",
                                },
                            }}
                            />
                        </div>

                        <div className="flex flex-col mb-[20px]">
                            <label className="mb-[12px] text-[#181818] font-medium text-[14px]">Expiry Date</label>
                            <TextField
                            name="expiryDate"
                            type="month"
                            variant="outlined"
                            size="small"
                            value={formData.expiryDate}
                            onChange={handleChangePayment}
                            error={errors.expiryDate && touched.expiryDate}
                            helperText={errors.expiryDate && touched.expiryDate ? "Expiry date is required" : ""}
                                sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                height: "44px",
                                borderRadius: "8px",
                                borderColor: touched.expiryDate ? (errors.expiryDate ? "red" : "#818489") : "#818489",
                                },
                            }}
                            />
                        </div>

                        <div className="flex flex-col mb-[20px]">
                            <label className="mb-[12px] text-[#181818] font-medium text-[14px]">CVV</label>
                            <TextField
                            name="cvv"
                            type="number"
                            variant="outlined"
                            size="small"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChangePayment}
                            error={errors.cvv && touched.cvv}
                            helperText={errors.cvv && touched.cvv ? "CVV must be 3 digits" : ""}
                                sx={{
                                width: "100%",
                                "& .MuiOutlinedInput-root": {
                                height: "44px",
                                borderRadius: "8px",
                                borderColor: touched.cvv ? (errors.cvv ? "red" : "#818489") : "#818489",
                                },
                            }}
                            />
                        </div>
                                <FormControlLabel
                                control={
                                    <Checkbox disabled={!isFormValids} />
                                }
                                label="Set as default Payment Method"
                                />
                        </div>
                    </div>

                    <div className="ml-[3px] mt-[30px]">
                        <FormControlLabel
                        control={<Checkbox checked={formData.agreement} onChange={handleCheckboxChange} />}
                        label={
                            <p>
                            I agree to the <span className="text-[#023E8A]">booking conditions, TravelMate terms, and Privacy Policy.</span>
                            </p>
                        }
                        />
                    </div>
                    
                    <Link to="/car-payment-successful">
                    <div className="mt-[32px]">
                        <button
                        className={`w-full text-white h-[56px] rounded-[6px] cursor-pointer ${
                            isFormValid ? "bg-[#023E8A]" : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                        >
                        Make Payment
                        </button>
                    </div>
                    </Link>



            </div>
            </div>

            <div className='mt-[197px]'>
                <Footer />
            </div>
        </div>
    )}
     </div>
    </div>

  )
}

export default Page