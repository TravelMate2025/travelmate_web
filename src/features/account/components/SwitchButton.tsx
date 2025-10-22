import React from "react";

interface SwitchButtonProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between w-full py-2">
      {label && (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </span>
      )}

      <label className="relative inline-flex items-center cursor-pointer">
        {/* Hidden checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        {/* Track (background) */}
        <div
          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
            checked ? "bg-blue-800" : "bg-gray-400"
          }`}
        ></div>

        {/* Knob (toggle circle) */}
        <div
          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </label>
    </div>
  );
};

export default SwitchButton;
