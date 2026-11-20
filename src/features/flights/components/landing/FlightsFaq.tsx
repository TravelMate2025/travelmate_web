// Questions and answers from the approved mock (current home FAQ, updated, plus three new ones).
const FAQS = [
  {
    q: "How far in advance should I book my flight?",
    a: "Fares can change daily, so booking as soon as your dates are fixed usually gets the best price. You can book any time up to departure while seats are available.",
  },
  {
    q: "Why did my price change during booking?",
    a: "Airline fares are live. We confirm your price with the airline before you pay. If it changed, we show you the new price and you decide whether to continue. You’re never charged a different amount without agreeing.",
  },
  {
    q: "How long are my seats held?",
    a: "After you enter traveller details we hold your seats with the airline while you pay. The time left is shown on the payment page. If it runs out, the seats are released and you aren’t charged.",
  },
  {
    q: "When do I get my e-ticket?",
    a: "Right after payment we confirm your booking with the airline and issue your ticket, usually within minutes. We email your e-ticket and you can see it in My trips.",
  },
  {
    q: "Can I change or cancel my flight?",
    a: "It depends on your fare. Before your ticket is issued you can cancel for a full refund. After that, the fare rules shown before you paid apply: some fares are refundable, some only refund taxes.",
  },
  {
    q: "Is baggage included in the price?",
    a: "It depends on the fare and airline. What’s included is shown on each fare, and you can add extra bags before you pay.",
  },
  {
    q: "How do I check in for my flight?",
    a: "Check-in is with the airline, using the airline reference and e-ticket we send you.",
  },
  {
    q: "How long do refunds take?",
    a: "Refunds go back to your original payment method through Flutterwave. Timing depends on your bank, usually a few working days once the airline has confirmed the amount.",
  },
];

export const FlightsFaq = () => (
  <section aria-labelledby="flights-faq-h" className="mx-auto mt-14 w-full max-w-3xl">
    <h2 id="flights-faq-h" className="mb-5 text-center text-2xl font-bold text-[#181818]">
      Frequently asked questions
    </h2>
    {FAQS.map((f) => (
      <details key={f.q} className="group border-b border-[#EBECED]">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#181818]">
          {f.q}
          <span aria-hidden className="text-xl text-[#8A9096] transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <p className="mb-4.5 leading-relaxed text-[#4E4F52]">{f.a}</p>
      </details>
    ))}
  </section>
);
