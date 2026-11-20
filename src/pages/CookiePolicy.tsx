import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";
import { InfoPageHeader } from "../components/infoPages/InfoPageHeader";
import { CompanyConnectCard } from "../components/infoPages/CompanyConnectCard";
import { HAS_TRAVELMATE_BOOKINGS } from "../config/features";

// Static, not backend-managed (no CookiePolicy model exists). Written to
// match what the site actually does, not generic boilerplate: browser local
// storage for sign-in and preferences; the booking partner's anonymous visitor
// measurement script (index.html, features/hotels/visitor.ts), whose id is
// added to the "Check price" link; Google when someone signs in with Google;
// the partner's booking page and Flutterwave (when a product we book is on)
// set their own cookies. No advertising cookies. DRAFT for review.
const H2 = "text-[#181818] font-semibold text-lg lg:text-xl mb-3";
export function CookiePolicyPage() {
  usePageMeta({
    title: "Cookie Policy | TravelMate",
    description: "How TravelMate uses cookies and browser storage on travelmateglo.com.",
  });

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Legal"
        title="Cookie Policy"
        subtitle="How TravelMate uses cookies and browser storage on travelmateglo.com."
      />
      <section className="text-[#4E4F52] px-4 py-14">
        <div className="max-w-[680px] mx-auto text-[15.5px] leading-relaxed space-y-8">
          <div>
            <h2 className={H2}>What we use, and why</h2>
            <p>
              TravelMate's website uses your browser's local storage to keep
              you signed in and to save short-lived search preferences, like
              recent destinations and dates. This is essential to how the
              site functions — without it, you'd need to sign in and re-enter
              your search on every visit.
            </p>
          </div>

          <div>
            <h2 className={H2}>Visitor measurement</h2>
            <p>
              To understand how the site is used, and to connect your visit
              with a booking you make on our partner's booking page, we use an
              anonymous visitor measurement tool. It gives your browser a
              random visitor id, stored in your browser, and we add that id to
              the "Check price" link. It doesn't include your name, email or
              other personal details.
            </p>
          </div>

          <div>
            <h2 className={H2}>What we don't use</h2>
            <p>
              TravelMate does not use advertising cookies, and we don't sell
              browsing data to advertisers.
            </p>
          </div>

          <div>
            <h2 className={H2}>Booking, payment and sign-in partners</h2>
            <p>
              Hotel bookings are completed on our partner's secure booking
              page, which may set its own cookies to show prices, take payment
              and prevent fraud.
              {HAS_TRAVELMATE_BOOKINGS &&
                " For bookings paid on TravelMate, our payment processor, Flutterwave, may set its own cookies during checkout."}{" "}
              If you choose to sign in with Google, Google may set its own
              cookies. These are outside TravelMate's own systems and are
              governed by each company's own privacy and cookie practices.
            </p>
          </div>

          <div>
            <h2 className={H2}>Managing browser storage</h2>
            <p>
              You can clear your browser's local storage and cookies for
              travelmateglo.com at any time through your browser's settings.
              Doing so will sign you out and reset any saved preferences, but
              won't affect your account or booking history.
            </p>
          </div>

          <div>
            <h2 className={H2}>Questions</h2>
            <p>
              See our{" "}
              <a href="/privacy-policy" className="text-[#023E8A] font-medium hover:underline">
                Privacy Policy
              </a>{" "}
              for how we handle your account and booking data, or{" "}
              <a href="/chat-with-us" className="text-[#023E8A] font-medium hover:underline">
                Chat with Us
              </a>{" "}
              if you have questions.
            </p>
          </div>
        </div>
        <CompanyConnectCard currentPage="cookie" />
      </section>
      <Footer />
    </>
  );
}
