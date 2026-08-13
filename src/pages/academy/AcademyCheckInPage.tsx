import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../homePage/Navbar";
import Footer from "../../components/2Footer";
import { InfoPageHeader } from "../../components/infoPages/InfoPageHeader";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  checkInForSession,
  getSessionByToken,
  type CheckInResult,
  type SessionInfo,
} from "../../features/academy/api";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

// Reached only via a session's QR code -- there is no generic check-in
// page, and this page never links back to registration except as the
// specific result of a failed identity lookup (see the not_registered
// branch below).
export function AcademyCheckInPage() {
  const { qrToken } = useParams<{ qrToken: string }>();

  usePageMeta({
    title: "Check In | TravelMate",
    description: "Check in for a TravelMate training class session.",
  });

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);

  useEffect(() => {
    if (!qrToken) return;
    getSessionByToken(qrToken)
      .then(setSession)
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, [qrToken]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!qrToken) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const outcome = await checkInForSession(qrToken, identifier);
      setResult(outcome);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return <p className="text-center text-[#4E4F52] text-[14px]">Loading session…</p>;
    }

    if (loadError || !session) {
      return (
        <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D726381A] text-[#D72638] flex items-center justify-center text-xl mx-auto mb-4">
            !
          </div>
          <h2 className="text-[#181818] font-bold text-[18px] mb-2">
            We couldn't load this session
          </h2>
          <p className="text-[#4E4F52] text-[14px] leading-relaxed">
            {loadError || "This QR code may be invalid or expired. Ask the organizer for the current code."}
          </p>
        </div>
      );
    }

    // Result panels take priority once a check-in attempt has resolved.
    if (result) {
      if (result.status === "success") {
        return (
          <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#2D9C5E1A] text-[#2D9C5E] flex items-center justify-center text-xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-[#181818] font-bold text-[18px] mb-2">
              {result.already_checked_in ? "You're already checked in" : "You're checked in"}
            </h2>
            <p className="text-[#4E4F52] text-[14px] leading-relaxed">
              {result.already_checked_in
                ? `You were already marked present for ${result.session_label} · ${result.training_class_name}.`
                : `Marked present for ${result.session_label} · ${result.training_class_name}. Enjoy the session.`}
            </p>
          </div>
        );
      }

      if (result.status === "window_closed") {
        return (
          <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFB6081A] text-[#9A7000] flex items-center justify-center text-xl mx-auto mb-4">
              ⏱
            </div>
            <h2 className="text-[#181818] font-bold text-[18px] mb-2">
              {result.window_status === "not_started" ? "Check-in hasn't opened yet" : "Check-in has closed"}
            </h2>
            <p className="text-[#4E4F52] text-[14px] leading-relaxed">
              {result.message} You're still welcome in the session — this just wasn't recorded
              as attendance. See the organizer if you think this is a mistake.
            </p>
          </div>
        );
      }

      // not_registered
      return (
        <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D726381A] text-[#D72638] flex items-center justify-center text-xl mx-auto mb-4">
            ?
          </div>
          <h2 className="text-[#181818] font-bold text-[18px] mb-2">We couldn't find you</h2>
          <p className="text-[#4E4F52] text-[14px] leading-relaxed mb-4">
            {result.message} Double-check what you typed, or register for this class first.
          </p>
          <button
            type="button"
            onClick={() => setResult(null)}
            className="text-[13px] font-semibold text-[#023E8A] hover:underline mr-4"
          >
            Try again
          </button>
          <Link
            to={`/academy/${result.training_class_slug}/register`}
            className="text-[13px] font-semibold text-[#023E8A] hover:underline"
          >
            Register for this class →
          </Link>
        </div>
      );
    }

    if (session.window_status !== "open") {
      return (
        <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#EFB6081A] text-[#9A7000] flex items-center justify-center text-xl mx-auto mb-4">
            ⏱
          </div>
          <h2 className="text-[#181818] font-bold text-[18px] mb-2">
            {session.window_status === "not_started" ? "Check-in hasn't opened yet" : "Check-in has closed"}
          </h2>
          <p className="text-[#4E4F52] text-[14px] leading-relaxed">
            {session.window_status === "not_started"
              ? `Check-in for ${session.label} opens at ${formatDateTime(session.session_start_at)}.`
              : `Check-in for ${session.label} closed at ${formatDateTime(session.checkin_closes_at)}.`}{" "}
            You're still welcome in the session — this just isn't recorded as attendance.
          </p>
        </div>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        className="border border-[#EEF0F3] rounded-2xl p-8 space-y-5"
      >
        <div className="bg-[#F0F4FA] border border-[#DCE7F7] rounded-lg p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#023E8A] opacity-75 mb-0.5">
              {session.training_class_name}
            </p>
            <p className="text-[#012A5D] font-bold text-[15px]">{session.label}</p>
          </div>
          <p className="text-[12px] text-[#4E4F52] text-right shrink-0">
            Closes {formatDateTime(session.checkin_closes_at)}
          </p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-[#4E4F52] mb-1.5">
            Email or student ID
          </label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="amara@example.com or STU-0014"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-[12px] text-gray-500 mt-1.5">
            Whatever you used when you registered.
          </p>
        </div>

        {submitError && (
          <p className="text-[13px] text-[#D72638] bg-[#D726381A] border border-[#D72638] rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#023E8A] text-white py-2.5 rounded-lg font-semibold hover:bg-[#012A5D] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Checking in…" : `Check in for ${session.label}`}
        </button>
      </form>
    );
  };

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Check In"
        title="Confirm you're here"
        subtitle="This page opens from the QR code posted at the session. Confirm your identity to mark attendance."
      />

      <section className="px-4 py-14">
        <div className="max-w-[440px] mx-auto">{renderBody()}</div>
      </section>

      <Footer />
    </>
  );
}
