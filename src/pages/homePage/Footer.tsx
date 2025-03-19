import { Divider } from '@mui/material'

const Footer = () => {
  return (
    <div>
        <div className='bg-[#023E8A] w-full h-[394px]'>
            <div className='w-[90%] m-auto'>
                <div className='pt-14'>
                    <div >
                        <ul className='flex flex-wrap gap-3 justify-between text-white font-inter font-normal  mb-18'>
                            <div>
                                 <li>Our Products</li>
                                  <div className='mt-16 font-light'>
                                    <p>Stays</p>
                                    <p>Flights</p>
                                    <p>Car Rentals</p>

                                </div>
                            </div>

                            <div>
                            <li>Support</li>
                                <div className='mt-16 font-light'>
                                    <p>FAQs</p>
                                    <p>Raise A Ticket</p>
                                    <p>Chat With Us</p>

                            </div >
                            </div>
                       
                            <div>
                                <li>Company</li>
                                  <div className='mt-16 font-light'>
                                    <p>About</p>
                                    <p>Our Partners</p>
                                </div> 
                            </div>

                            <div>

                                <li>Policies</li>
                                   <div className='mt-16 font-light'>
                                    <p>Privacy</p>
                                    <p>Terms Of Use</p>
                                    

                                </div>
                            </div>
                      
                        
                        </ul>
                        
                        <Divider className=" " sx={{ backgroundColor: "white" }} />
                        
                        <p className='text-white text-center mt-10 font-inter  font-light'>©2025 TravelMate Company. All rights reserved. TravelMate and TraveMate logo are trademarks or registered trademarks of TravelMate</p>

                    </div>
                </div>

            
            </div>
        </div>
    </div>
  )
}

export default Footer