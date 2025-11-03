import React from "react";

const Policies: React.FC = () => {
  return (
    <div className="w-full space-y-4 pt-6 lg:pt-0">
      {/* Title */}
      <h3 className="text-lg font-semibold lg:ml-5 ml-3 border-t lg:border-0 md:border border-gray-300 pt-4 lg:pt-0">Policies</h3>

      {/* Body */}
      <div className="lg:border-t border-b md:border border-gray-300 md:rounded-lg lg:p-6 lg:space-y-6">
        {/* Check-in Policy */}
        <div className="flex flex-col justify-normal gap-2 pb-4 lg:pb-0 px-6">
          <p className="font-medium text-gray-700">Check In & Check Out</p>
          <ul className="lg:mt-4 list-disc ">
            <li>Valid ID card required at Check in time</li>
            <li>Check In time: 4:00pm</li>
            <li>Checkout Time: 6:00pm</li>
          </ul>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col justify-normal gap-2 pt-2 lg:pt-0 pb-4 lg:pb-0 px-6">
          <p className="font-medium text-gray-700">Reservation Policy</p>
          <ul className="list-disc lg:mt-4">
            <li>All bookings are non refundable once committed</li>
          </ul>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col justify-normal gap-2 pt-2 lg:pt-0 pb-4 lg:pb-0 px-6" >
          <p className="font-medium text-gray-700">Pet Policy</p>
          <ul className="list-disc lg:mt-4">
            <li>No Pets allowed on the premises</li>
          </ul>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-col justify-normal gap-2 pt-2 lg:pt-0 pb-4 lg:pb-0 px-6">
          <p className="font-medium text-gray-700">Children and Extra Beds</p>
          <ul className="list-disc lg:mt-4">
            <li>Children are welcome</li>
            <li>Cribs not available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Policies;
