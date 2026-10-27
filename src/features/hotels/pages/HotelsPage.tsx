import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { SearchCard } from "../components/SearchCard";
import { searchHotels } from "../api/hotelsApi";
import { hotelsRoutes } from "../routes";
import { outOfTen } from "../format";
import { DEFAULT_SEARCH, buildSearchParams } from "../search";
import {
  HERO_IMAGE,
  destinationFilters,
  destinations,
  guides,
  moreDestinations,
  promises,
  reviews,
  stayTypes,
  trending,
} from "../data";
import type { HotelSummary, SearchState } from "../types";
import "../hotels.css";
import "../results.css";
import { refreshBookLink, withVisitor } from "../visitor";

type Filter = (typeof destinationFilters)[number];

type Spot = { name: string; lat: number; lng: number };

/** The place shown in "Stays guests rate 9+" (real hotels, ranked by stars and guest score). */
const FEATURED: Spot = { name: "Lisbon", lat: 38.72509, lng: -9.1498 };

export default function HotelsPage() {
  usePageMeta({
    title: "Hotels, Villas & Resorts | TravelMate",
    description:
      "Find hotels, villas and resorts in 190+ countries with TravelMate — clear prices and reviews from guests who actually stayed.",
  });

  const navigate = useNavigate();
  const searchRef = useRef<HTMLFormElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [fill, setFill] = useState<(Spot & { nonce: number }) | null>(null);
  const [topRated, setTopRated] = useState<HotelSummary[]>([]);

  const visibleDestinations = useMemo(
    () => (filter === "All" ? destinations : destinations.filter((d) => d.tag === filter)).slice(0, 6),
    [filter],
  );

  // real top-rated hotels for the strip (hidden if the hotel service is unreachable)
  useEffect(() => {
    const controller = new AbortController();
    const search: SearchState = { ...DEFAULT_SEARCH, lat: FEATURED.lat, lng: FEATURED.lng, name: FEATURED.name };
    searchHotels(search, 1, controller.signal)
      .then((result) => {
        const best = result.hotels
          .filter((h) => h.review && h.review.score >= 4.5 && h.review.count >= 50 && h.image)
          .slice(0, 4);
        setTopRated(best);
      })
      .catch(() => setTopRated([]));
    return () => controller.abort();
  }, []);

  const goToResults = (search: SearchState) => navigate(`${hotelsRoutes.results}?${buildSearchParams(search).toString()}`);

  /** A card for a place: open its results straight away (no dates yet: the guest picks them on the next page). */
  const openPlace = (spot: Spot) =>
    goToResults({ ...DEFAULT_SEARCH, lat: spot.lat, lng: spot.lng, name: spot.name });

  /** A chip or link that is not a place: take the guest to the search box. */
  const focusSearch = (spot?: Spot) => {
    if (spot) setFill({ ...spot, nonce: Date.now() });
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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

        <SearchCard initial={DEFAULT_SEARCH} onSearch={goToResults} fillPlace={fill} formRef={searchRef} />

        <div className="tmh-trending">
          <span>Trending</span>
          {trending.map((t) => (
            <button key={t.label} type="button" className="tmh-chip" onClick={() => (t.spot ? openPlace(t.spot) : focusSearch())}>
              {t.label}
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
              <button key={d.name} type="button" className="tmh-dest" onClick={() => openPlace(d)}>
                <img className="tmh-cover" src={d.image} alt={d.alt} loading="lazy" />
                <span className="tmh-dest-shade" />
                <span className="tmh-badge">Best {d.months}</span>
                <span className="tmh-dest-body">
                  <span className="tmh-dest-name">{d.name}</span>
                  <span className="tmh-dest-blurb">{d.blurb}</span>
                  <span className="tmh-dest-foot">
                    <span>{d.country}</span>
                    <span>See hotels →</span>
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
              <button key={t.name} type="button" className="tmh-type" onClick={() => focusSearch()}>
                <span className="tmh-thumb">
                  <img className="tmh-cover" src={t.image} alt={t.alt} loading="lazy" />
                </span>
                <b>{t.name}</b>
                <small>{t.line}</small>
              </button>
            ))}
          </div>
        </section>

        {topRated.length > 0 && (
          <section className="tmh-blue" aria-labelledby="tmh-rated">
            <div className="tmh-row">
              <h2 id="tmh-rated" className="tmh-display tmh-big">
                Stays guests
                <br />
                rate 9+
              </h2>
              <button type="button" className="tmh-ghost" onClick={() => openPlace(FEATURED)}>
                See all stays in {FEATURED.name}
              </button>
            </div>
            <div className="tmh-grid4">
              {topRated.map((h) => (
                <article key={h.id} className="tmh-stay">
                  <div className="tmh-stay-photo">
                    {h.image && <img className="tmh-cover" src={h.image} alt={h.name} loading="lazy" />}
                    {h.stars ? <span className="tmh-stay-badge">{"★".repeat(Math.round(h.stars))}</span> : null}
                  </div>
                  <div className="tmh-stay-body">
                    <div className="tmh-stay-top">
                      <b>{h.name}</b>
                      {h.review && <span className="tmh-score">{outOfTen(h.review.score)}</span>}
                    </div>
                    <span className="tmh-stay-place">{[h.city, h.country].filter(Boolean).join(", ")}</span>
                    <a className="tmh-stay-link" href={withVisitor(h.book_url)} onClick={refreshBookLink(h.book_url)}>
                      Check price →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="tmh-section" aria-labelledby="tmh-more">
          <div className="tmh-row">
            <h2 id="tmh-more" className="tmh-display tmh-h2">
              More places to explore
            </h2>
            <button type="button" className="tmh-link" onClick={() => focusSearch()}>
              Search a destination →
            </button>
          </div>
          <div className="tmh-more">
            {moreDestinations.map((d) => (
              <button key={d.name} type="button" className="tmh-place" onClick={() => openPlace(d)}>
                <span className="tmh-thumb">
                  <img className="tmh-cover" src={d.image} alt={d.alt} loading="lazy" />
                </span>
                <span className="tmh-place-text">
                  <b>{d.name}</b>
                  <small>{d.country}</small>
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
