import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Circle, Clock3, RefreshCw } from "lucide-react";

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
  currency?: string | null;
  requested_at?: string | null;
  completed_at?: string | null;
  last_synced_at?: string | null;
  estimated_settlement_window?: string | null;
  failure_message?: string | null;
  timeline?: RefundTimelineEvent[];
}

const activeStatuses = new Set(["pending", "processing"]);

const statusCopy = (status: RefundStatus) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { label: "Refund requested", tone: "amber" as const };
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

const timelineFor = (refund: RefundTracking): RefundTimelineEvent[] => {
  if (refund.timeline?.length) return refund.timeline;
  const status = (refund.status ?? "not_applicable").toLowerCase();
  const events: RefundTimelineEvent[] = [
    { status: "cancelled", occurred_at: refund.requested_at },
  ];
  if (["pending", "processing", "completed", "failed"].includes(status)) {
    events.push({ status: "pending", occurred_at: refund.requested_at });
  }
  if (["processing", "completed"].includes(status)) {
    events.push({ status: "processing", occurred_at: refund.last_synced_at });
  }
  if (status === "completed") events.push({ status, occurred_at: refund.completed_at });
  if (status === "failed") events.push({ status, occurred_at: refund.last_synced_at });
  return events;
};

const timelineLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "cancelled":
    case "cancellation_accepted":
      return "Cancellation accepted";
    case "pending":
    case "refund_requested":
      return "Refund requested";
    case "processing":
      return "Provider processing";
    case "completed":
      return "Refund completed";
    case "failed":
      return "Refund failed";
    default:
      return "Refund update";
  }
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
  const timeline = useMemo(() => timelineFor(currentRefund ?? {}), [currentRefund]);

  const refresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    setError(null);
    try {
      const next = await onRefresh();
      if (next) setCurrentRefund(next);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Could not refresh refund status.");
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
            <Metric label="Expected refund" value={formatAmount(currentRefund.requested_amount, currentRefund.currency ?? "")} />
            <Metric label="Settled amount" value={formatAmount(currentRefund.settled_amount, currentRefund.currency ?? "")} />
            <Metric label="Last update" value={formatDate(currentRefund.last_synced_at)} />
            {currentRefund.refund_reference && <Metric label="Refund reference" value={currentRefund.refund_reference} />}
          </div>
          {active && currentRefund.estimated_settlement_window && (
            <p className="mt-4 rounded-lg bg-[#eef5ff] px-3 py-2 text-sm text-[#174a86]">Settlement guidance: {currentRefund.estimated_settlement_window}.</p>
          )}
          {currentRefund.failure_message && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{currentRefund.failure_message}</p>}
          {active && isStale(currentRefund.last_synced_at) && (
            <p className="mt-4 text-sm text-amber-700">The latest partner update may be delayed.</p>
          )}
          <div className="mt-5 border-t border-[#e7edf5] pt-5">
            <p className="text-sm font-semibold text-[#181818]">Refund timeline</p>
            <ol className="mt-4 space-y-3">
              {timeline.map((event, index) => <li key={`${event.status}-${event.occurred_at}-${index}`} className="flex gap-3 text-sm">
                <span className="mt-0.5 text-[#023E8A]">{event.status === "completed" ? <CheckCircle2 size={17} /> : event.status === "failed" ? <AlertCircle size={17} /> : index === timeline.length - 1 ? <Clock3 size={17} /> : <Circle size={17} />}</span>
                <span><span className="font-medium text-[#181818]">{timelineLabel(event.status ?? "")}</span><span className="ml-2 text-[#6b7280]">{formatDate(event.occurred_at)}</span></span>
              </li>)}
            </ol>
          </div>
        </>
      )}
      {onRefresh && active && <button type="button" onClick={refresh} disabled={refreshing} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#023E8A] px-3 py-2 text-sm font-medium text-[#023E8A] transition hover:bg-[#eef5ff] disabled:cursor-wait disabled:opacity-60"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing…" : "Refresh status"}</button>}
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </section>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => <div className="rounded-lg border border-[#e7edf5] bg-white p-3"><p className="text-xs text-[#6b7280]">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#181818]">{value}</p></div>;
