export type StaySearchStayType = "unit_level" | "room_level";

export type StaySearchLocationOption = {
  destinationLabel: string;
  country: string;
  adminLevels: string[];
  cities: string[];
};

export const staySearchLocationOptions: StaySearchLocationOption[] = [
  {
    destinationLabel: "Benin City, Edo, Nigeria",
    country: "Nigeria",
    adminLevels: ["Edo"],
    cities: ["Egor", "Benin City"],
  },
  {
    destinationLabel: "Lekki, Lagos, Nigeria",
    country: "Nigeria",
    adminLevels: ["Lagos"],
    cities: ["Lekki", "Ikeja"],
  },
  {
    destinationLabel: "Dubai, United Arab Emirates",
    country: "United Arab Emirates",
    adminLevels: ["Dubai"],
    cities: ["Dubai"],
  },
];

export const staySearchStayTypeOptions: Array<{
  label: string;
  value: StaySearchStayType;
}> = [
  { label: "Unit stay", value: "unit_level" },
  { label: "Room stay", value: "room_level" },
];
