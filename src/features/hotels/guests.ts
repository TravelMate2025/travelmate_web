export type GuestCounts = { adults: number; children: number; rooms: number };

export const summariseGuests = ({ adults, children, rooms }: GuestCounts) =>
  [
    `${adults} adult${adults === 1 ? "" : "s"}`,
    children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : null,
    `${rooms} room${rooms === 1 ? "" : "s"}`,
  ]
    .filter(Boolean)
    .join(", ");
