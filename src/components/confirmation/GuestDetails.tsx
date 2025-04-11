import React from "react";

interface Guest {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

const GuestDetails: React.FC<{ guests: Guest[] }> = ({ guests }) => {
  return (
    <div className="bg-white sm:p-6">
      <h2 className="text-lg font-semibold mb-4">Guest Details</h2>

      <div className="space-y-6">
        {guests.map((guest, index) => (
          <div key={index} className="sm:p-6 rounded-lg sm:border border-gray-300 space-y-3">
            <p className="flex justify-between">
              <span className="font-medium">Name</span> {guest.name}
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Email</span> {guest.email}
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Phone</span> {guest.phone}
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Date of Birth</span> {guest.dob}
            </p>
            {/* {index < guests.length - 1 && <hr className="my-4 border-gray-300" />} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestDetails;
