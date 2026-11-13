import { COUNTRIES } from "../../travellers/countries";
import { travellerHeading, type TravellerDraft } from "../../travellers/travellerForm";
import { ADULT_INFANT_NAME_MAX, NAME_MAX, shortenPair } from "../../travellers/validateTravellers";
import type { Carrier, Gender, TravelerRequirements } from "../../types";
import type { TravellerErrors } from "../../travellers/validateTravellers";
import { DateInput, Field } from "./formFields";
import { HINT, INPUT, invalidProps } from "./formStyles";

// Mock (Travelers): one card per traveller. Gender (if the airline asks),
// names as on passport, date of birth, then optional passport and frequent
// flyer details. An infant on a lap also picks the adult and gets the
// 41-character name check with a suggested shortening.
const DISCLOSURE = "rounded-xl border border-[#DEDFE1] px-4";
const SUMMARY = "flex min-h-13 cursor-pointer items-center font-bold text-[#023E8A]";

interface TravellerCardProps {
  index: number;
  travellers: TravellerDraft[];
  requirement: TravelerRequirements | undefined;
  errors: TravellerErrors;
  airlines: Carrier[];
  showProfileButton: boolean;
  onChange: (patch: Partial<TravellerDraft>) => void;
  onUseProfile: () => void;
  onShortenNames: () => void;
}

export const TravellerCard = ({
  index,
  travellers,
  requirement,
  errors,
  airlines,
  showProfileButton,
  onChange,
  onUseProfile,
  onShortenNames,
}: TravellerCardProps) => {
  const t = travellers[index];
  const id = (field: string) => `t${t.travelerId}-${field}`;
  const err = (field: string) => errors[`t${t.travelerId}.${field}`];
  const isInfant = t.type === "HELD_INFANT" || t.type === "SEATED_INFANT";
  const dobRequired = Boolean(requirement?.dateOfBirthRequired) || t.type !== "ADULT";
  const passportRequired = Boolean(requirement?.passportRequired);
  const passportOpen = passportRequired || Boolean(err("passportNumber") || err("passportCountry") || err("passportExpiry"));
  const adults = travellers.filter((a) => a.type === "ADULT");
  const lapAdult = t.type === "HELD_INFANT" ? travellers.find((a) => a.travelerId === t.associatedAdultId) : undefined;
  const suggestion = err("pairName") && lapAdult ? shortenPair(lapAdult, t) : null;
  const headingId = `t${t.travelerId}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className={`flex flex-col gap-4 rounded-2xl bg-white p-5.5 ${isInfant ? "border border-dashed border-[#CDCED1]" : "border border-[#DEDFE1]"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={headingId} className="text-[1.1875rem] font-bold text-[#181818]">
          {travellerHeading(travellers, index)}
        </h2>
        {showProfileButton && (
          <button
            type="button"
            onClick={onUseProfile}
            className="min-h-11 cursor-pointer rounded-full border border-[#CDCED1] bg-white px-3.5 text-sm font-semibold text-[#023E8A]"
          >
            Use my profile details
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Field id={id("gender")} label="Gender" required={requirement?.genderRequired} error={err("gender")} size="flex-[0_1_9.375rem]">
          <select
            id={id("gender")}
            value={t.gender}
            onChange={(e) => onChange({ gender: e.target.value as Gender | "" })}
            className={INPUT}
            {...invalidProps(id("gender"), err("gender"))}
          >
            <option value="">{requirement?.genderRequired ? "Choose" : "Not given"}</option>
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
            <option value="UNDISCLOSED">Prefer not to say</option>
          </select>
        </Field>
        <Field id={id("first")} label="First and middle names" required hint={`As on passport. Up to ${NAME_MAX} letters.`} error={err("firstName")}>
          <input
            id={id("first")}
            value={t.firstName}
            autoComplete={index === 0 ? "given-name" : "off"}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className={INPUT}
            {...invalidProps(id("first"), err("firstName"))}
          />
        </Field>
        <Field id={id("last")} label="Last name" required error={err("lastName")}>
          <input
            id={id("last")}
            value={t.lastName}
            autoComplete={index === 0 ? "family-name" : "off"}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className={INPUT}
            {...invalidProps(id("last"), err("lastName"))}
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Field
          id={id("dob")}
          label="Date of birth"
          required={dobRequired}
          hint={dobRequired ? undefined : "Optional for this flight."}
          error={err("dateOfBirth")}
          size="flex-[0_1_15rem]"
        >
          <DateInput id={id("dob")} value={t.dateOfBirth} onChange={(dateOfBirth) => onChange({ dateOfBirth })} error={err("dateOfBirth")} />
        </Field>
        {t.type === "HELD_INFANT" && (
          <Field id={id("lap")} label="Travels on the lap of" required error={err("associatedAdultId")}>
            <select
              id={id("lap")}
              value={t.associatedAdultId}
              onChange={(e) => onChange({ associatedAdultId: e.target.value })}
              className={INPUT}
              {...invalidProps(id("lap"), err("associatedAdultId"))}
            >
              <option value="">Choose an adult</option>
              {adults.map((a) => (
                <option key={a.travelerId} value={a.travelerId}>
                  {travellerHeading(travellers, travellers.indexOf(a)).replace(" · lead traveller", "")}
                  {a.firstName || a.lastName ? ` · ${`${a.firstName} ${a.lastName}`.trim()}` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {t.type === "HELD_INFANT" &&
        (err("pairName") ? (
          <div role="alert" className="flex flex-col gap-2 rounded-xl border border-[#F5C2B8] bg-[#FFF1E8] p-4 text-sm text-[#7C2D12]">
            <strong>{err("pairName")}</strong>
            <span>
              An adult's name and their infant's name together can be up to {ADULT_INFANT_NAME_MAX} letters.
              {suggestion
                ? ` We suggest: ${suggestion.adult.firstName} ${suggestion.adult.lastName} and ${suggestion.infant.firstName} ${suggestion.infant.lastName}.`
                : " Please shorten them."}
            </span>
            {suggestion && (
              <button
                type="button"
                onClick={onShortenNames}
                className="min-h-11 cursor-pointer self-start rounded-full border border-[#9A3412] bg-white px-4 text-sm font-semibold text-[#9A3412]"
              >
                Use the shortened names
              </button>
            )}
          </div>
        ) : (
          <p className={HINT}>
            An adult's name and their infant's name together can be up to {ADULT_INFANT_NAME_MAX} letters. If they're longer, we'll suggest a
            shortened version for you to approve.
          </p>
        ))}

      <details className={DISCLOSURE} open={passportOpen || undefined}>
        <summary className={SUMMARY}>{passportRequired ? "Passport details" : "Add passport details (optional)"}</summary>
        <p className={`${HINT} mb-3`}>
          {passportRequired
            ? "This airline needs passport details to book."
            : "Not required to book these flights. Adding them now saves time at airline check-in."}
        </p>
        <div className="flex flex-wrap gap-3.5 pb-4">
          <Field id={id("pp")} label="Passport number" required={passportRequired} error={err("passportNumber")}>
            <input
              id={id("pp")}
              value={t.passportNumber}
              autoComplete="off"
              onChange={(e) => onChange({ passportNumber: e.target.value })}
              className={INPUT}
              {...invalidProps(id("pp"), err("passportNumber"))}
            />
          </Field>
          <Field id={id("ppc")} label="Issuing country" required={passportRequired} error={err("passportCountry")}>
            <select
              id={id("ppc")}
              value={t.passportCountry}
              onChange={(e) => onChange({ passportCountry: e.target.value })}
              className={INPUT}
              {...invalidProps(id("ppc"), err("passportCountry"))}
            >
              <option value="">Choose</option>
              {COUNTRIES.map((c) => (
                <option key={c.iso} value={c.iso}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id={id("ppe")}
            label="Expiry date"
            required={passportRequired}
            hint="Must be valid until after your return."
            error={err("passportExpiry")}
          >
            <DateInput id={id("ppe")} value={t.passportExpiry} onChange={(passportExpiry) => onChange({ passportExpiry })} error={err("passportExpiry")} />
          </Field>
        </div>
      </details>

      {!isInfant && airlines.length > 0 && (
        <details className={DISCLOSURE}>
          <summary className={SUMMARY}>Add frequent flyer number (optional)</summary>
          <div className="flex flex-wrap gap-3.5 pb-4">
            <Field id={id("ffa")} label="Airline programme" error={err("frequentFlyerAirline")}>
              <select
                id={id("ffa")}
                value={t.frequentFlyerAirline}
                onChange={(e) => onChange({ frequentFlyerAirline: e.target.value })}
                className={INPUT}
                {...invalidProps(id("ffa"), err("frequentFlyerAirline"))}
              >
                <option value="">Choose</option>
                {airlines.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={id("ffn")} label="Membership number">
              <input
                id={id("ffn")}
                value={t.frequentFlyerNumber}
                autoComplete="off"
                onChange={(e) => onChange({ frequentFlyerNumber: e.target.value })}
                className={INPUT}
              />
            </Field>
          </div>
        </details>
      )}
    </section>
  );
};
