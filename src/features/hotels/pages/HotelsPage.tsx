import { useMemo, useRef, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { DateRangeFields, type StayDates } from "../components/DateRangeFields";
import { GuestsField } from "../components/GuestsField";
import { summariseGuests, type GuestCounts } from "../guests";
import {
  HERO_IMAGE,
  destinationFilters,
  destinations,
  formatEur,
  guides,
  moreDestinations,
  promises,
  reviews,
  searchTabs,
  stayTypes,
  topStays,
  trending,
} from "../data";
import "../hotels.css";

type Filter = (typeof destinationFilters)[number];

export default function HotelsPage() {
  usePageMeta({
    title: "Hotels, Villas & Resorts | TravelMate",
    description:
      "Find hotels, villas and resorts in 190+ countries with TravelMate — clear prices and reviews from guests who actually stayed.",
  });

  const searchRef = useRef<HTMLFormElement>(null);
  const whereRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<(typeof searchTabs)[number]>("Hotels");
  const [filter, setFilter] = useState<Filter>("All");
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState("");
  const [dates, setDates] = useState<StayDates>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0, rooms: 1 });

  const visibleDestinations = useMemo(
    () =>
      (filter === "All" ? destinations : destinations.filter((d) => d.tag === filter)).slice(0, 6),
    [filter],
  );

  // Sample links for now: pointing at a place fills the search box and scrolls to it.
  const pickPlace = (name: string) => {
    if (whereRef.current) whereRef.current.value = name;
    setNotice("");
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    whereRef.current?.focus({ preventScroll: true });
  };

  // TODO: wire to TravelMate's hotel search once the partner hotels endpoint is ready.
  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const where = whereRef.current?.value.trim() || "anywhere";
    const when =
      dates.checkIn && dates.checkOut
        ? `${format(dates.checkIn, "d MMM")} to ${format(dates.checkOut, "d MMM yyyy")}`
        : "any dates";
    setNotice(
      `Live hotel search is coming soon. You picked: ${where}, ${when}, ${summariseGuests(guests)}.`,
    );
  };

  return (
    <>
      <Navbar />
      <div className="tmh">
        <section className="tmh-hero" aria-label="Find a stay">
          <img className="tmh-cover" src={HERO_IMAGE} alt="Coastal hotel on a Greek island at sunset" />
          <div className="tmh-hero-shade" />
          <div className="tmh-hero-copy">
            <h1 className="tmh-display tmh-h1">Find the stay that makes the trip.</h1>
            <p>Hotels, homes and resorts in 190+ countries.</p>
          </div>
        </section>

        <div className="tmh-search">
          <div className="tmh-tabs" role="tablist" aria-label="Stay type">
            {searchTabs.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={t === tab}
                className="tmh-tab"
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <form ref={searchRef} className="tmh-form" role="search" onSubmit={onSearch}>
            <label className="tmh-field">
              <span>Where to</span>
              <input ref={whereRef} name="where" placeholder="City, region or hotel" autoComplete="off" />
            </label>
            <DateRangeFields value={dates} onChange={setDates} />
            <GuestsField value={guests} onChange={setGuests} />
            <button type="submit" className="tmh-go">
              Search
            </button>
          </form>
          {notice && (
            <p className="tmh-note" role="status">
              {notice}
            </p>
          )}
        </div>

        <div className="tmh-trending">
          <span>Trending</span>
          {trending.map((t) => (
            <button key={t} type="button" className="tmh-chip" onClick={() => pickPlace(t)}>
              {t}
            </button>
          ))}
        </div>

        <section className="tmh-section" aria-labelledby="tmh-where">
          <div className="tmh-row">
            <div className="tmh-heading-group">
              <span className="tmh-kicker tmh-mono">WHERE TO GO</span>
              <h2 id="tmh-where" className="tmh-display tmh-big">
                Pick a place,
                <br />
                we’ll find the room.
              </h2>
            </div>
            <div className="tmh-filter" role="group" aria-label="Destination type">
              {destinationFilters.map((f) => (
                <button key={f} type="button" aria-pressed={f === filter} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="tmh-grid3">
            {visibleDestinations.map((d) => (
              <button key={d.name} type="button" className="tmh-dest" onClick={() => pickPlace(d.name)}>
                <img className="tmh-cover" src={d.image} alt={d.alt} loading="lazy" />
                <span className="tmh-dest-shade" />
                <span className="tmh-badge">Best {d.months}</span>
                <span className="tmh-dest-body">
                  <span className="tmh-dest-name">{d.name}</span>
                  <span className="tmh-dest-blurb">{d.blurb}</span>
                  <span className="tmh-dest-foot">
                    <span>{d.country}</span>
                    <span>from {formatEur(d.priceEur)} / night</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="tmh-section" aria-labelledby="tmh-way">
          <h2 id="tmh-way" className="tmh-display tmh-h2">
            Stay your way
          </h2>
          <div className="tmh-grid6">
            {stayTypes.map((t) => (
              <button key={t.name} type="button" className="tmh-type" onClick={() => pickPlace(t.name)}>
                <span className="tmh-thumb">
                  <img className="tmh-cover" src={t.image} alt={t.alt} loading="lazy" />
                </span>
                <b>{t.name}</b>
                <small>{t.line}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="tmh-blue" aria-labelledby="tmh-rated">
          <div className="tmh-row">
            <h2 id="tmh-rated" className="tmh-display tmh-big">
              Stays guests
              <br />
              rate 9+
            </h2>
            <button type="button" className="tmh-ghost" onClick={() => pickPlace("")}>
              See all stays
            </button>
          </div>
          <div className="tmh-grid4">
            {topStays.map((s) => (
              <article key={s.id} className="tmh-stay">
                <div className="tmh-stay-photo">
                  <img className="tmh-cover" src={s.image} alt={s.alt} loading="lazy" />
                  <span className="tmh-stay-badge">{s.badge}</span>
                  <button
                    type="button"
                    className="tmh-heart"
                    aria-pressed={Boolean(saved[s.id])}
                    aria-label={`${saved[s.id] ? "Remove" : "Save"} ${s.name}`}
                    onClick={() => setSaved((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                  >
                    {saved[s.id] ? "♥" : "♡"}
                  </button>
                </div>
                <div className="tmh-stay-body">
                  <div className="tmh-stay-top">
                    <b>{s.name}</b>
                    <span className="tmh-score">{s.score}</span>
                  </div>
                  <span className="tmh-stay-place">
                    {s.place} · {s.perk}
                  </span>
                  <span className="tmh-stay-price">
                    {formatEur(s.priceEur)} <small>/ night</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tmh-section" aria-labelledby="tmh-more">
          <div className="tmh-row">
            <h2 id="tmh-more" className="tmh-display tmh-h2">
              More places to explore
            </h2>
            <button type="button" className="tmh-link" onClick={() => pickPlace("")}>
              All destinations →
            </button>
          </div>
          <div className="tmh-more">
            {moreDestinations.map((d) => (
              <button key={d.name} type="button" className="tmh-place" onClick={() => pickPlace(d.name)}>
                <span className="tmh-thumb">
                  <img className="tmh-cover" src={d.image} alt={d.alt} loading="lazy" />
                </span>
                <span className="tmh-place-text">
                  <b>{d.name}</b>
                  <small>
                    {d.country} · from {formatEur(d.priceEur)}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="tmh-why" aria-labelledby="tmh-why">
          <h2 id="tmh-why" className="tmh-display tmh-why-title">
            Why book with Travel&shy;Mate
          </h2>
          <div className="tmh-promises">
            {promises.map((p) => (
              <div key={p.n} className="tmh-promise">
                <span className="tmh-mono">{p.n}</span>
                <b>{p.title}</b>
                <span>{p.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="tmh-reviews" aria-label="Guest reviews">
          {reviews.map((r) => (
            <figure key={r.who} className="tmh-review">
              <blockquote>“{r.quote}”</blockquote>
              <figcaption>
                <span>{r.who}</span>
                <span className="tmh-score is-orange">{r.score}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="tmh-section" aria-labelledby="tmh-guides">
          <h2 id="tmh-guides" className="tmh-display tmh-h2">
            Travel guides
          </h2>
          <div className="tmh-grid3">
            {guides.map((g) => (
              <button key={g.title} type="button" className="tmh-guide">
                <span className="tmh-thumb">
                  <img className="tmh-cover" src={g.image} alt={g.alt} loading="lazy" />
                </span>
                <span className="tmh-mono">
                  {g.kicker} · {g.read}
                </span>
                <b>{g.title}</b>
              </button>
            ))}
          </div>
        </section>

        <div className="tmh-end" />
      </div>
      <Footer />
    </>
  );
}
