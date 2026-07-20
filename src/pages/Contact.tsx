import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { usePageMeta } from "../hooks/usePageMeta";
import { InfoPageHeader } from "../components/infoPages/InfoPageHeader";
import { CompanyConnectCard } from "../components/infoPages/CompanyConnectCard";

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
      <InfoPageHeader
        eyebrow="Support"
        title="Contact Us"
        subtitle="Get in touch with the TravelMate team about stays, flights, airport transfers, or partnering with us."
      />
      <section className="text-[#4E4F52] px-4 py-14">
        <div className="max-w-[680px] mx-auto text-[15.5px] leading-relaxed space-y-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-[#EEF0F3] rounded-2xl p-6">
              <h2 className="text-[#181818] font-bold text-[16.5px] mb-2">
                Email us
              </h2>
              <p className="mb-3.5">
                For booking questions, account issues, or partnership
                inquiries, email us directly and we'll get back to you.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-block text-[#023E8A] font-semibold hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <div className="border border-[#EEF0F3] rounded-2xl p-6">
              <h2 className="text-[#181818] font-bold text-[16.5px] mb-2">
                Already have a booking or account?
              </h2>
              <p className="mb-3.5">
                Sign in for the fastest response — live chat and support
                tickets are available directly from your account.
              </p>
              <div className="flex flex-col gap-2">
                <a href="/chat-with-us" className="text-[#023E8A] font-semibold hover:underline">
                  Chat with Us
                </a>
                <a href="/tickets" className="text-[#023E8A] font-semibold hover:underline">
                  Raise a Support Ticket
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[#181818] font-bold text-[16.5px] mb-2">
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
            <h2 className="text-[#181818] font-bold text-[16.5px] mb-2">
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
        </div>
        <CompanyConnectCard currentPage="contact" />
      </section>
      <Footer />
    </>
  );
}
