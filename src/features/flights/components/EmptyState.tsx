// components/EmptyState.tsx
import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <SearchOutlinedIcon sx={{ width: 60, height: 60, color: "#67696D" }} />
      <p className="text-black font-semibold text-[20px] mt-4">
        No Flight Match your Search
      </p>
      <p className="text-[#67696D] w-[80%] m-auto text-center text-[16px] mt-4">
        Looks like there are no flights for your selected route and dates. Try
        selecting different travel dates.
      </p>
    </div>
  );
};

export default EmptyState;
