
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { airports } from "../data";

export function formatDuration(duration: string): string {
  // Amadeus returns "PT4H15M"
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);

  const hours = hoursMatch ? `${hoursMatch[1]}h` : "";
  const minutes = minutesMatch ? ` ${minutesMatch[1]}m` : "";

  return `${hours}${minutes}`.trim();
}

export function formatStops(stops: number): string {
  if (stops === 0) return "Non-stop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getCity(code: string) {
  return airports.find((airport)=> airport.iata_code === code)
  
}