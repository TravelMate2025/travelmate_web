import type { FlightBooking, Segment } from "../types";

// "Add to calendar": an .ics file with one event per flight. Times are the
// airports' local times written as floating times (no timezone), so they show
// as printed on the ticket. Built in the browser from the booking.

const icsDate = (atLocal: string) => atLocal.replace(/[-:]/g, "").slice(0, 15);
const escape = (text: string) => text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const event = (booking: FlightBooking, segment: Segment, stamp: string) =>
  [
    "BEGIN:VEVENT",
    `UID:${booking.reference}-${segment.id}@travelmate`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(segment.from.atLocal)}`,
    `DTEND:${icsDate(segment.to.atLocal)}`,
    `SUMMARY:${escape(`Flight ${segment.marketing.code}${segment.marketing.number} ${segment.from.iata} → ${segment.to.iata}`)}`,
    `LOCATION:${escape(`${segment.from.airportName} (${segment.from.iata})`)}`,
    `DESCRIPTION:${escape(
      `${segment.marketing.name} ${segment.marketing.code}${segment.marketing.number}\nAirline reference: ${booking.pnr ?? "pending"}\nTravelMate booking: ${booking.reference}\nTimes are local to each airport.`
    )}`,
    "END:VEVENT",
  ].join("\r\n");

export const bookingCalendar = (booking: FlightBooking, now = new Date()) => {
  const stamp = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const events = booking.offer.itineraries.flatMap((it) => it.segments.map((s) => event(booking, s, stamp)));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TravelMate//Flights//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
};
