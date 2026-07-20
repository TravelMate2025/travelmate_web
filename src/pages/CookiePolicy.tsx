import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";

// Static, not backend-managed (no CookiePolicy model exists). Written to
// match what the site actually does, not generic boilerplate: TravelMate's
// web app uses browser local storage for session/auth state and
// preferences, not third-party analytics or advertising cookies (confirmed
// -- no GA/Mixpanel/Hotjar-style scripts in this codebase). Flutterwave, our
// payment processor, may set its own cookies during checkout, outside our
// control.
export function CookiePolicyPage() {
  usePageMeta({
    title: "Cookie Policy | TravelMate",
    description: "How TravelMate uses cookies and browser storage on travelmateglo.com.",
  });

  return (
    <>
      <Navbar />
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-8 lg:space-y-10">
        <div>
          <p className="text-[#181818] font-semibold text-2xl text-center lg:text-left lg:text-4xl">
            Cookie Policy
          </p>
        </div>

        <div className="space-y-8 text-sm lg:text-base leading-relaxed">
          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              What we use, and why
            </h2>
            <p>
              TravelMate's website uses your browser's local storage to keep
              you signed in, remember which search tab (Stays, Flights, or
              Transfers) you last used, and save short-lived search
              preferences like recent destinations. This is essential to how
              the site functions — without it, you'd need to sign in and
              re-enter your search on every visit.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              What we don't use
            </h2>
            <p>
              TravelMate does not use third-party advertising or tracking
              cookies, and we don't sell browsing data to advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              Payment processing
            </h2>
            <p>
              During checkout, our payment processor, Flutterwave, may set
              its own cookies to securely process your payment and prevent
              fraud. This happens outside TravelMate's own systems and is
              governed by Flutterwave's own privacy and cookie practices.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              Managing browser storage
            </h2>
            <p>
              You can clear your browser's local storage and cookies for
              travelmateglo.com at any time through your browser's settings.
              Doing so will sign you out and reset any saved preferences, but
              won't affect your account or booking history.
            </p>
          </div>

          <div>
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-3">
              Questions
            </h2>
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
      </section>
      <Footer />
    </>
  );
}
