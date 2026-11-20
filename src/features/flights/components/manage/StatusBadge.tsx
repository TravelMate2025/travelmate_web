import type { BadgeTone, StatusBadge as Badge } from "../../booking/manage";

// Mock (Manage): pill, 8px × 14px, 14px bold. Also used on My bookings.
const TONES: Record<BadgeTone, string> = {
  blue: "bg-[#E8EEF7] text-[#012A5D]",
  green: "bg-[#EAF6EF] text-[#145A33]",
  amber: "bg-[#FFF1E8] text-[#7C2D12]",
  red: "bg-[#FDECEA] text-[#B42318]",
  grey: "bg-[#EBECED] text-[#4E4F52]",
};

export const StatusBadge = ({ badge, size = "md" }: { badge: Badge; size?: "md" | "sm" }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap rounded-full font-bold ${size === "md" ? "px-3.5 py-2 text-sm" : "px-2.5 py-1 text-xs"} ${TONES[badge.tone]}`}
  >
    {badge.text}
  </span>
);
