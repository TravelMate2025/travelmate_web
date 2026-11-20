import type { CurrencyCode } from "./types";

// Agreed default: Nigeria pays in naira, the UK in pounds, everyone else in dollars.
export const currencyForCountry = (countryCode: string | null | undefined): CurrencyCode => {
  const code = countryCode?.toUpperCase();
  if (code === "NG") return "NGN";
  if (code === "GB") return "GBP";
  return "USD";
};

const SOLD: readonly CurrencyCode[] = ["USD", "NGN", "GBP"];

/** A currency we sell, from any casing; null otherwise (blank, "EUR"). */
export const asSoldCurrency = (value: string | null | undefined): CurrencyCode | null => {
  const code = (value ?? "").trim().toUpperCase() as CurrencyCode;
  return SOLD.includes(code) ? code : null;
};

/** Decision F-7: chosen now → saved on the profile → the country's default. */
export const pickCurrency = (chosen: CurrencyCode | null, saved: string | null | undefined, country: string | null | undefined): CurrencyCode =>
  chosen ?? asSoldCurrency(saved) ?? currencyForCountry(country);

/** Best guess at the visitor's country from the browser languages (en-NG -> NG). */
export const browserCountry = (languages: readonly string[] = typeof navigator === "undefined" ? [] : navigator.languages) => {
  for (const tag of languages) {
    const region = tag.split("-")[1];
    if (region && /^[A-Za-z]{2}$/.test(region)) return region.toUpperCase();
  }
  return null;
};

const SYMBOLS: Record<CurrencyCode, string> = { USD: "$", NGN: "₦", GBP: "£" };

/** "$1,299.60", "₦1,220,935.00", "£622.28". Amounts come from the server as decimal strings. */
export const formatMoney = (amount: string, currency: CurrencyCode) =>
  `${SYMBOLS[currency]}${Number(amount).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
