import { FaInstagram, FaXTwitter, FaTiktok, FaSnapchat } from "react-icons/fa6";

export type InfoPageKey = "about" | "contact" | "privacy" | "terms" | "refund" | "cookie";

// Real TravelMate accounts, provided by the user 2026-07-20.
const SOCIAL_LINKS: { label: string; href: string; icon: typeof FaInstagram }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/travelmategloballtd?igsh=MTRzcGtrcDl2dzh2aQ==",
    icon: FaInstagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@officialtravelmate?_r=1&_t=ZS-987IbIyLUhQ",
    icon: FaTiktok,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/travelmateglo",
    icon: FaXTwitter,
  },
  {
    label: "Snapchat",
    href: "https://www.snapchat.com/add/travelmateglo?share_id=V4RkP3R-Hu8&locale=en-GB",
    icon: FaSnapchat,
  },
];

const CROSS_LINKS: { key: InfoPageKey; label: string; href: string }[] = [
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "privacy", label: "Privacy Policy", href: "/privacy-policy" },
  { key: "terms", label: "Terms of Use", href: "/terms-of-use" },
  { key: "refund", label: "Refund & Cancellation", href: "/refund-policy" },
  { key: "cookie", label: "Cookie Policy", href: "/cookie-policy" },
];

// The shared closing block on every info/legal page (About, Contact,
// Privacy, Terms, Refund & Cancellation, Cookie) -- one place for company
// identity, social links, and cross-navigation between these pages,
// instead of each page inventing its own version. Matches the approved
// design mock (accepted 2026-07-20).
export function CompanyConnectCard({ currentPage }: { currentPage: InfoPageKey }) {
  return (
    <div className="flex justify-center px-4 mt-14">
      <div className="w-full max-w-[680px] bg-[#F7F9FB] border border-[#EEF0F3] rounded-[18px] p-6 lg:p-8">
        <div className="flex flex-wrap justify-between gap-6 mb-6">
          <div className="flex flex-wrap gap-7">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.5px] text-[#8A9096] mb-1">Company</p>
              <p className="text-[14px] font-semibold text-[#181818]">TravelMate Global Limited</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.5px] text-[#8A9096] mb-1">Market</p>
              <p className="text-[14px] font-semibold text-[#181818]">Nigeria</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.5px] text-[#8A9096] mb-1">Support</p>
              <p className="text-[14px] font-semibold text-[#181818]">support@travelmateglo.com</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start" aria-label="Social media">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-[10px] bg-white border border-[#E4E7EB] flex items-center justify-center text-[#023E8A] hover:bg-[#023E8A] hover:border-[#023E8A] hover:text-white transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-5 border-t border-[#E4E7EB]">
          {CROSS_LINKS.map(({ key, label, href }) => (
            <a
              key={key}
              href={href}
              className={
                key === currentPage
                  ? "text-[13.5px] font-bold text-[#023E8A]"
                  : "text-[13.5px] font-medium text-[#4E4F52] hover:text-[#023E8A] hover:underline"
              }
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
