import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";

// Real public contact entry point. "Chat with Us" and "Raise a Ticket" both
// require a signed-in account (createChat needs a real userId, /tickets is
// PrivateRoute) -- verified live before building this, not assumed -- so a
// logged-out visitor or evaluating supplier had no way to reach support at
// all. This page doesn't fabricate a phone number or physical address since
// neither exists anywhere else on the site; only the confirmed-real support
// email is shown.
const SUPPORT_EMAIL = "support@travelmateglo.com";

export function ContactPage() {
  usePageMeta({
    title: "Contact Us | TravelMate",
    description:
      "Get in touch with the TravelMate team about stays, flights, airport transfers, or partnering with us.",
  });

  return (
    <>
      <Navbar />
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-8 lg:space-y-10">
        <div>
          <p className="text-[#181818] font-semibold text-2xl text-center lg:text-left lg:text-4xl">
            Contact Us
          </p>
          <p className="mt-3 max-w-[60ch] text-center lg:text-left">
            Have a question about a booking, or want to talk to us about
            listing your stays, flights, or vehicles on TravelMate? Reach us
            directly below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-[#E4E7EB] rounded-2xl p-6">
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-2">
              Email us
            </h2>
            <p className="mb-4">
              For booking questions, account issues, or partnership
              inquiries, email us directly and we'll get back to you.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-block text-[#023E8A] font-medium hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="border border-[#E4E7EB] rounded-2xl p-6">
            <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-2">
              Already have a booking or account?
            </h2>
            <p className="mb-4">
              Sign in for the fastest response — live chat and support
              tickets are available directly from your account.
            </p>
            <div className="flex flex-col gap-2">
              <a href="/chat-with-us" className="text-[#023E8A] font-medium hover:underline">
                Chat with Us
              </a>
              <a href="/tickets" className="text-[#023E8A] font-medium hover:underline">
                Raise a Support Ticket
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-2">
            Looking for a quick answer?
          </h2>
          <p>
            Check our{" "}
            <a href="/faqs" className="text-[#023E8A] font-medium hover:underline">
              FAQs
            </a>{" "}
            — most questions about bookings, cancellations, and payments are
            already answered there.
          </p>
        </div>

        <div>
          <h2 className="text-[#181818] font-semibold text-lg lg:text-xl mb-2">
            Interested in partnering with TravelMate?
          </h2>
          <p>
            Visit our{" "}
            <a href="/partners" className="text-[#023E8A] font-medium hover:underline">
              Partners
            </a>{" "}
            page to learn how suppliers connect their inventory to
            TravelMate.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
