import React from "react";

type Props = {
  categories: any[];
  selectedCategoryId: number;
  onSelect: (id: number) => void;
};

const FaqTabs: React.FC<Props> = ({ categories, selectedCategoryId, onSelect }) => {
  return (
    <div className="w-full md:w-1/3 md:border border-gray-300 md:rounded-lg overflow-hidden flex md:flex-col flex-row">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`
            text-center px-4 py-3 transition border-b md:border-b border-gray-200
            md:w-full w-1/4
            ${
              category.id === selectedCategoryId
                ? "md:bg-blue-100 md:text-[#023E8A] md:font-semibold border-orange-500 border-b-2 md:border-none"
                : "hover:bg-gray-100"
            }
          `}
          onClick={() => onSelect(category.id)}
        >
          {category.short_name}
        </button>
      ))}
    </div>
  );
};

export default FaqTabs;
