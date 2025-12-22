import { Customer } from "../../types";

interface GuestDetailsProps {
  guest: Customer;
}

const GuestDetails = ({ guest }: GuestDetailsProps) => {
  return (
    <div className="bg-white">
      <h2 className="text-lg font-semibold mb-4">Guest Details</h2>

      <div className="space-y-6">
        <div className="w-full sm:p-6 rounded-lg sm:border border-gray-300 space-y-3">
          <div className="flex justify-between items-center w-full">
            <p className="font-medium">Name</p>
            <p>
              {guest?.name|| "N/A"} {guest?.surname}
            </p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="font-medium">Email</p>
            <p>{guest?.email|| "N/A"}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="font-medium">Phone</p>
            <p>{guest?.phone|| "N/A"}</p>
          </div>
          <div className="flex justify-between items-center w-full ">
            <p className="font-medium flex justify-end">Address</p>
            <p className="flex justify-end">{guest?.address|| "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDetails;
