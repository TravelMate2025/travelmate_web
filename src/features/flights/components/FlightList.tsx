// components/FlightList.tsx
import React from "react";
import { Pagination, Stack } from "@mui/material";
import FlightCard, { Flight } from "./FlightCard";
import EmptyState from "./EmptyState";


interface FlightListProps {
  items: Flight[];
  page: number;
  totalPages: number;
  onPageChange: (_: React.ChangeEvent<unknown>, value: number) => void;
  onSelectFlight: (flight: Flight) => void;
}

const FlightList: React.FC<FlightListProps> = ({
  items,
  page,
  totalPages,
  onPageChange,
  onSelectFlight,
}) => {
  return (
    <div className="mt-[24px] w-[90%] m-auto">
      {items.length > 0 ? (
        items.map((depart) => (
          <FlightCard
            key={depart.id}
            depart={depart}
            onClick={() => onSelectFlight(depart)}
          />
        ))
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      <Stack spacing={2} className="mt-8">
        <Pagination
          count={totalPages}
          shape="rounded"
          page={page}
          onChange={onPageChange}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Stack>
    </div>
  );
};

export default FlightList;
