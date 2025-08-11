interface SortModalProps {
  selectedSort: string;
  onClose: () => void;
  onSelect: (option: string) => void;
}

export default function SortModal({ selectedSort, onClose, onSelect }: SortModalProps) {
  const options = ["Recommended", "Price: low to high", "Price: high to low"];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="w-[393px] h-[201px] bg-white rounded-lg shadow-3xl shadow-[0_6px_30px_rgba(0,0,0,0.8)] flex flex-col"
      >
        {options.map((option, index) => (
          <button
            key={option}
            className={`w-full py-4 text-lg ${
              selectedSort === option ? "bg-[#023E8A] text-white" : "bg-white text-black"
            } ${index === 0 ? "rounded-t-lg" : ""} ${index === options.length - 1 ? "rounded-b-lg" : ""}`}
            onClick={() => {
              onSelect(option);
              onClose();
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
