export type GuestCounts = { adults: number; rooms: number; childAges: number[] };

export const DEFAULT_CHILD_AGE = 8;

export const summariseGuests = ({ adults, rooms, childAges }: GuestCounts) => {
  const children = childAges.length;
  return [
    `${adults} adult${adults === 1 ? "" : "s"}`,
    children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : null,
    `${rooms} room${rooms === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join(", ");
};
