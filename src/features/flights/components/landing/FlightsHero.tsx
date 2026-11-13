// Full-bleed photo hero (Hotels style) with the mock's copy. The search card
// overlaps its bottom edge (see FlightsPage).
export const FlightsHero = () => (
  <section aria-label="Find a flight" className="relative flex min-h-[34rem] flex-col justify-end text-white">
    <img
      src="/images/flights/hero.jpg"
      alt="Aircraft wing above the clouds at sunset"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#012A5D] via-[#023E8A]/70 to-[#023E8A]/25" />
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-36 pt-28 sm:px-6">
      <h1 className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-none tracking-tight [font-stretch:110%] sm:text-6xl">
        Find your next flight
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[#DCE7F7]">
        Compare fares from full-service airlines, see what each fare includes, and pay in naira, dollars or pounds.
      </p>
    </div>
  </section>
);
