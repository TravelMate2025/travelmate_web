// Countries for phone codes and passport issuers, until the backend's country
// table (shared with the airport table, plan F2/T4) can serve the full list.
// Names come from the browser (Intl.DisplayNames), so only codes live here.
const CODES: [iso: string, callingCode: string][] = [
  ["NG", "234"], ["GH", "233"], ["GB", "44"], ["US", "1"], ["CA", "1"], ["IE", "353"],
  ["FR", "33"], ["DE", "49"], ["NL", "31"], ["BE", "32"], ["IT", "39"], ["ES", "34"],
  ["PT", "351"], ["CH", "41"], ["AE", "971"], ["SA", "966"], ["QA", "974"], ["TR", "90"],
  ["EG", "20"], ["MA", "212"], ["KE", "254"], ["RW", "250"], ["ET", "251"], ["UG", "256"],
  ["TZ", "255"], ["ZA", "27"], ["CM", "237"], ["SN", "221"], ["CI", "225"], ["BJ", "229"],
  ["TG", "228"], ["LR", "231"], ["SL", "232"], ["GM", "220"], ["IN", "91"], ["CN", "86"],
  ["AU", "61"],
];

const names = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

export interface Country {
  iso: string;
  name: string;
  callingCode: string;
}

export const COUNTRIES: Country[] = CODES.map(([iso, callingCode]) => ({ iso, name: names?.of(iso) ?? iso, callingCode })).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export const countryName = (iso: string) => COUNTRIES.find((c) => c.iso === iso)?.name ?? iso;
