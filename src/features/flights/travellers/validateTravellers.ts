import type { BookingRequirements } from "../types";
import { requirementFor, type TravellerDraft, type TravellerForm } from "./travellerForm";

// Rules from the Amadeus AIR Quick Connect guide (flights_plan.md A5):
// - first name and last name: up to 20 characters each (error 477)
// - an adult and the infant on their lap: full names up to 41 characters
//   together; shorten by dropping extra first names, then extra last names,
//   then using an initial, with the customer approving the result
// - names in plain letters (A–Z), spaces, hyphens and apostrophes
// Ages are checked against the trip: children 2–11 when the trip starts,
// infants under 2 for the whole trip, adults 12+.

export const NAME_MAX = 20;
export const ADULT_INFANT_NAME_MAX = 41;
const NAME_PATTERN = /^[A-Za-z][A-Za-z '-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type TravellerErrors = Partial<Record<string, string>>;

export interface TripDates {
  /** Local date of the first departure, YYYY-MM-DD */
  firstDeparture: string;
  /** Local date of the last flight, YYYY-MM-DD */
  lastFlight: string;
  today: string;
}

/** Whole years between two YYYY-MM-DD dates. */
export const ageOn = (dateOfBirth: string, on: string) => {
  const [by, bm, bd] = dateOfBirth.split("-").map(Number);
  const [y, m, d] = on.split("-").map(Number);
  return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
};

const fullName = (t: Pick<TravellerDraft, "firstName" | "lastName">) =>
  `${t.firstName.trim().replace(/\s+/g, " ")} ${t.lastName.trim().replace(/\s+/g, " ")}`.trim();

/** Characters the airline counts for an adult + lap infant pair. */
export const pairLength = (adult: TravellerDraft, infant: TravellerDraft) => fullName(adult).length + fullName(infant).length;

type Names = { firstName: string; lastName: string };
const firstWord = (s: string) => s.trim().split(/\s+/)[0] ?? "";

/**
 * The guide's shortening, step by step until the pair fits: drop extra first
 * names, then extra last names, then use first-name initials. Infant first,
 * then adult, at each step. Null when even that doesn't fit.
 */
export const shortenPair = (adult: Names, infant: Names): { adult: Names; infant: Names } | null => {
  const fits = (a: Names, i: Names) => fullName(a).length + fullName(i).length <= ADULT_INFANT_NAME_MAX;
  let a = { ...adult };
  let i = { ...infant };
  if (fits(a, i)) return { adult: a, infant: i };
  const steps: ((n: Names) => Names)[] = [
    (n) => ({ ...n, firstName: firstWord(n.firstName) }),
    (n) => ({ ...n, lastName: firstWord(n.lastName) }),
    (n) => ({ ...n, firstName: firstWord(n.firstName).charAt(0) }),
  ];
  for (const step of steps) {
    i = step(i);
    if (fits(a, i)) return { adult: a, infant: i };
    a = step(a);
    if (fits(a, i)) return { adult: a, infant: i };
  }
  return null;
};

const checkName = (value: string, label: string): string | null => {
  const v = value.trim();
  if (!v) return `Enter the ${label} as on the passport`;
  if (!NAME_PATTERN.test(v)) return "Use plain letters (A–Z) only, as printed in the passport's machine-readable lines";
  if (v.replace(/\s+/g, " ").length > NAME_MAX) return `Up to ${NAME_MAX} characters. Leave out extra names if needed`;
  return null;
};

const isRealDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
};

const checkAge = (t: TravellerDraft, dates: TripDates): string | null => {
  const atStart = ageOn(t.dateOfBirth, dates.firstDeparture);
  if (t.type === "ADULT" && atStart < 12) return "Adults must be 12 or older when the trip starts";
  if (t.type === "CHILD" && (atStart < 2 || atStart > 11)) return "Children must be 2 to 11 when the trip starts";
  if ((t.type === "HELD_INFANT" || t.type === "SEATED_INFANT") && ageOn(t.dateOfBirth, dates.lastFlight) >= 2) {
    return "Infants must be under 2 for the whole trip. Book them as a child instead";
  }
  return null;
};

export const validateTravellers = (form: TravellerForm, requirements: BookingRequirements, dates: TripDates): TravellerErrors => {
  const errors: TravellerErrors = {};
  const set = (key: string, message: string | null) => {
    if (message) errors[key] = message;
  };

  form.travellers.forEach((t) => {
    const key = (field: string) => `t${t.travelerId}.${field}`;
    const req = requirementFor(requirements, t.travelerId);
    set(key("firstName"), checkName(t.firstName, "first and middle names"));
    set(key("lastName"), checkName(t.lastName, "last name"));
    if (req?.genderRequired && !t.gender) set(key("gender"), "Choose a gender");

    const dobNeeded = req?.dateOfBirthRequired || t.type !== "ADULT";
    if (!t.dateOfBirth) {
      if (dobNeeded) set(key("dateOfBirth"), "Enter the date of birth");
    } else if (!isRealDate(t.dateOfBirth) || t.dateOfBirth > dates.today) {
      set(key("dateOfBirth"), "Enter a real date of birth (DD / MM / YYYY)");
    } else {
      set(key("dateOfBirth"), checkAge(t, dates));
    }

    const anyPassport = Boolean(t.passportNumber.trim() || t.passportExpiry || t.passportCountry);
    if (req?.passportRequired || anyPassport) {
      if (!/^[A-Za-z0-9]{5,20}$/.test(t.passportNumber.trim())) set(key("passportNumber"), "Enter the passport number (letters and numbers)");
      if (!t.passportCountry) set(key("passportCountry"), "Choose the issuing country");
      if (!t.passportExpiry) set(key("passportExpiry"), "Enter the expiry date");
      else if (!isRealDate(t.passportExpiry)) set(key("passportExpiry"), "Enter a real date (DD / MM / YYYY)");
      else if (t.passportExpiry <= dates.lastFlight) set(key("passportExpiry"), "The passport must be valid until after your last flight");
    }

    if (t.frequentFlyerNumber.trim() && !t.frequentFlyerAirline) set(key("frequentFlyerAirline"), "Choose the airline");

    if (t.type === "HELD_INFANT") {
      const adult = form.travellers.find((a) => a.travelerId === t.associatedAdultId && a.type === "ADULT");
      if (!adult) set(key("associatedAdultId"), "Choose the adult this infant travels with");
      else if (form.travellers.some((o) => o !== t && o.type === "HELD_INFANT" && o.associatedAdultId === t.associatedAdultId)) {
        set(key("associatedAdultId"), "Each adult can have only one infant on their lap");
      } else if (!errors[key("firstName")] && !errors[key("lastName")] && pairLength(adult, t) > ADULT_INFANT_NAME_MAX) {
        set(key("pairName"), `This infant's and ${adult.firstName.trim() || "the adult"}'s names are too long together for the airline`);
      }
    }
  });

  const email = form.contact.email.trim();
  if (requirements.emailRequired || email) {
    if (!email) set("contact.email", "Enter an email for your e-ticket");
    else if (!EMAIL_PATTERN.test(email)) set("contact.email", "Enter a valid email address");
  }
  const digits = form.contact.phoneNumber.replace(/\D/g, "");
  if (requirements.mobileRequired || digits) {
    if (!form.contact.phoneCountry) set("contact.phoneCountryCode", "Choose a country code");
    if (digits.length < 6 || digits.length > 14) set("contact.phoneNumber", "Enter a mobile number the airline can text");
  }
  return errors;
};
