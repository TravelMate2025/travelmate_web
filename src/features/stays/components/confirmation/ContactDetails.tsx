import React from "react";


const ContactDetails: React.FC = () => {
  return (
    <section className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-[0_10px_30px_rgba(16,42,67,0.05)] sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#023E8A]">Help</p><h2 className="mt-1 text-xl font-semibold text-[#18202b]">Need assistance?</h2>
      <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-[#f6f9fd] p-4 text-sm">
        <span className="font-medium text-[#687382]">Customer support</span><span className="font-semibold text-[#18202b]">+234 808 412 2474</span>
      </div>
    </section>
  );
};

export default ContactDetails;
