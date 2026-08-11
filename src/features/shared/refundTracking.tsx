import { useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

export type RefundStatus =
  | "not_applicable"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | string;

export interface RefundTimelineEvent {
  status?: string;
  source?: string;
  occurred_at?: string | null;
}

export interface RefundTracking {
  status?: RefundStatus | null;
  refund_reference?: string | null;
  requested_amount?: number | string | null;
  settled_amount?: number | string | null;
  original_amount?: number | string | null;
  refund_percent?: number | string | null;
  retained_amount?: number | string | null;
  refund_explanation?: string | null;
  currency?: string | null;
  requested_at?: string | null;
  completed_at?: string | null;
  last_synced_at?: string | null;
  estimated_settlement_window?: string | null;
  failure_message?: string | null;
  next_action?: string | null;
  support_link?: string | null;
  timeline?: RefundTimelineEvent[];
}

const activeStatuses = new Set(["pending", "processing"]);

const statusCopy = (status: RefundStatus) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { label: "Refund under review", tone: "amber" as const };
    case "processing":
      return { label: "Refund processing", tone: "blue" as const };
    case "completed":
      return { label: "Refund completed", tone: "green" as const };
    case "failed":
      return { label: "Refund needs attention", tone: "red" as const };
    default:
      return { label: "No refund applies", tone: "gray" as const };
  }
};

const statusMessage = (status: RefundStatus) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Your booking cancellation is recorded. The refund is awaiting review; no money has been returned yet.";
    case "processing":
      return "Your refund has been sent for processing. It is not complete until the original payment method confirms the credit.";
    case "completed":
      return "The payment provider has confirmed this refund. Please check the original payment method for the credit.";
    case "failed":
      return "We could not complete this refund automatically. Our support team can help review what happened.";
    default:
      return "This cancellation does not have a refund to track.";
  }
};

const formatAmount = (amount: number | string | null | undefined, currency: string) => {
  if (amount === null || amount === undefined || amount === "") return "Not available";
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currency} ${String(amount)}`.trim();
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const isStale = (value?: string | null) => {
  if (!value) return true;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) || Date.now() - timestamp > 15 * 60 * 1000;
};

export const RefundBadge = ({ refund }: { refund?: RefundTracking | null }) => {
  const status = (refund?.status ?? "not_applicable").toLowerCase();
  const copy = statusCopy(status);
  const tone = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
    gray: "border-gray-200 bg-gray-50 text-gray-600",
  }[copy.tone];
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>{copy.label}</span>;
};

type RefundPanelProps = {
  refund?: RefundTracking | null;
  onRefresh?: () => Promise<RefundTracking | null>;
};

export const RefundPanel = ({ refund, onRefresh }: RefundPanelProps) => {
  const [currentRefund, setCurrentRefund] = useState(refund ?? null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = activeStatuses.has((currentRefund?.status ?? "").toLowerCase());
  const copy = statusCopy((currentRefund?.status ?? "not_applicable").toLowerCase());

  const refresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    setError(null);
    try {
      const next = await onRefresh();
      if (next) setCurrentRefund(next);
    } catch (refreshError) {
      setError("We couldn't refresh the refund status right now. Your current refund details are still shown; please try again shortly.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#dbe3ed] bg-gradient-to-br from-white to-[#f7faff] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#023E8A]">Refund tracking</p>
          <h2 className="mt-1 text-lg font-semibold text-[#181818]">{copy.label}</h2>
        </div>
        <RefundBadge refund={currentRefund} />
      </div>

      {!currentRefund || copy.tone === "gray" ? (
        <p className="mt-4 text-sm leading-6 text-[#4E4F52]">This cancellation does not have a refund to track.</p>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {currentRefund.original_amount != null && <Metric label="Amount paid" value={formatAmount(currentRefund.original_amount, currentRefund.currency ?? "")} />}
            <Metric label="Expected refund" value={formatAmount(currentRefund.requested_amount, currentRefund.currency ?? "")} />
            <Metric label="Amount returned" value={formatAmount(currentRefund.settled_amount, currentRefund.currency ?? "")} />
            {currentRefund.refund_percent != null && <Metric label="Policy refund" value={`${currentRefund.refund_percent}%`} />}
            {currentRefund.retained_amount != null && <Metric label="Amount retained under policy" value={formatAmount(currentRefund.retained_amount, currentRefund.currency ?? "")} />}
            <Metric label="Last update" value={formatDate(currentRefund.last_synced_at)} />
            {currentRefund.refund_reference && <Metric label="Refund reference" value={currentRefund.refund_reference} />}
          </div>
          <p className="mt-4 rounded-lg bg-[#eef5ff] px-3 py-2 text-sm leading-6 text-[#174a86]">{currentRefund.refund_explanation || statusMessage((currentRefund.status ?? "not_applicable").toLowerCase())}</p>
          {currentRefund.refund_explanation && <p className="mt-2 text-sm leading-6 text-[#4E4F52]">{statusMessage((currentRefund.status ?? "not_applicable").toLowerCase())}</p>}
          {active && currentRefund.estimated_settlement_window && (
            <p className="mt-4 rounded-lg bg-[#eef5ff] px-3 py-2 text-sm text-[#174a86]">Settlement guidance: {currentRefund.estimated_settlement_window}.</p>
          )}
          {currentRefund.failure_message && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{currentRefund.failure_message}</p>}
          {currentRefund.next_action && <p className="mt-4 text-sm text-[#4E4F52]">{currentRefund.next_action}</p>}
          {currentRefund.support_link && (
            <a href={currentRefund.support_link} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#023E8A] px-3 py-2 text-sm font-semibold text-[#023E8A] hover:bg-[#eef5ff]">
              Contact support about this refund <ExternalLink size={15} />
            </a>
          )}
          {active && isStale(currentRefund.last_synced_at) && (
            <p className="mt-4 text-sm text-amber-700">The latest partner update may be delayed.</p>
          )}
        </>
      )}
      {onRefresh && active && <button type="button" onClick={refresh} disabled={refreshing} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#023E8A] px-3 py-2 text-sm font-medium text-[#023E8A] transition hover:bg-[#eef5ff] disabled:cursor-wait disabled:opacity-60"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing…" : "Refresh status"}</button>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </section>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => <div className="rounded-lg border border-[#e7edf5] bg-white p-3"><p className="text-xs text-[#6b7280]">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#181818]">{value}</p></div>;
