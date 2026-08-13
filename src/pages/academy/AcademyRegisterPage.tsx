import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../homePage/Navbar";
import Footer from "../../components/2Footer";
import { InfoPageHeader } from "../../components/infoPages/InfoPageHeader";
import { usePageMeta } from "../../hooks/usePageMeta";
import { registerForClass, type RegisterForClassResponse } from "../../features/academy/api";

// Registration only creates the enrollment record ("intends to attend") --
// it deliberately never marks any session as attended, including Week 1.
// Every session, with no exceptions, is checked in via that session's own
// QR code. This page also never links to the check-in flow: check-in only
// makes sense in the context of one specific, time-boxed session, which
// only a real session QR code can provide.
export function AcademyRegisterPage() {
  const { classSlug } = useParams<{ classSlug: string }>();

  usePageMeta({
    title: "Register | TravelMate",
    description: "Register for a TravelMate training class.",
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<RegisterForClassResponse | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!classSlug) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await registerForClass(classSlug, {
        full_name: fullName,
        email,
        phone,
        marketing_opt_in: marketingOptIn,
      });
      setConfirmation(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Registration"
        title="Register for the class"
        subtitle="One-time sign-up ahead of the first session. We'll use this to check you in at each weekend and to track attendance for end-of-class awards."
      />

      <section className="px-4 py-14">
        <div className="max-w-[440px] mx-auto">
          {confirmation ? (
            <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2D9C5E1A] text-[#2D9C5E] flex items-center justify-center text-xl mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-[#181818] font-bold text-[18px] mb-2">
                You're registered, {confirmation.full_name.split(" ")[0]}
              </h2>
              <p className="text-[#4E4F52] text-[14px] leading-relaxed mb-4">
                Registering doesn't mark you present for any session — you'll
                still check in at the door each weekend, including Week 1, by
                scanning the session QR code within its check-in window.
              </p>
              <div className="bg-[#F0F4FA] border border-[#DCE7F7] rounded-lg py-3 px-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#023E8A] opacity-75 mb-1">
                  Your student ID
                </p>
                <p className="text-[#012A5D] text-[20px] font-bold tracking-wide">
                  {confirmation.student_id}
                </p>
                <p className="text-[12px] text-[#4E4F52] mt-1.5">
                  Save this — you'll check in with your email or this ID.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-[#EEF0F3] rounded-2xl p-8 space-y-5"
            >
              <div>
                <label className="block text-[13px] font-semibold text-[#4E4F52] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amara Chukwu"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#4E4F52] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amara@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#4E4F52] mb-1.5">
                  Phone number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 801 234 5678"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <label className="flex items-start gap-2.5 bg-[#F0F4FA] border border-[#DCE7F7] rounded-lg p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-0.5 accent-[#023E8A] w-4 h-4 shrink-0 cursor-pointer"
                />
                <span className="text-[12.5px] text-[#012A5D] leading-relaxed">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-[#023E8A] opacity-75 mb-0.5">
                    Optional
                  </span>
                  I'd like to hear about future TravelMate AI training classes
                  and offers by email.
                </span>
              </label>

              {error && (
                <p className="text-[13px] text-[#D72638] bg-[#D726381A] border border-[#D72638] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#023E8A] text-white py-2.5 rounded-lg font-semibold hover:bg-[#012A5D] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Registering…" : "Register for the class"}
              </button>
            </form>
          )}

          <p className="text-center text-[13px] text-gray-500 mt-5">
            Already registered? No need to sign up again — check in using the
            QR code posted at each session.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
