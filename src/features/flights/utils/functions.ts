
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { airports } from "../data";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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



export async function downloadSectionAsPDF(
  elementId: string,
  filename?: string
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${filename || "document"}.pdf`);
}
