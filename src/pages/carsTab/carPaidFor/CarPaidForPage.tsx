

import { Divider, Rating, Stack, Typography } from '@mui/material';
import Navbar from '../../homePage/Navbar'
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { Link } from 'react-router-dom';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import Footer from '../../homePage/Footer';



const CarPaidForPage = () => {
 const value = 4.5;

  return (
    <div>
        <div><Navbar/></div>

         <Link to="/">
        <div className='flex mt-26 mb-[24px] gap-[24px] w-[90%] m-auto cursor-pointer'>
            <div 
              className="w-[33px] h-[33px]  cursor-pointer bg-white border border-[#EBECED] rounded-[4px] shadow-md shadow-[#00000014] flex items-center justify-center"
            >
              <KeyboardArrowLeftOutlinedIcon className="scale-150" />
            </div>
            <p className='mt-[5px] text-[18px]'>Back to home</p>
        </div>
        </Link>

        <Divider />

    
    <div className='flex justify-between mt-[32px] mb-[32px] w-[90%] m-auto'>

        <div>
            <p className='text-[#181818] text-[32px] font-bold font-inter'>Car Confirmation</p>
        </div>
             <div className='flex gap-3'>
                <button className='border-1 border-[#ACAEB3] p-[8px] rounded-[4px] flex gap-2'>
                    <IosShareOutlinedIcon className='w-[30%]' />
              <span className='mt-[2px]'>Share</span>
                </button>
                <button className='border-1 border-[#ACAEB3]  p-[8px] rounded-[4px] flex gap-2'>
                    <FileDownloadOutlinedIcon className='w-[30%]' />
                    <span>Download</span>    
                </button>
            </div>
    </div>


    <div>
              <div className='mb-[32px] w-[90%] m-auto'>
         
                     <div className='border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[16px] pb-[16px] pr-[12px] pl-[12px] rounded-[8px]'>
         
                     <div className='flex gap-2'>
                         <div>
                             <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                                 <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                             </div>
                         </div>
                         <div>Payment Successful. Car confirmation Details will also be sent to elvis@gmail.com</div>
                     </div>
         
                     </div>
                 </div>
    </div>


    <div className='w-[90%] m-auto flex justify-between'>
    <div className='' >
         <div>
            <div>
            <p className='text-[20px] font-medium text-[#181818] mb-[15px]'>Confirmation Details</p>
            </div>

            <div>
                <div className='border border-[#CDCED1] w-[43.6vw] p-[20px] rounded-[12px]'>

                     <div className='flex justify-between'>
                        <p className='text-[#4E4F52] text-[18px]'>Payment Status</p>
                        <p className='text-[#2D9C5E] text-[18px]'>Paid</p>
                    </div>
                </div>
            </div>
            </div>


                    <div className="mt-[15px]">
                                    <p className="text-[20px] font-inter font-medium text-[#181818]">Trip Details</p>
                                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                                        <div className="flex flex-col gap-1">
                                        <div className="flex justify-between">
                                            <div>
                                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Pick Up location</p>
                                            </div>
                                            <div><p className="text-[#181818] text-[16px] font-inter">Ikeja</p></div>
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


                    
                    <div className="mt-[15px]">
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

                     
                    <div className="mt-[15px]">
                            <p className="text-[20px] font-inter font-medium text-[#181818]">Car Details</p>
                            <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[20px]">
                            <div className="flex flex-col gap-1">
                            <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Type</p>
                            </div>
                            <div><p className="text-[#181818] text-[16px] font-inter">Red Toyota Corolla</p></div>
                            </div>
                                    
                            <div className="flex justify-between">
                            <div>
                            <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Seats</p>
                            </div>
                            <div>
                            <p>3 Seats</p>
                            </div>
                            </div>
                    
                                <div className="flex justify-between">
                                <div>
                                <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Luggages</p>
                                </div>
                                <div><p className="text-[#181818] text-[16px] font-inter">Up to 4 Luggages</p></div>
                                </div>

                                  <div className="flex justify-between">
                                <div>
                                <p className="text-[18px] font-inter font-normal text-[#4E4F52]">Plate Number</p>
                                </div>
                                <div><p className="text-[#181818] text-[16px] font-inter">AA1234FT</p></div>
                                </div>
                                </div>
                            </div>
                    </div>



            <div className='mt-[15px]'>
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
    </div>

    <div>
             <div className="mt-[]">
                                    <p className="text-[20px] font-inter font-medium text-[#181818]">Price Summary</p>
                                    <div className="border border-[#CDCED1] rounded-[10px] w-[43.6vw] p-[20px] mt-[15px]">
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



                    
                                <div className=' mt-[15px]'>
                                <div>
                                <p className='text-[20px] font-medium text-[#181818] mb-[16px]'>Contacts</p>
                                </div>
                    
                                <div>
                                    <div className='border border-[#CDCED1] w-[43.6vw] p-[20px] rounded-[12px]'>
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

    <div className='mt-[197px]'>
        <Footer />
    </div>
    </div>
  )
}

export default CarPaidForPage