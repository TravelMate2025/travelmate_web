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
    <div className="w-[845px] h-[290px] border-2 border-gray-300 p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button
          onClick={onEdit}
          className="flex items-center text-blue-600 gap-2 hover:underline"
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
