import { BookingDetailsVerifyData } from "../../types";

const CancellationDetails = ({ booking }: { booking?: BookingDetailsVerifyData }) => {
  const policy = (booking?.cancellation_policy ?? booking?.cancellationPolicy ?? {}) as Record<string, unknown>;
  const preview = (booking?.cancellation_preview ?? booking?.cancellationPreview ?? {}) as Record<string, unknown>;
  const refundPercent = preview.refundPercent ?? policy.refundPercent ?? booking?.refund_percent;
  const penaltyPercent = preview.cancellationFee != null
    ? null
    : policy.penaltyPercent;
  const copy = typeof policy.policyCopy === "string" ? policy.policyCopy : null;
  const deadline = policy.cancellationCutoffAtLocal ?? policy.cancellationCutoffAtUtc;
  const deadlineLabel = deadline ? new Date(String(deadline)).toLocaleString() : null;
  const policyMessage = typeof preview.message === "string" ? preview.message : null;

  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Terms</p><h2 className="mt-1 text-xl font-semibold text-[#18202b]">Cancellation policy</h2>
      <div className="mt-4 rounded-xl bg-[#f6f9fd] p-4">
        <p className="font-semibold text-[#18202b]">{copy || (refundPercent != null ? `${refundPercent}% refund under this booking policy` : "Cancellation terms apply to this booking")}</p>
        {refundPercent != null && <p className="mt-1 text-sm text-[#687382]">{String(refundPercent)}% refundable{penaltyPercent != null ? ` · ${String(penaltyPercent)}% cancellation fee` : ""}</p>}
        {deadlineLabel && <p className="mt-1 text-sm text-[#687382]">Cancellation deadline: {deadlineLabel}</p>}
      </div>
      {policyMessage && <p className="mt-3 text-sm leading-5 text-[#687382]">{policyMessage}</p>}
      {!copy && refundPercent == null && !policyMessage && <p className="mt-3 text-sm text-[#687382]">The supplier did not provide additional cancellation wording for this booking.</p>}
    </section>
  );
};

export default CancellationDetails;
