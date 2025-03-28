
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
import Footer from '../../homePage/Footer';



const Page = () => {

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
   


  return (
    <div>
        <div><Navbar/></div>
        {/* <div className='mt-[85px] w-[90%] m-auto'><Breadcrumb /></div>
        <Divider sx={{marginTop:"15px"}} /> */}

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
                            type="date"
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

                        <FormControlLabel control={<Checkbox />} label="Set as default Payment Method" />
                        </div>
                    </div>

                    <div className="ml-[3px] mt-[30px]">
                        <FormControlLabel
                        control={<Checkbox checked={formData.agreement} onChange={handleCheckboxChange} />}
                        label={
                            <p>
                            I agree to the <span className="text-[#023E8A]">booking conditions, Travel Mate terms, and Privacy Policy.</span>
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
  )
}

export default Page