import { FaEdit } from "react-icons/fa";
import Spinner from "../components/Spinner";

interface Field {
  label: string;
  value: string | null;
}

interface BasicInfoProps {
  title: string;
  fields: Field[];
  onEdit: () => void;
  isLoading: boolean;
}

export default function BasicInfo({ title, fields, onEdit }: BasicInfoProps) {
  // if (isLoading) {
  //   return <div>Loading...
  //     <span className="flex items-center justify-center">
  //       <Spinner size="40px" />
  //     </span>
  //   </div>; 
  // }

  return (
    <div className="w-full max-w-[845px] h-auto md:h-[290px] border-1 border-[#CDCED1] p-6 rounded-lg">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 cursor-pointer">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onEdit}
          className="flex items-center text-blue-600 gap-2 hover:underline cursor-pointer"
        >
          <FaEdit />
          Edit
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <p className="text-lg font-semibold">{field.label}</p>
            <p className="text-gray-600">{field.value || "Not available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
