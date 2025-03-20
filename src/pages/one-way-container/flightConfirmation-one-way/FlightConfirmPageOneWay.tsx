// import { useState,useEffect } from 'react';
import Navbar from '../../homePage/Navbar'
import { IconButton } from '@mui/material'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import airlogo from "../../../assets/airlogo.svg"
import line3 from "../../../assets/line3.svg"
import Footer from "../../homePage/Footer"
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';

const FlightConfirmationPage = () => {
    
  return (
    <div>
        <div>
            <Navbar />
        </div>

        <div className='mt-[85px] '>
        <Link to="/">
            <div className='w-[90%] m-auto mb-[14px]'>
                <div className='flex gap-2 '>
                <IconButton >
                    < ArrowBackIosNewOutlinedIcon className="w-[32px] h-[32px] p-[4px] font-bold bg-white border-[0.5px] border-[#EBECED] shadow-[0px_4px_4px_rgba(0,0,0,0.06)] rounded-[4px]" />
                </IconButton>

                <div> <p className='mt-2 '>Back to home</p></div>
                </div>
            </div>
        </Link>

        <Divider sx={{marginBottom:"24px"}} />

        <div className='w-[90%] m-auto'>
        <div className='flex justify-between mb-[32px]'>
            <div>
            <p className='text-[28px] font-bold text-[#181818]'>Flight Confirmation</p>
            </div>

            <div className='flex gap-3'>
                <button className='border-1 border-[#ACAEB3] p-[8px] rounded-[4px] flex'>
                    <IosShareOutlinedIcon className='w-[30%]' />
                    <span>Share</span>
                </button>
                <button className='border-1 border-[#ACAEB3]  p-[8px] rounded-[4px] flex'>
                    <FileDownloadOutlinedIcon className='w-[30%]' />
                    <span>Download</span>    
                </button>
            </div>
        </div>
        
        <div className='mb-[32px]'>

            <div className='border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[16px] pb-[16px] pr-[12px] pl-[12px] rounded-[8px]'>

            <div className='flex gap-2'>
                <div>
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                </div>
                <div>Payment Successful and Your flight is confirmed. E-ticket has been sent to elvis@gmail.com</div>
            </div>

            </div>
        </div>



    <div className='flex gap-[40px]'>
        <div>

            <div>
            <div>
            <p className='text-[20px] font-medium text-[#181818] mb-[16px]'>Confirmation Details</p>
            </div>

            <div>
                <div className='border border-[#CDCED1] w-[43.6vw] p-[24px] rounded-[12px]'>
                    <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Booking Reference</p>
                        <p className='text-[#181818] text-[18px]'>123456</p>
                    </div>

                     <div className='flex justify-between'>
                        <p className='text-[#4E4F52] text-[18px]'>Payment Status</p>
                        <p className='text-[#2D9C5E] text-[18px]'>Paid</p>
                    </div>
                </div>
            </div>
            </div>
            
            <div className='mt-[16px]'>
            <div>
            <p className='text-[20px] font-medium text-[#181818] mb-[16px]'>Passenger Details</p>
            </div>

            <div>
                <div className='border border-[#CDCED1] w-[43.6vw] p-[24px] rounded-[12px]'>
                    <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Name</p>
                        <p className='text-[#181818] text-[18px]'>Elvis Igiebor</p>
                    </div>

                     <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Email Address</p>
                        <p className='text-[#181818] text-[18px]'>Elvis@gmail.com</p>
                    </div>

                    
                     <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px] '>Phone Number</p>
                        <p className='text-[#181818] text-[18px]'>090123456782</p>
                    </div>

                       <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Date Of Birth</p>
                        <p className='text-[#181818] text-[18px]'>11/08/2024</p>
                    </div>
                </div>
            </div>
            </div>


            <div className='mt-[16px]'>
            <div>
            <p className='text-[20px] font-medium text-[#181818] mb-[16px]'>Departure Flight</p>
            </div>


            <div>
                <div className='border border-[#CDCED1] w-[43.6vw] p-[24px] rounded-[12px]'>

                    <div className='flex gap-[4px] mb-[10px]'>
                        <img src={airlogo} alt='' />
                        <p className='text-[#181818] text-[18px] mt-[5px]'>Air Peace</p>
                    </div>

                    <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px] font-medium'>2:00pm</p>
                        <img src={line3} alt='' />
                        <p className='text-[#181818] text-[18px] font-medium'>4:00pm</p>
                    </div>

                     <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Lagos (LOS)</p>
                        <p className='text-[#181818] text-[18px]'>Abuja (ABV)</p>
                    </div>

                    
                     <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px] '>E-ticket Number</p>
                        <p className='text-[#181818] text-[18px]'>123456</p>
                    </div>

                       <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Date</p>
                        <p className='text-[#181818] text-[18px]'>Feb 19,2025</p>
                    </div>

                      <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Flight</p>
                        <p className='text-[#181818] text-[18px]'>P4 7120</p>
                    </div>


                      <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Duration</p>
                        <p className='text-[#181818] text-[18px]'>2 Hrs</p>
                    </div>


                      <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Class</p>
                        <p className='text-[#181818] text-[18px]'>Economy</p>
                    </div>


                      <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Baggage</p>
                        <p className='text-[#181818] text-[18px]'>1 carry-on +23kg Checked bag</p>
                    </div>


                      <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Seat selection</p>
                        <p className='text-[#181818] text-[18px]'>Not Allowed</p>
                    </div>

                       <div className='flex justify-between mb-[10px]'>
                        <p className='text-[#4E4F52] text-[18px]'>Refund Policy</p>
                        <p className='text-[#181818] text-[18px]'>Non refundable</p>
                    </div>
                </div>
            </div>
            </div>

        </div>

        <div>
                <div className="">
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
                </div>

            <div className=' mt-[16px]'>
            <div>
            <p className='text-[20px] font-medium text-[#181818] mb-[16px]'>Contacts</p>
            </div>

            <div>
                <div className='border border-[#CDCED1] w-[43.6vw] p-[24px] rounded-[12px]'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2'>
                        <LocalPhoneOutlinedIcon />
                        <p className='text-[#4E4F52] text-[18px]'>Customer Support</p>
                        </div>
                        <p className='text-[#181818] text-[18px]'>+234 800 123 4567</p>
                    </div>
                </div>
            </div>

               <div className="mt-[100px]">
                <Link to="/">
                        <button
                        className="w-full text-white h-[56px] rounded-[6px] cursor-pointer
                            bg-[#023E8A]"
                        
                        >
                        Back to home
                        </button>
                </Link>
                    </div>
            </div>
        </div>


  

    </div>
        </div>
        </div>

            <Footer />
    </div>
  )
}

export default FlightConfirmationPage