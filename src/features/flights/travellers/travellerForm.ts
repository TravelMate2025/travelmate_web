import { COUNTRIES } from "./countries";
import type {
  BookingRequirements,
  ContactInput,
  Gender,
  TravelerInput,
  TravelerRequirements,
  TravelerType,
} from "../types";

// The traveller form (mock: Travelers). One entry per traveller the airline
// priced, shaped by its booking requirements: we only ask what it needs,
// plus names, contact details and ages for children and infants.

export interface TravellerDraft {
  travelerId: string;
  type: TravelerType;
  gender: Gender | "";
  firstName: string;
  lastName: string;
  /** YYYY-MM-DD or "" */
  dateOfBirth: string;
  associatedAdultId: string;
  passportNumber: string;
  passportCountry: string;
  /** YYYY-MM-DD or "" */
  passportExpiry: string;
  frequentFlyerAirline: string;
  frequentFlyerNumber: string;
}

export interface ContactDraft {
  email: string;
  /** ISO country for the phone; the calling code comes from it (+1 is shared by the US and Canada). */
  phoneCountry: string;
  phoneNumber: string;
}

export interface TravellerForm {
  travellers: TravellerDraft[];
  contact: ContactDraft;
}

const TYPE_LABEL: Record<TravelerType, string> = {
  ADULT: "Adult",
  CHILD: "Child",
  HELD_INFANT: "Infant on lap",
  SEATED_INFANT: "Infant in own seat",
};

/** "Adult 1 · lead traveller", "Child 1", "Infant on lap 1" */
export const travellerHeading = (travellers: TravellerDraft[], index: number) => {
  const t = travellers[index];
  const number = travellers.slice(0, index + 1).filter((x) => x.type === t.type).length;
  return `${TYPE_LABEL[t.type]} ${number}${index === 0 ? " · lead traveller" : ""}`;
};

export const emptyTraveller = (travelerId: string, type: TravelerType): TravellerDraft => ({
  travelerId,
  type,
  gender: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  associatedAdultId: "",
  passportNumber: "",
  passportCountry: "",
  passportExpiry: "",
  frequentFlyerAirline: "",
  frequentFlyerNumber: "",
});

/** New form from the airline's requirements; keeps what was typed for the same travellers. */
export const buildForm = (
  requirements: BookingRequirements,
  saved: { travelers: TravelerInput[]; contact: ContactInput | null },
  defaultCountry: string
): TravellerForm => {
  const adults = requirements.travelers.filter((t) => t.type === "ADULT");
  let nextLap = 0;
  const travellers = requirements.travelers.map((req) => {
    const previous = saved.travelers.find((t) => t.travelerId === req.travelerId && t.type === req.type);
    if (previous) return fromInput(previous);
    const draft = emptyTraveller(req.travelerId, req.type);
    // Lap infants start on different adults (one lap each)
    if (req.type === "HELD_INFANT") draft.associatedAdultId = adults[nextLap++]?.travelerId ?? "";
    return draft;
  });
  return {
    travellers,
    contact: saved.contact
      ? { email: saved.contact.email, phoneCountry: countryForCode(saved.contact.phoneCountryCode, defaultCountry), phoneNumber: saved.contact.phoneNumber }
      : { email: "", phoneCountry: defaultCountry, phoneNumber: "" },
  };
};

const fromInput = (t: TravelerInput): TravellerDraft => ({
  travelerId: t.travelerId,
  type: t.type,
  gender: t.gender ?? "",
  firstName: t.firstName,
  lastName: t.lastName,
  dateOfBirth: t.dateOfBirth ?? "",
  associatedAdultId: t.associatedAdultId ?? "",
  passportNumber: t.passport?.number ?? "",
  passportCountry: t.passport?.issuingCountry ?? "",
  passportExpiry: t.passport?.expiryDate ?? "",
  frequentFlyerAirline: t.frequentFlyer?.airlineCode ?? "",
  frequentFlyerNumber: t.frequentFlyer?.number ?? "",
});

/** Names go to the airline in capitals, single-spaced. */
export const cleanName = (name: string) => name.trim().replace(/\s+/g, " ").toUpperCase();

export const toInputs = (form: TravellerForm): { travelers: TravelerInput[]; contact: ContactInput } => ({
  travelers: form.travellers.map((t) => ({
    travelerId: t.travelerId,
    type: t.type,
    firstName: cleanName(t.firstName),
    lastName: cleanName(t.lastName),
    gender: t.gender || null,
    dateOfBirth: t.dateOfBirth || null,
    associatedAdultId: t.type === "HELD_INFANT" ? t.associatedAdultId : null,
    passport: t.passportNumber.trim()
      ? { number: t.passportNumber.trim().toUpperCase(), expiryDate: t.passportExpiry, issuingCountry: t.passportCountry, nationality: null }
      : null,
    frequentFlyer:
      t.frequentFlyerNumber.trim() && t.frequentFlyerAirline
        ? { airlineCode: t.frequentFlyerAirline, number: t.frequentFlyerNumber.trim().toUpperCase() }
        : null,
  })),
  contact: {
    email: form.contact.email.trim(),
    phoneCountryCode: callingCodeOf(form.contact.phoneCountry),
    phoneNumber: form.contact.phoneNumber.replace(/\D/g, ""),
  },
});

export const callingCodeOf = (iso: string) => {
  const code = COUNTRIES.find((c) => c.iso === iso)?.callingCode;
  return code ? `+${code}` : "";
};

/** A saved "+1" back to a country, preferring the visitor's own when codes are shared. */
export const countryForCode = (callingCode: string, preferred: string) => {
  const matches = COUNTRIES.filter((c) => `+${c.callingCode}` === callingCode);
  return (matches.find((c) => c.iso === preferred) ?? matches[0])?.iso ?? preferred;
};

export const requirementFor = (requirements: BookingRequirements, travelerId: string): TravelerRequirements | undefined =>
  requirements.travelers.find((t) => t.travelerId === travelerId);
