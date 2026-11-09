import { Customer } from "../../types";

interface GuestDetailsProps {
  guest: Customer;
}

const GuestDetails = ({ guest }: GuestDetailsProps) => {
  const fullName = [guest?.name, guest?.surname].filter((part) => part && part.trim()).join(" ");
  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Traveller</p><h2 className="mb-5 mt-1 text-xl font-semibold text-[#18202b]">Guest details</h2>
      <div className="space-y-0">
          <Info label="Name" value={fullName || "N/A"} />
          <Info label="Email" value={guest?.email || "N/A"} />
          {guest?.phone && (
            <Info label="Phone" value={guest.phone} />
          )}
          {guest?.address && (
            <Info label="Address" value={guest.address} />
          )}
      </div>
    </section>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => <div className="flex items-start justify-between gap-5 border-b border-[#edf1f6] py-3 last:border-b-0"><span className="text-sm text-[#687382]">{label}</span><span className="max-w-[65%] break-words text-right text-sm font-semibold text-[#18202b]">{value}</span></div>;

export default GuestDetails;
