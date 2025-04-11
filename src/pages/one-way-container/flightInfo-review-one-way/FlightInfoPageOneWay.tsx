

import { useState,useEffect } from 'react';
import Navbar from '../../homePage/Navbar'
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AirlineSeatReclineExtraOutlinedIcon from '@mui/icons-material/AirlineSeatReclineExtraOutlined';
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FlightClassOutlinedIcon from "@mui/icons-material/FlightClassOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import planelogo from "../../../assets/airlogo.svg";
import { Divider, InputAdornment, TextField, FormControlLabel, Checkbox } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import Switch from '@mui/material/Switch';
import Footer from '../../../components/2Footer';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import master from "../../../assets/master.svg";
import visa from "../../../assets/visa.svg"
import { Link } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';



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


const FlightInfoPage = () => {

    const steps = [
      'Flight Overview',
      'Passenger Information',
      'Payment',
    ];
    
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
    
        const isMobile = useMediaQuery({ maxWidth: 768 });

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

const isFormValids =
  !errors.cardNumber &&
  !errors.cardHolder &&
  !errors.expiryDate &&
  !errors.cvv &&
  formData.cardNumber &&
  formData.cardHolder &&
  formData.expiryDate &&
  formData.cvv;


const [formValues, setFormValues] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
});
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value } = e.target;
  setFormValues(prev => ({ ...prev, [id]: value }));
};


const isEmailValid = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isFormVali =
  formValues.firstName.trim() &&
  formValues.lastName.trim() &&
  isEmailValid(formValues.email) &&
  formValues.phoneNumber.trim() &&
  formValues.dateOfBirth.trim();

  return (
    <div>
        <div>
            <Navbar />
        </div>


         {isMobile ? (

 <div>
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

            <div className='w-full mb-[24px] border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] '>

                    <div className='items-center p-2'>
                        <p className='text-[16px] text-[#181818] font-inter font-normal'>One Way</p>
                        <p className='text-[14px] text-[#4E4F52] '>1 Passenger, 1 Ticket</p>
                    </div>

                </div>
        </div>

         

                <div className='w-[90%] m-auto'>
                         <p className="text-[18px] font-inter font-medium text-[#181818]">Departure Flight</p>
                         <div className='border border-[#CDCED1] rounded-[10px] w-[100%] p-[20px] mt-[20px]'>
                            <div>
                                <div className="flex flex-col gap-2">
                                            <div className='flex gap-[4px] justify-between'>
                                               <div className=''>
                                                <p className="text-[#181818] text-[16px] font-medium ">Lagos To Abuja</p>
                                                </div>
                                                <div>
                                                <p className="text-[#023E8A] text-[14px] font-medium ">Change Flight</p>
                                                </div>
                                            </div>

                                                <div className='flex gap-4'>
                                                <img src={planelogo} alt="" className='w-[19px]' />
                                                <p className="text-[#67696D] text-[18px] font-normal ">Air Piece Limited</p>
                                                </div>

                                            <p className='text-[#67696D] font-medium text-[16px]'><FlightClassOutlinedIcon /> Economy </p>
                                            <p className='text-[#67696D] font-medium text-[16px]'><CalendarMonthOutlinedIcon />Feb 19</p>
                                            <p className="text-[#67696D] text-[16px] font-medium">2:00pm - 4:00pm (2hr Non Stop)</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><LuggageOutlinedIcon />1 Carry-on + 23kg Checked Bag</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><AirlineSeatReclineExtraOutlinedIcon /> Seat Selection is not allowed</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><CloseOutlinedIcon /> Non Refundable</p>
                                            <Divider />
                                            <div className='flex justify-between'>
                                                <div>
                                                    <p className='mt-3 text-[#181818] font-medium'>Price</p>
                                                </div>
                                                <div>
                                                    <p className='text-[#023E8A] text-[16px] font-medium'>₦50,000</p>
                                                    <p className='text-[#67696D] text-[12px] font-medium'>Includes taxes&Fees</p>
                                                </div>
                                            </div>
                                            
                                </div>
                                </div>
                        </div>
            </div>

                
                    <div className="mt-[20px] w-[90%] m-auto">
                    <p className="text-[18px] font-inter font-medium text-[#181818]">Price Summary</p>
                    <div className="w-[100%]  mt-[20px]">
                        <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Departure Flight</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Taxes & Fees</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>


                        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
                        <div className="flex justify-between">
                            <p>Total</p>
                            <p className='text-[#023E8A] font-medium'>₦80,000</p>
                        </div>
                        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

                        </div>
                    </div>
                    </div>


                <Divider sx={{marginTop:"15px", marginBottom:"20px"}} />

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



                        
                     <div className='mt-[20px] w-[90%] m-auto'>
                         <div className=' w-[100%] mt-[20px]'>
                            <div className='w-full flex pl-3 mt-[2px] mb-[28px] border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] '>
                            <div><ErrorOutlineIcon className='mt-4 text-[#023E8A]' /></div>
                            <div className='items-center p-2'>
                            
                                <p className='text-[12px] text-[#4E4F52] font-inter font-normal'>
                                    Passenger names must match the name on their government-issued ID(e.g., Passport)
                                </p>
                            </div>
                         </div>
                         <Divider sx={{marginBottom:"18px"}} />

                         <div>
                            <div>
                                <div className='flex justify-between'>
                                <div>
                                    <p className='text-[16px] font-inter font-medium text-[#181818]'>Use my Profile Information</p>
                                    <p className='text-[#4E4F52] font-normal text-[12px]'>The fields will be automatically field based on your information with us</p>
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
                                <p className="text-[18px] font-inter font-semibold text-[#181818]">Primary Passenger: Adult</p>

                                <div className='flex flex-col gap-6 w-full'> 
                                    
                                        <div className='flex flex-col mt-[20px] '>     
                                            <label htmlFor="firstName" className="mb-1 text-[14px]">First Name</label>
                                            <TextField
                                                id="firstName"
                                                variant="outlined"
                                                size="small"
                                                value={formValues.firstName}
                                                onChange={handleInputChange}
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

                                             <div className='flex flex-col mt-[-6px]'>     
                                            <label htmlFor="lastName" className="mb-1 text-[14px]">Last Name</label>
                                            <TextField
                                                id="lastName"
                                                variant="outlined"
                                                size="small"
                                                value={formValues.lastName}
                                                onChange={handleInputChange}
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
                                       
                                 

                                         <div className='flex flex-col mt-[-6px] '>     
                                            <label htmlFor="email" className="mb-1 text-[14px]">Email Address</label>
                                            <TextField
                                                id="email"
                                                variant="outlined"
                                                size="small"
                                                value={formValues.email}
                                                onChange={handleInputChange}
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
                                   

                                        <div className='flex flex-col mt-[-6px]'>     
                                            <label htmlFor="phoneNumber" className="mb-1 text-[14px]">Phone Number</label>
                                            <TextField
                                                id="phoneNumber"
                                                variant="outlined"
                                                size="small"
                                                value={formValues.phoneNumber}
                                                onChange={handleInputChange}
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

                                          <div className='flex flex-col mt-[-6px]'>     
                                            <label htmlFor="from" className="mb-1 text-[14px]">Date Of Birth</label>
                                            <TextField
                                                id="dateOfBirth"
                                                type='date'
                                                variant="outlined"
                                                size="small"
                                                value={formValues.dateOfBirth}
                                                onChange={handleInputChange}
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
                         
                    </div>

                    
                <Divider sx={{marginTop:"60px", marginBottom:"20px"}} />

                   {/* <Link to="/car-payment-successful"> */}
                    <div className="w-[90%] m-auto mb-20">
                       <button
                         className={`w-full text-white h-[56px] rounded-[6px] ${!isFormVali ? "bg-gray-400 cursor-not-allowed" : "bg-[#023E8A]"}`}
                        onClick={handleNext} 
                        disabled={!isFormVali}
                        >
                        {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                        </button>
                    </div>
        
                </div>
        
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
                                className='text-[8px]'
                                >
                                {label}
                                </StepLabel>
                            </Step>
                            ))}
                        </Stepper>
                        </Box>
        
                    
        
        
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
                                                    control={
                                                        <Checkbox disabled={!isFormValids} />
                                                    }
                                                    label="Set as default Payment Method"
                                                    className='mt-[-10px]'
                                                    />
                                                </div>
                                                </div>
        
        
                 <div className="mt-[20px] w-[90%] m-auto">
                    <p className="text-[18px] font-inter font-medium text-[#181818]">Price Summary</p>
                    <div className="w-[100%]  mt-[20px]">
                        <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Departure Flight</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Taxes & Fees</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>



                        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />
                        <div className="flex justify-between">
                            <p>Total</p>
                            <p className='text-[#023E8A] font-medium'>₦80,000</p>
                        </div>
                        <Divider sx={{ marginTop: "8px", marginBottom: "8px" }} />

                        </div>
                    </div>
                    </div>
        
                            
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
                                                                
                                                                <Link to="/flight-confirm-one-way">
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
        
        
                
                    
                </div>
                }

            </div>

             ) : (

                // web view

        <div className='mb-[92px]'>
            <div className=" w-[90%] m-auto ">

                <div>
                <div>
                <div className='w-full mt-[100px] mb-[24px] border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] '>

                    <div className='items-center p-2'>
                        <p className='text-[18px] text-[#181818] font-inter font-normal'>One Way</p>
                        <p className='text-[15px] text-[#4E4F52] '>1 Passenger, 1 Ticket</p>
                    </div>

                </div>

                <div className='flex justify-between w-full '>
                    <div>
                    <div>
                         <p className="text-[20px] font-inter font-medium text-[#181818]">Departure Flight</p>
                         <div className='border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]'>
                            <div>
                                <div className="flex flex-col gap-2">
                                            <div className='flex gap-[4px] justify-between'>
                                               <div className=''>
                                                <p className="text-[#181818] text-[16px] font-medium ">Lagos To Abuja</p>
                                                </div>
                                                <div>
                                                <p className="text-[#023E8A] text-[14px] font-medium ">Change Flight</p>
                                                </div>
                                            </div>

                                                <div className='flex gap-4'>
                                                <img src={planelogo} alt="" className='w-[19px]' />
                                                <p className="text-[#67696D] text-[18px] font-normal ">Air Piece Limited</p>
                                                </div>

                                            <p className='text-[#67696D] font-medium text-[16px]'><FlightClassOutlinedIcon /> Economy </p>
                                            <p className='text-[#67696D] font-medium text-[16px]'><CalendarMonthOutlinedIcon />Feb 19</p>
                                            <p className="text-[#67696D] text-[16px] font-medium">2:00pm - 4:00pm (2hr Non Stop)</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><LuggageOutlinedIcon />1 Carry-on + 23kg Checked Bag</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><AirlineSeatReclineExtraOutlinedIcon /> Seat Selection is not allowed</p>
                                            <p className="text-[#67696D] text-[16px] font-medium"><CloseOutlinedIcon /> Non Refundable</p>
                                            <Divider />
                                            <div className='flex justify-between'>
                                                <div>
                                                    <p className='mt-3 text-[#181818]'>Price</p>
                                                </div>
                                                <div>
                                                    <p className='text-[#023E8A] text-[16px] font-medium'>₦50,000</p>
                                                    <p className='text-[#67696D] text-[12px] font-medium'>Includes taxes&Fees</p>
                                                </div>
                                            </div>
                                            
                                </div>
                                </div>
                        </div>
                    </div>


                     <div className='mt-[20px]'>
                         <p className="text-[20px] font-inter font-medium text-[#181818]">Passenger Information</p>
                         <div className='border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]'>
                            <div className='w-full flex pl-3 mt-[2px] mb-[28px] border-1 border-[#023E8A] bg-[#CCD8E81A] rounded-[6px] '>
                            <div><ErrorOutlineIcon className='mt-4 text-[#023E8A]' /></div>
                            <div className='items-center p-2'>
                            
                                <p className='text-[14px] text-[#4E4F52] font-inter font-normal'>
                                    Passenger names must match the name on their government-issued ID(e.g., Passport)
                                </p>
                            </div>
                         </div>
                         <Divider sx={{marginBottom:"18px"}} />

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
                    </div>

                    <div>

                    <div className="ml-[40px]">
                    <p className="text-[20px] font-inter font-medium text-[#181818]">Price Summary</p>
                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                        <div className="flex flex-col gap-1">
                        <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Departure Flight</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>


                            <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Taxes & Fees</p>
                            <p className="text-[14px] font-inter font-normal text-[#4E4F52]">1 Passenger</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">₦40,000</p></div>
                        </div>



                        <Divider sx={{ marginTop: "12px", marginBottom: "12px" }} />
                        <div className="flex justify-between">
                            <p>Total</p>
                            <p className='text-[#023E8A] font-medium'>₦80,000</p>
                        </div>
                        </div>
                    </div>

                    <div className="mt-[20px]">
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
                    
                    <Link to="/flight-confirm-one-way">
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
                        
                </div>
                </div>


                
                </div>
            </div>
        </div>

 )}

        <div>
            <Footer />
        </div>
    </div>

  )
}

export default FlightInfoPage