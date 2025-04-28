import React from "react";

type Props = {
  categories: any[];
  selectedCategoryId: number;
  onSelect: (id: number) => void;
};

const FaqTabs: React.FC<Props> = ({ categories, selectedCategoryId, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 border border-gray-300 rounded-lg overflow-hidden">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`block w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 transition ${
            category.id === selectedCategoryId
              ? "bg-blue-100 text-[#023E8A] font-semibold"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onSelect(category.id)}
        >
          {category.name_display}
        </button>
      ))}
    </div>
  );
};

export default FaqTabs;
