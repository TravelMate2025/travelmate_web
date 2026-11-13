import CheckIcon from "@mui/icons-material/Check";
import { SECTION_CLASS, SECTION_TITLE_CLASS } from "./landingStyles";

// Copy from the approved mock, without naming our supplier (customers book with
// TravelMate, not a distribution system). Its fourth item ("[Support hours]")
// waits until the support hours we can promise are confirmed.
const REASONS = [
  {
    title: "Real airline fares",
    body: "Live fares and seats straight from the airlines, the same ones they sell themselves.",
  },
  {
    title: "Price confirmed before you pay",
    body: "We check your price with the airline before payment, and tell you if it changed. No hidden booking fees.",
  },
  {
    title: "Clear fare rules",
    body: "Bags, seat choice, changes and refunds for your exact fare are shown before you pay.",
  },
];

export const WhyBook = () => (
  <section aria-labelledby="flights-why-h" className={SECTION_CLASS}>
    <h2 id="flights-why-h" className={`${SECTION_TITLE_CLASS} mb-2`}>
      Why book your flight with us
    </h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {REASONS.map((r) => (
        <div key={r.title} className="flex items-start gap-3.5">
          <span className="flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1E8] text-[#C2410C]">
            <CheckIcon fontSize="small" />
          </span>
          <div>
            <p className="mb-1 font-bold text-[#181818]">{r.title}</p>
            <p className="text-sm leading-relaxed text-[#4E4F52]">{r.body}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
