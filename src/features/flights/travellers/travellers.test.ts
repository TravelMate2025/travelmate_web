import { describe, expect, it } from "vitest";
import type { BookingRequirements } from "../types";
import { buildForm, cleanName, emptyTraveller, toInputs, travellerHeading, type TravellerForm } from "./travellerForm";
import { ageOn, pairLength, shortenPair, validateTravellers } from "./validateTravellers";

// Requirements as the recorded price check returns them (email + mobile, DOB for non-adults)
const requirements: BookingRequirements = {
  emailRequired: true,
  mobileRequired: true,
  travelers: [
    { travelerId: "1", type: "ADULT", genderRequired: false, dateOfBirthRequired: false, passportRequired: false, residenceRequired: false },
    { travelerId: "2", type: "ADULT", genderRequired: false, dateOfBirthRequired: false, passportRequired: false, residenceRequired: false },
    { travelerId: "3", type: "CHILD", genderRequired: false, dateOfBirthRequired: true, passportRequired: false, residenceRequired: false },
    { travelerId: "4", type: "HELD_INFANT", genderRequired: false, dateOfBirthRequired: true, passportRequired: false, residenceRequired: false },
  ],
};
const dates = { firstDeparture: "2026-12-15", lastFlight: "2026-12-29", today: "2026-11-13" };

const filled = (): TravellerForm => {
  const form = buildForm(requirements, { travelers: [], contact: null }, "NG");
  const [a1, a2, child, infant] = form.travellers;
  Object.assign(a1, { firstName: "Adaeze", lastName: "Okafor" });
  Object.assign(a2, { firstName: "Emeka", lastName: "Okafor" });
  Object.assign(child, { firstName: "Chidi", lastName: "Okafor", dateOfBirth: "2018-03-02" });
  Object.assign(infant, { firstName: "Ada", lastName: "Okafor", dateOfBirth: "2026-01-20" });
  form.contact = { email: "adaeze@example.com", phoneCountry: "NG", phoneNumber: "801 234 5678" };
  return form;
};

describe("traveller form", () => {
  it("builds one entry per priced traveller and puts the lap infant on an adult", () => {
    const form = buildForm(requirements, { travelers: [], contact: null }, "GB");
    expect(form.travellers.map((t) => t.type)).toEqual(["ADULT", "ADULT", "CHILD", "HELD_INFANT"]);
    expect(form.travellers[3].associatedAdultId).toBe("1");
    expect(form.contact.phoneCountry).toBe("GB");
    expect(travellerHeading(form.travellers, 0)).toBe("Adult 1 · lead traveller");
    expect(travellerHeading(form.travellers, 1)).toBe("Adult 2");
    expect(travellerHeading(form.travellers, 3)).toBe("Infant on lap 1");
  });

  it("accepts a complete family and sends capitalised names and digits only", () => {
    const form = filled();
    expect(validateTravellers(form, requirements, dates)).toEqual({});
    const { travelers, contact } = toInputs(form);
    expect(travelers[0]).toMatchObject({ firstName: "ADAEZE", lastName: "OKAFOR", passport: null, associatedAdultId: null });
    expect(travelers[3]).toMatchObject({ type: "HELD_INFANT", associatedAdultId: "1", dateOfBirth: "2026-01-20" });
    expect(contact).toMatchObject({ phoneCountryCode: "+234", phoneNumber: "8012345678" });
    expect(cleanName("  mary   ann ")).toBe("MARY ANN");
  });

  it("keeps the chosen country when calling codes are shared", () => {
    const form = buildForm(requirements, { travelers: [], contact: { email: "a@b.co", phoneCountryCode: "+1", phoneNumber: "2125550100" } }, "US");
    expect(form.contact.phoneCountry).toBe("US");
    expect(buildForm(requirements, { travelers: [], contact: { email: "a@b.co", phoneCountryCode: "+1", phoneNumber: "1" } }, "CA").contact.phoneCountry).toBe("CA");
  });

  it("asks only for what's missing", () => {
    const form = buildForm(requirements, { travelers: [], contact: null }, "NG");
    const errors = validateTravellers(form, requirements, dates);
    expect(errors["t1.firstName"]).toBe("Enter the first and middle names as on the passport");
    expect(errors["t1.dateOfBirth"]).toBeUndefined(); // optional for adults on this flight
    expect(errors["t3.dateOfBirth"]).toBe("Enter the date of birth");
    expect(errors["t1.gender"]).toBeUndefined(); // the airline didn't ask for it
    expect(errors["contact.email"]).toBe("Enter an email for your e-ticket");
  });

  it("checks names, ages and passports against the trip", () => {
    const form = filled();
    form.travellers[0].firstName = "Adaézé";
    form.travellers[1].lastName = "Okafor-Nwachukwu-Eze";
    form.travellers[1].lastName += "x";
    form.travellers[2].dateOfBirth = "2024-12-01"; // 2 at the start? no: just turned 2 on 1 Dec 2026, fine
    form.travellers[3].dateOfBirth = "2024-12-20"; // turns 2 during the trip
    Object.assign(form.travellers[0], { passportNumber: "A1234567", passportCountry: "NG", passportExpiry: "2026-12-20" });
    const errors = validateTravellers(form, requirements, dates);
    expect(errors["t1.firstName"]).toMatch(/plain letters/);
    expect(errors["t2.lastName"]).toBe("Up to 20 characters. Leave out extra names if needed");
    expect(errors["t3.dateOfBirth"]).toBeUndefined();
    expect(errors["t4.dateOfBirth"]).toBe("Infants must be under 2 for the whole trip. Book them as a child instead");
    expect(errors["t1.passportExpiry"]).toBe("The passport must be valid until after your last flight");
    expect(ageOn("2014-12-16", "2026-12-15")).toBe(11);
  });

  it("allows only one infant per adult lap", () => {
    const form = filled();
    form.travellers.push({ ...emptyTraveller("5", "HELD_INFANT"), firstName: "Obi", lastName: "Okafor", dateOfBirth: "2026-02-01", associatedAdultId: "1" });
    const reqs = { ...requirements, travelers: [...requirements.travelers, { ...requirements.travelers[3], travelerId: "5" }] };
    expect(validateTravellers(form, reqs, dates)["t5.associatedAdultId"]).toBe("Each adult can have only one infant on their lap");
  });
});

describe("adult + infant names (41 characters together)", () => {
  it("flags a pair that's too long and suggests the guide's shortening", () => {
    const adult = { firstName: "Oluwaseun Adebayo", lastName: "Ogunlesi-Adeyemi" };
    const infant = { firstName: "Oluwatobi Ayomide", lastName: "Ogunlesi-Adeyemi" }; // each name within 20
    const form = filled();
    Object.assign(form.travellers[0], adult);
    Object.assign(form.travellers[3], infant);
    expect(pairLength(form.travellers[0], form.travellers[3])).toBe(68);
    expect(validateTravellers(form, requirements, dates)["t4.pairName"]).toMatch(/too long together/);

    // Extra first names go (infant, then adult); hyphenated last names stay one name; then initials
    expect(shortenPair(adult, infant)).toEqual({
      adult: { firstName: "O", lastName: "Ogunlesi-Adeyemi" },
      infant: { firstName: "O", lastName: "Ogunlesi-Adeyemi" },
    });
    expect(shortenPair({ firstName: "Mary Ann", lastName: "Obi" }, { firstName: "Grace Ifeoma Chiamaka", lastName: "Okonkwo Obi" })).toEqual({
      adult: { firstName: "Mary Ann", lastName: "Obi" },
      infant: { firstName: "Grace", lastName: "Okonkwo Obi" },
    });
  });

  it("leaves names that already fit", () => {
    const pair = { adult: { firstName: "Ada", lastName: "Obi" }, infant: { firstName: "Ife", lastName: "Obi" } };
    expect(shortenPair(pair.adult, pair.infant)).toEqual(pair);
  });
});
