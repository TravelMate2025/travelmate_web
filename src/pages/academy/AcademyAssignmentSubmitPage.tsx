import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../homePage/Navbar";
import Footer from "../../components/2Footer";
import { InfoPageHeader } from "../../components/infoPages/InfoPageHeader";
import { usePageMeta } from "../../hooks/usePageMeta";
import {
  getQuestionsLinkPreview,
  verifyQuestionsLinkAccess,
  submitAssignmentLink,
  type QuestionsLinkPreview,
  type VerifyResult,
  type SubmitResult,
} from "../../features/academy/api";

const scopeLabel = (preview: QuestionsLinkPreview) => {
  if (preview.scope === "session") return `Attendees: ${preview.session_label}`;
  if (preview.scope === "attended_any") return "For registrants who attended any session";
  return "All registrants";
};

const formatDeadline = (value: string) =>
  new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

// Reached only via a tutor/admin-distributed share link -- there is no
// generic "browse questions links" page. Deliberately two-stage: the
// questions link's actual content is never shown until the visitor
// proves they're a registrant (and, when the send requires attendance,
// that they attended -- one specific session, or any session, per the
// send's scope) -- so a leaked/forwarded/screenshotted link alone
// reveals nothing but which class it's for.
export function AcademyAssignmentSubmitPage() {
  const { shareToken } = useParams<{ shareToken: string }>();

  usePageMeta({
    title: "Assignment | TravelMate",
    description: "View your class's questions link and submit your assignment.",
  });

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<QuestionsLinkPreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [identifier, setIdentifier] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyOutcome, setVerifyOutcome] = useState<VerifyResult | null>(null);

  const [assignmentLink, setAssignmentLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitOutcome, setSubmitOutcome] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (!shareToken) return;
    getQuestionsLinkPreview(shareToken)
      .then(setPreview)
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!shareToken) return;

    setVerifying(true);
    try {
      const outcome = await verifyQuestionsLinkAccess(shareToken, identifier);
      setVerifyOutcome(outcome);
    } catch {
      setVerifyOutcome(null);
      setLoadError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!shareToken) return;

    setSubmitting(true);
    try {
      const outcome = await submitAssignmentLink(shareToken, identifier, assignmentLink);
      setSubmitOutcome(outcome);
    } catch {
      setSubmitOutcome({
        status: "not_registered",
        training_class_slug: "",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return <p className="text-center text-[#4E4F52] text-[14px]">Loading…</p>;
    }

    if (loadError || !preview) {
      return (
        <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D726381A] text-[#D72638] flex items-center justify-center text-xl mx-auto mb-4">
            !
          </div>
          <h2 className="text-[#181818] font-bold text-[18px] mb-2">We couldn't load this link</h2>
          <p className="text-[#4E4F52] text-[14px] leading-relaxed">
            This link may be invalid or no longer active. Ask your tutor for the current link.
          </p>
        </div>
      );
    }

    // Stage 1: identify. Shown until verify succeeds.
    if (!verifyOutcome || verifyOutcome.status !== "success") {
      if (verifyOutcome?.status === "not_registered") {
        return (
          <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#D726381A] text-[#D72638] flex items-center justify-center text-xl mx-auto mb-4">
              ?
            </div>
            <h2 className="text-[#181818] font-bold text-[18px] mb-2">We couldn't find you</h2>
            <p className="text-[#4E4F52] text-[14px] leading-relaxed mb-4">
              {verifyOutcome.message} Double-check what you typed, or see your tutor if you
              haven't registered yet.
            </p>
            <button
              type="button"
              onClick={() => setVerifyOutcome(null)}
              className="text-[13px] font-semibold text-[#023E8A] hover:underline"
            >
              Try again
            </button>
          </div>
        );
      }

      if (verifyOutcome?.status === "attendance_required") {
        return (
          <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFB6081A] text-[#9A7000] flex items-center justify-center text-xl mx-auto mb-4">
              ⏱
            </div>
            <h2 className="text-[#181818] font-bold text-[18px] mb-2">
              You need to have checked in
            </h2>
            <p className="text-[#4E4F52] text-[14px] leading-relaxed mb-4">
              {verifyOutcome.session_label ? (
                <>
                  This link is only for registrants who attended{" "}
                  <strong>{verifyOutcome.session_label}</strong>.{" "}
                </>
              ) : (
                "This link is only for registrants who checked in to at least one session. "
              )}
              {verifyOutcome.message}
            </p>
            <button
              type="button"
              onClick={() => setVerifyOutcome(null)}
              className="text-[13px] font-semibold text-[#023E8A] hover:underline"
            >
              Try again
            </button>
          </div>
        );
      }

      return (
        <form onSubmit={handleVerify} className="border border-[#EEF0F3] rounded-2xl p-8 space-y-5">
          <div className="bg-[#F0F4FA] border border-[#DCE7F7] rounded-lg p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#023E8A] opacity-75 mb-0.5">
              {preview.training_class_name}
            </p>
            <p className="text-[#012A5D] font-bold text-[15px]">
              {scopeLabel(preview)}
            </p>
            {preview.deadline_at && (
              <p
                className={`text-[12px] mt-1 font-semibold ${preview.is_past_deadline ? "text-[#D72638]" : "text-[#023E8A]"}`}
              >
                {preview.is_past_deadline ? "Submission deadline passed: " : "Submission deadline: "}
                {formatDeadline(preview.deadline_at)}
              </p>
            )}
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

          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-[#023E8A] text-white py-2.5 rounded-lg font-semibold hover:bg-[#012A5D] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {verifying ? "Checking…" : "Continue"}
          </button>
        </form>
      );
    }

    // Stage 2: reveal the questions link + submit an assignment link.
    // Same identifier already entered above stays in local state, so
    // this reads as one continuous form, not two separate logins.
    // Viewing the link stays allowed past the deadline (see preview.deadline_at
    // above) -- only submitting/resubmitting is blocked, since the deadline
    // could have passed between the page loading and this click.
    const deadlinePassed = preview.is_past_deadline || submitOutcome?.status === "deadline_passed";
    return (
      <div className="space-y-5">
        <div className="border border-[#EEF0F3] rounded-2xl p-8 space-y-4">
          <div className="bg-[#F0F4FA] border border-[#DCE7F7] rounded-lg p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#023E8A] opacity-75 mb-0.5">
              {preview.training_class_name}
            </p>
            <p className="text-[#012A5D] font-bold text-[15px]">
              {scopeLabel(preview)}
            </p>
            {preview.deadline_at && (
              <p
                className={`text-[12px] mt-1 font-semibold ${preview.is_past_deadline ? "text-[#D72638]" : "text-[#023E8A]"}`}
              >
                {preview.is_past_deadline ? "Submission deadline passed: " : "Submission deadline: "}
                {formatDeadline(preview.deadline_at)}
              </p>
            )}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#4E4F52] mb-1.5">Questions link</p>
            <a
              href={verifyOutcome.questions_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block break-all text-[14px] text-[#023E8A] hover:underline"
            >
              {verifyOutcome.questions_url}
            </a>
          </div>
        </div>

        {submitOutcome?.status === "success" ? (
          <div className="border border-[#EEF0F3] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#2D9C5E1A] text-[#2D9C5E] flex items-center justify-center text-xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-[#181818] font-bold text-[18px] mb-2">
              {submitOutcome.already_submitted ? "Your link is updated" : "Submitted"}
            </h2>
            <p className="text-[#4E4F52] text-[14px] leading-relaxed mb-4 break-all">
              {submitOutcome.assignment_link}
            </p>
            <button
              type="button"
              onClick={() => setSubmitOutcome(null)}
              className="text-[13px] font-semibold text-[#023E8A] hover:underline"
            >
              Submit a different link
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="border border-[#EEF0F3] rounded-2xl p-8 space-y-5">
            {submitOutcome?.status === "attendance_required" && (
              <p className="text-[13px] text-[#9A7000] bg-[#EFB6081A] border border-[#EFB608] rounded-lg px-3 py-2">
                {submitOutcome.message}
              </p>
            )}
            {submitOutcome?.status === "not_registered" && (
              <p className="text-[13px] text-[#D72638] bg-[#D726381A] border border-[#D72638] rounded-lg px-3 py-2">
                {submitOutcome.message}
              </p>
            )}
            {deadlinePassed && (
              <p className="text-[13px] text-[#D72638] bg-[#D726381A] border border-[#D72638] rounded-lg px-3 py-2">
                {preview.deadline_at
                  ? `The submission deadline (${formatDeadline(preview.deadline_at)}) has passed. You can still view the questions link above, but can no longer submit or resubmit.`
                  : "The submission deadline for this has passed."}
              </p>
            )}
            <div>
              <label className="block text-[13px] font-semibold text-[#4E4F52] mb-1.5">
                Your assignment link
              </label>
              <input
                type="url"
                required
                disabled={deadlinePassed}
                value={assignmentLink}
                onChange={(e) => setAssignmentLink(e.target.value)}
                placeholder="https://…"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
              <p className="text-[12px] text-gray-500 mt-1.5">
                Paste the link to your completed work here (e.g. a Google Doc, Drive folder, or
                GitHub repo) — not the questions link above.
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting || deadlinePassed}
              className="w-full bg-[#023E8A] text-white py-2.5 rounded-lg font-semibold hover:bg-[#012A5D] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit assignment link"}
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Assignment"
        title="Your class questions"
        subtitle="Confirm your identity to view the questions link and submit your assignment."
      />

      <section className="px-4 py-14">
        <div className="max-w-[440px] mx-auto">{renderBody()}</div>
      </section>

      <Footer />
    </>
  );
}
