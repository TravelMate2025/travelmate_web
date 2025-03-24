
import Navbar from '../../homePage/Navbar';
import Breadcrumb from '../../BreadCrumb';
import { Card, CardMedia, Divider, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SpeedIcon from '@mui/icons-material/Speed';
import carImage from "../../../assets/carImage.png";
import carLogo from "../../../assets/carLogo.png";
import CircleIcon from '@mui/icons-material/Circle';




const Page = () => {

    const carList = [
            {
              id: 1,
              image: carImage,
              carName: "SUV",
              type:"Automatic",
              carDescription: "Avis Nigeria",
              carLogo: carLogo,
              seatLeft: <AirlineSeatReclineNormalIcon />,
              fuelIcon : <AcUnitIcon />,
              speed:<SpeedIcon />,
              mileage:"Unlimited Mileage",
              spaceleft: "3 Left",
              fuel: "Fuel",
              full: "Full to full",
              pickUp: "Pick Up Location:MMIA Airport Car Rental, Ikeja",
              dropOff:"Drop-Off Location: Eko Hotel Car Rental, Victoria Island",
              refundable: "Fully Refundable before Feb 10",
              noShows:"No shows will not receive a refund",
              perDay:"Per Day",
              price: "₦14,000",
              button:"Name your price",
            }
    ];


  return (
    <div>
        <div><Navbar/></div>
        <div className='mt-[85px] w-[90%] m-auto'><Breadcrumb /></div>
        <Divider sx={{marginTop:"15px"}} />

           <div className='mb-[32px] mt-[32px] w-[90%] m-auto'>

            <div className='border-1 border-[#2D9C5E] w-full bg-[#D5EBDF4D] pt-[16px] pb-[16px] pr-[12px] pl-[12px] rounded-[8px]'>

            <div className='flex gap-2'>
                <div>
                    <div className='border-[#2D9C5E] h-[20px]  w-[20px] border-2  rounded-full flex justify-center'>
                        <CheckIcon sx={{width:"15px", position:"relative", top:"-3px", color:"#2D9C5E"}} />
                    </div>
                </div>
                <div>Your offer of ₦8000/ Per day has been accepted, complete your booking below</div>
            </div>

            </div>
        </div>
            <div className='w-[90%] m-auto'>
            {carList.map((car) => (
            <Card key={car.id} className="p-[10px] w-[100%] cursor-pointer">
                <div className="flex flex-col sm:flex-row gap-[10px]">
                <div className="sm:w-[50%] w-full sm:h-[305px] h-[100%] bg-[#F5F5F5] rounded-[12px]">
                    <CardMedia component="img" image={car.image} alt={car.carName}  className="w-[80%] h-[300px] object-contain" />
                </div>
                <div className="w-[100%]">
                    <div className="flex justify-between">
                    <Typography gutterBottom variant="h6" component="div">
                        {car.carName}
                    </Typography>
                    <div>
                        <img src={car.carLogo} alt="" className="w-[50px] h-[20px]" />
                    </div>
                    </div>

                    <div>
                    <div className="flex justify-between">
                        <p className="mb-[2px]">{car.carDescription}</p>
                        <p className="mb-[2px]">{car.type}</p>
                    </div>

                    <div className="flex gap-[3px] mb-[2px]">
                        <p>{car.seatLeft} {car.spaceleft}</p>
                        <CircleIcon sx={{ width: "4px", height: "4px", marginTop: "10px", marginLeft: "2px" }} />
                        <div>{car.fuelIcon} {car.fuel}: {car.full}</div>
                        <CircleIcon sx={{ width: "4px", height: "4px", marginTop: "10px", marginLeft: "2px" }} />
                    </div>

                    <div>
                        <div className="mb-[2px]">{car.speed} {car.mileage}</div>
                        <div className="mb-[2px]">
                        <p className="mb-[2px]">{car.pickUp}</p>
                        <p className="mb-[2px]">{car.dropOff}</p>
                        </div>
                        <div className="flex gap-[2px] mb-[3px]">
                        <div className="border-[#2D9C5E] h-[20px] w-[20px] border-2 rounded-full flex justify-center">
                            <CheckIcon sx={{ width: "15px", position: "relative", top: "-3px", color: "#2D9C5E" }} />
                        </div>
                        <p className="text-[#2D9C5E]">{car.refundable}</p>
                        </div>

                        <div className="flex gap-[2px] mb-[3px]">
                        <div className="border-[#2D9C5E] h-[20px] w-[20px] border-2 rounded-full flex justify-center">
                            <CheckIcon sx={{ width: "15px", position: "relative", top: "-3px", color: "#2D9C5E" }} />
                        </div>
                        <p className="text-[#2D9C5E]">{car.noShows}</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </Card>
            ))}
            </div>
            

            <div className='mt-[32px] w-[90%] m-auto '>
                <div>
                    <p className='text-[24px] font-medium text-[#181818]'>Add Extras</p>

                    <div className='border-1 border-[#CDCED1] w-full p-[24px] rounded-[12px]'>
                        <p>Children Seat</p>
                        <p>Extra ₦10,000</p>
                    </div>
                </div>
            </div>
     
    </div>
  )
}

export default Page