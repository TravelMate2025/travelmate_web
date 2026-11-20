import { COUNTRIES } from "../../travellers/countries";
import type { ContactDraft } from "../../travellers/travellerForm";
import type { TravellerErrors } from "../../travellers/validateTravellers";
import { Field } from "./formFields";
import { HINT, INPUT, invalidProps } from "./formStyles";

// Mock (Travelers, "Contact details"): email, country code and mobile.
interface ContactCardProps {
  contact: ContactDraft;
  emailRequired: boolean;
  mobileRequired: boolean;
  errors: TravellerErrors;
  onChange: (patch: Partial<ContactDraft>) => void;
}

export const ContactCard = ({ contact, emailRequired, mobileRequired, errors, onChange }: ContactCardProps) => (
  <section aria-labelledby="contact-heading" className="flex flex-col gap-4 rounded-2xl border border-[#DEDFE1] bg-white p-5.5">
    <div>
      <h2 id="contact-heading" className="mb-1 text-[1.1875rem] font-bold text-[#181818]">
        Contact details
      </h2>
      <p className={HINT}>The airline uses these for delays and schedule changes. We send your e-ticket here.</p>
    </div>
    <div className="flex flex-wrap gap-3.5">
      <Field id="contact-email" label="Email" required={emailRequired} error={errors["contact.email"]}>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          value={contact.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className={INPUT}
          {...invalidProps("contact-email", errors["contact.email"])}
        />
      </Field>
      <Field id="contact-code" label="Country code" required={mobileRequired} error={errors["contact.phoneCountryCode"]} size="flex-[0_1_8.75rem]">
        <select
          id="contact-code"
          value={contact.phoneCountry}
          onChange={(e) => onChange({ phoneCountry: e.target.value })}
          className={INPUT}
          {...invalidProps("contact-code", errors["contact.phoneCountryCode"])}
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              +{c.callingCode} {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="contact-mobile" label="Mobile number" required={mobileRequired} error={errors["contact.phoneNumber"]}>
        <input
          id="contact-mobile"
          type="tel"
          autoComplete="tel-national"
          value={contact.phoneNumber}
          onChange={(e) => onChange({ phoneNumber: e.target.value })}
          className={INPUT}
          {...invalidProps("contact-mobile", errors["contact.phoneNumber"])}
        />
      </Field>
    </div>
  </section>
);
