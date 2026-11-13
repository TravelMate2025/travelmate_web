import { format } from "date-fns";
import { cabinLabel } from "../search/searchDraft";
import { formatDuration, localDate, timeOf } from "../results/offerFacts";
import { titleCase } from "../travellers/names";
import type { FlightBooking } from "../types";
import { routeName, segmentTimes, statusBadge, travellersText, tripDates } from "./manage";

// "Download itinerary (PDF)" on Manage. A plain itinerary summary built from
// the booking, not the airline's e-ticket receipt. jsPDF is loaded on click so
// it stays out of the page bundle.

export interface ItineraryLine {
  text: string;
  style: "title" | "heading" | "bold" | "normal" | "hint";
}

/** The lines of the PDF, top to bottom (kept separate so it can be tested). */
export const itineraryLines = (booking: FlightBooking): ItineraryLine[] => {
  const { offer } = booking;
  const lines: ItineraryLine[] = [
    { text: "TravelMate · Flight itinerary", style: "title" },
    { text: `${routeName(offer)} · ${tripDates(offer)} · ${travellersText(booking)}`, style: "normal" },
    { text: `Status: ${statusBadge(booking).text}`, style: "normal" },
    { text: `TravelMate booking: ${booking.reference}`, style: "bold" },
    { text: `Airline reference (${offer.validatingAirline.name}): ${booking.pnr ?? "Pending"}`, style: "bold" },
    { text: "Travellers", style: "heading" },
    ...booking.travelers.map((t) => ({
      text: `${titleCase(t.firstName)} ${titleCase(t.lastName)} · E-ticket ${t.ticketNumber ?? "pending"}`,
      style: "normal" as const,
    })),
  ];
  offer.itineraries.forEach((it, index) => {
    const label = offer.itineraries.length === 2 ? (index === 0 ? "Outbound" : "Return") : offer.itineraries.length === 1 ? "Outbound" : `Flight ${index + 1}`;
    lines.push({ text: `${label} · ${format(localDate(it.segments[0].from.atLocal), "EEE d MMM yyyy")} · ${formatDuration(it.durationMinutes)}`, style: "heading" });
    it.segments.forEach((s) => {
      const { departLocal, arriveLocal } = segmentTimes(booking, s);
      const operated = s.operating ? ` · operated by ${s.operating.name}` : "";
      lines.push({ text: `${s.marketing.code}${s.marketing.number} · ${s.marketing.name}${operated} · ${cabinLabel(s.cabin)}`, style: "bold" });
      lines.push({
        text: `${format(localDate(departLocal), "d MMM")} ${timeOf(departLocal)} ${s.from.airportName} (${s.from.iata})${s.from.terminal ? ` T${s.from.terminal}` : ""}`,
        style: "normal",
      });
      lines.push({
        text: `${format(localDate(arriveLocal), "d MMM")} ${timeOf(arriveLocal)} ${s.to.airportName} (${s.to.iata})${s.to.terminal ? ` T${s.to.terminal}` : ""}`,
        style: "normal",
      });
    });
  });
  lines.push({ text: "Times are local at each airport. Check in with the airline using the airline reference.", style: "hint" });
  return lines;
};

const STYLE = {
  title: { size: 16, font: "bold", gap: 9 },
  heading: { size: 12, font: "bold", gap: 8 },
  bold: { size: 10, font: "bold", gap: 6 },
  normal: { size: 10, font: "normal", gap: 5.5 },
  hint: { size: 9, font: "normal", gap: 8 },
} as const;

export const downloadItineraryPdf = async (booking: FlightBooking) => {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;
  itineraryLines(booking).forEach((line) => {
    const style = STYLE[line.style];
    doc.setFont("helvetica", style.font);
    doc.setFontSize(style.size);
    // jsPDF's built-in fonts only cover Latin-1, so the arrows are spelled out
    const text = doc.splitTextToSize(line.text.replace(/⇄/g, "<->").replace(/→/g, "->"), width) as string[];
    if (line.style === "heading") y += 3;
    if (y + text.length * style.gap > bottom) {
      doc.addPage();
      y = margin;
    }
    doc.text(text, margin, y);
    y += text.length * style.gap;
  });
  doc.save(`travelmate-${booking.reference}-itinerary.pdf`);
};
