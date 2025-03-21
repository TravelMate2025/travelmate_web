// import { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import CityImage from "../assets/images/city-image.png";

// const destinations = [
//   { title: "Lagos State", properties: "100 Properties", img: CityImage },
//   { title: "Abuja", properties: "85 Properties", img: CityImage },
//   { title: "Port Harcourt", properties: "72 Properties", img: CityImage },
//   { title: "Enugu", properties: "50 Properties", img: CityImage },
//   { title: "Kano", properties: "40 Properties", img: CityImage },
//   { title: "Ibadan", properties: "60 Properties", img: CityImage },
// ];

// export default function PopularDestinations() {
//   const [startIndex, setStartIndex] = useState(0);
//   const visibleCards = 5;

//   const nextSlide = () => {
//     if (startIndex < destinations.length - visibleCards) {
//       setStartIndex(startIndex + 1);
//     }
//   };

//   const prevSlide = () => {
//     if (startIndex > 0) {
//       setStartIndex(startIndex - 1);
//     }
//   };

//   return (
//     <section className="bg-white py-10 px-6 md:px-14 mt-10">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
//           <p className="text-gray-600">Most explored states</p>
//         </div>
//         <div className="hidden md:flex items-center space-x-4">
//           <button onClick={prevSlide} className="p-2 bg-white rounded-md shadow-md hover:shadow-lg disabled:opacity-50" disabled={startIndex === 0}>
//             <span><FaChevronLeft size={20} /></span>
//           </button>
//           <button onClick={nextSlide} className="p-2 bg-white rounded-md shadow-md hover:shadow-lg disabled:opacity-50" disabled={startIndex >= destinations.length - visibleCards}>
//             <span><FaChevronRight size={20} /></span>
//           </button>
//         </div>
//       </div>

//       {/* Mobile: Horizontal Scroll | Desktop: Fixed Layout */}
//       <div className="overflow-x-auto md:overflow-hidden">
//         <div className="flex space-x-4 transition-transform duration-300 md:transform-none md:flex-nowrap"
//           style={{ transform: `translateX(-${(startIndex / visibleCards) * 100}%)` }}>
//           {destinations.map((dest, index) => (
//             <div key={index} className="w-[90%] xs:w-[70%] sm:w-[50%] md:w-[19%] flex-shrink-0">
//               <div className="overflow-hidden rounded-lg">
//                 <img src={dest.img} alt={dest.title} className="w-full h-40 object-cover rounded-lg" />
//                 <div className="mt-2 text-left">
//                   <h3 className="text-lg font-semibold text-gray-800">{dest.title}</h3>
//                   <p className="text-gray-600">{dest.properties}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Mobile Navigation Arrows */}
//       <div className="flex md:hidden justify-center space-x-4 mt-4">
//         <button onClick={prevSlide} className="p-2 bg-white rounded-md shadow-md hover:shadow-lg disabled:opacity-50" disabled={startIndex === 0}>
//           <span><FaChevronLeft size={20} /></span>
//         </button>
//         <button onClick={nextSlide} className="p-2 bg-white rounded-md shadow-md hover:shadow-lg disabled:opacity-50" disabled={startIndex >= destinations.length - visibleCards}>
//           <span><FaChevronRight size={20} /></span>
//         </button>
//       </div>
//     </section>
//   );
// }
