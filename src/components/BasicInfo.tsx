import { FaEdit } from "react-icons/fa";

interface Field {
  label: string;
  value: string;
}

interface BasicInfoProps {
  title: string;
  fields: Field[];
  onEdit: () => void;
}

export default function BasicInfo({ title, fields, onEdit }: BasicInfoProps) {
  return (
    <div className="w-full md:w-[845px] h-auto md:h-[290px] border-1 border-[#CDCED1] p-6 rounded-lg">

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
            <p className="text-gray-600">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
