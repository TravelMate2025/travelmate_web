import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { HotelCard, HotelCardSkeleton } from "../components/HotelCard";
import { SearchCard } from "../components/SearchCard";
import { HotelsApiError, searchAllHotels } from "../api/hotelsApi";
import { outOfTen as scoreOutOfTen } from "../format";
import { hotelsRoutes } from "../routes";
import { NO_FILTERS, buildSearchParams, filterParams, hasPlace, parseFilters, parseSearch, stayLine } from "../search";
import type { ResultFilters, SortKey } from "../search";
import type { HotelsPageResult, HotelSummary, SearchState } from "../types";
import "../hotels.css";
import "../results.css";

const PAGE_SIZE = 20;

const SORT_LABELS: Record<SortKey, string> = {
  recommended: "Recommended",
  rating: "Guest rating",
  stars_desc: "Stars: high to low",
  stars_asc: "Stars: low to high",
  distance: "Distance from centre",
};
const SCORE_OPTIONS = [
  { min: 9, label: "Exceptional", note: "9+" },
  { min: 8, label: "Very good", note: "8+" },
  { min: 7, label: "Good", note: "7+" },
];
const DIST_OPTIONS = [2, 5, 10, 25];

// same maths as the score shown on each card (the data is out of 5, guests see out of 10)
const outOfTen = (h: HotelSummary) => (h.review ? Number(scoreOutOfTen(h.review.score)) : null);

type Facet = "stars" | "score" | "dist";

/** Does a hotel pass the filters? `skip` leaves one group out, so each option can show how many hotels it would give. */
function passes(h: HotelSummary, f: ResultFilters, skip?: Facet): boolean {
  if (f.name.trim() && !h.name.toLowerCase().includes(f.name.trim().toLowerCase())) return false;
  if (skip !== "stars" && f.stars.length && !f.stars.includes(Math.floor(h.stars ?? 0))) return false;
  if (skip !== "score" && f.score && (outOfTen(h) ?? 0) < f.score) return false;
  if (skip !== "dist" && f.dist && (h.distance_km === undefined || h.distance_km > f.dist)) return false;
  return true;
}

function applyFilters(hotels: HotelSummary[], f: ResultFilters): HotelSummary[] {
  const kept = hotels.filter((h) => passes(h, f));
  if (f.sort === "recommended") return kept;
  // hotels without the thing we sort by go last; the service's own order breaks ties
  const key = (h: HotelSummary): number | null => {
    if (f.sort === "rating") return outOfTen(h);
    if (f.sort === "distance") return h.distance_km ?? null;
    return h.stars;
  };
  const dir = f.sort === "stars_asc" || f.sort === "distance" ? 1 : -1;
  return kept
    .map((h, i) => ({ h, i, k: key(h) }))
    .sort((a, b) => (a.k === null ? 1 : 0) - (b.k === null ? 1 : 0) || (a.k !== null && b.k !== null ? (a.k - b.k) * dir : 0) || a.i - b.i)
    .map((x) => x.h);
}

export default function HotelResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const search = useMemo(() => parseSearch(params), [params]);
  const filters = useMemo(() => parseFilters(params), [params]);
  const pageParam = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
  const searchQuery = useMemo(() => buildSearchParams(search).toString(), [search]);

  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; data?: HotelsPageResult; error?: string }>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [drawer, setDrawer] = useState(false);

  const placeName = state.data?.place?.name || search.name || search.q || "your destination";
  usePageMeta({
    title: `Hotels in ${placeName} | TravelMate`,
    description: `Hotels, villas and resorts in ${placeName}, with guest scores and photos. Check live prices and book with TravelMate.`,
  });

  useEffect(() => {
    if (!hasPlace(search)) return;
    const controller = new AbortController();
    setState((s) => ({ status: "loading", data: s.data }));
    searchAllHotels(search, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", error: error instanceof HotelsApiError ? error.message : "Something went wrong. Please try again." });
      });
    return () => controller.abort();
  }, [search, attempt]);

  const all = useMemo(() => state.data?.hotels ?? [], [state.data]);
  const shown = useMemo(() => applyFilters(all, filters), [all, filters]);
  const pages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const page = Math.min(pageParam, pages);
  const pageHotels = shown.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasDistance = all.some((h) => h.distance_km !== undefined);
  const starLevels = [5, 4, 3, 2, 1].filter((n) => all.some((h) => Math.floor(h.stars ?? 0) === n));
  const count = (facet: Facet, test: (h: HotelSummary) => boolean) => all.filter((h) => passes(h, filters, facet) && test(h)).length;
  const filterCount = filters.stars.length + (filters.score ? 1 : 0) + (filters.dist ? 1 : 0) + (filters.name.trim() ? 1 : 0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const goTo = (s: SearchState) => navigate(`${hotelsRoutes.results}?${buildSearchParams(s).toString()}`);
  const link = (f: ResultFilters, p = 1) =>
    `${hotelsRoutes.results}?${buildSearchParams(search, { ...filterParams(f), ...(p > 1 ? { page: String(p) } : {}) }).toString()}`;
  const pageLink = (p: number) => link(filters, p);
  const setFilters = (patch: Partial<ResultFilters>) => navigate(link({ ...filters, ...patch }), { replace: true });
  const reset = () => setFilters({ ...NO_FILTERS });
  const toggleStar = (n: number) => setFilters({ stars: filters.stars.includes(n) ? filters.stars.filter((x) => x !== n) : [...filters.stars, n] });

  const data = state.data;
  const showTools = !!data && data.hotels.length > 1;

  return (
    <>
      <Navbar />
      <div className="tmh">
        <section className="tmh-top">
          <SearchCard key={searchQuery} initial={search} onSearch={goTo} />
        </section>

        <main className="tmh-results">
          {!hasPlace(search) ? (
            <div className="tmh-empty">
              <h1 className="tmh-h3">Where would you like to stay?</h1>
              <p>Type a city, region or hotel above to see places to stay.</p>
            </div>
          ) : (
            <>
              <header className="tmh-results-head">
                <div>
                  <h1 className="tmh-h3">
                    {state.status === "ready" && data ? `${shown.length} ${shown.length === 1 ? "place" : "places"} to stay near ${placeName}` : `Places to stay near ${placeName}`}
                  </h1>
                  <p className="tmh-sub">{stayLine(search)}</p>
                </div>
                {data?.place?.results_url && (
                  <a href={data.place.results_url} className="tmh-btn tmh-btn-ghost">
                    See live prices for all hotels
                  </a>
                )}
              </header>

              {state.status === "error" && (
                <div className="tmh-empty" role="alert">
                  <h2 className="tmh-h3">We could not load the hotels</h2>
                  <p>{state.error}</p>
                  <button type="button" className="tmh-btn tmh-btn-solid" onClick={() => setAttempt((n) => n + 1)}>
                    Try again
                  </button>
                </div>
              )}

              {state.status !== "error" && (
                <div className={showTools ? "tmh-layout has-side" : "tmh-layout"}>
                  {showTools && (
                    <>
                      {drawer && <button type="button" className="tmh-scrim" aria-label="Close filters" onClick={() => setDrawer(false)} />}
                      <aside className={drawer ? "tmh-side is-open" : "tmh-side"} aria-label="Filters">
                        <div className="tmh-side-head">
                          <h2>Filters</h2>
                          {filterCount > 0 && (
                            <button type="button" className="tmh-flink" onClick={reset}>
                              Reset all
                            </button>
                          )}
                          <button type="button" className="tmh-side-close" aria-label="Close filters" onClick={() => setDrawer(false)}>
                            ×
                          </button>
                        </div>

                        <div className="tmh-side-body">
                          <div className="tmh-fblock">
                            <label className="tmh-fttl" htmlFor="tmh-hq">
                              Hotel name
                            </label>
                            <input
                              id="tmh-hq"
                              className="tmh-finput"
                              type="search"
                              placeholder="e.g. Bellagio"
                              value={filters.name}
                              maxLength={60}
                              onChange={(e) => setFilters({ name: e.target.value })}
                            />
                          </div>

                          {starLevels.length > 0 && (
                            <fieldset className="tmh-fblock">
                              <legend className="tmh-fttl">Star rating</legend>
                              {starLevels.map((n) => {
                                const c = count("stars", (h) => Math.floor(h.stars ?? 0) === n);
                                const on = filters.stars.includes(n);
                                return (
                                  <label key={n} className={c === 0 && !on ? "tmh-opt is-zero" : "tmh-opt"}>
                                    <input type="checkbox" checked={on} onChange={() => toggleStar(n)} />
                                    <span className="tmh-opt-label">
                                      <span className="tmh-opt-stars" aria-hidden="true">
                                        {"★".repeat(n)}
                                      </span>
                                      <span className="tmh-sr">{n} star</span>
                                    </span>
                                    <span className="tmh-opt-n">{c}</span>
                                  </label>
                                );
                              })}
                            </fieldset>
                          )}

                          <fieldset className="tmh-fblock">
                            <legend className="tmh-fttl">Guest score</legend>
                            {[{ min: 0, label: "Any score", note: "" }, ...SCORE_OPTIONS].map((o) => {
                              const c = count("score", (h) => (outOfTen(h) ?? 0) >= o.min && (o.min === 0 || h.review !== null));
                              return (
                                <label key={o.min} className={c === 0 && filters.score !== o.min ? "tmh-opt is-zero" : "tmh-opt"}>
                                  <input type="radio" name="tmh-score" checked={filters.score === o.min} onChange={() => setFilters({ score: o.min })} />
                                  <span className="tmh-opt-label">
                                    {o.label} {o.note && <em>{o.note}</em>}
                                  </span>
                                  <span className="tmh-opt-n">{c}</span>
                                </label>
                              );
                            })}
                          </fieldset>

                          {hasDistance && (
                            <fieldset className="tmh-fblock">
                              <legend className="tmh-fttl">Distance from centre</legend>
                              {[0, ...DIST_OPTIONS].map((d) => {
                                const c = count("dist", (h) => d === 0 || (h.distance_km !== undefined && h.distance_km <= d));
                                return (
                                  <label key={d} className={c === 0 && filters.dist !== d ? "tmh-opt is-zero" : "tmh-opt"}>
                                    <input type="radio" name="tmh-dist" checked={filters.dist === d} onChange={() => setFilters({ dist: d })} />
                                    <span className="tmh-opt-label">{d === 0 ? "Any distance" : `Within ${d} km`}</span>
                                    <span className="tmh-opt-n">{c}</span>
                                  </label>
                                );
                              })}
                            </fieldset>
                          )}
                        </div>

                        <div className="tmh-side-foot">
                          <button type="button" className="tmh-btn tmh-btn-solid" onClick={() => setDrawer(false)}>
                            Show {shown.length} hotel{shown.length === 1 ? "" : "s"}
                          </button>
                        </div>
                      </aside>
                    </>
                  )}

                  <section className="tmh-main" aria-live="polite">
                    {showTools && (
                      <>
                        <div className="tmh-toolbar">
                          <button type="button" className="tmh-filter-open tmh-btn tmh-btn-ghost" onClick={() => setDrawer(true)}>
                            Filters{filterCount > 0 ? ` (${filterCount})` : ""}
                          </button>
                          <p className="tmh-toolbar-count">{filterCount > 0 ? `${shown.length} of ${all.length} hotels` : `${all.length} hotels`}</p>
                          <label className="tmh-sort">
                            <span>Sort by</span>
                            <select value={filters.sort} onChange={(e) => setFilters({ sort: e.target.value as SortKey })}>
                              {(Object.keys(SORT_LABELS) as SortKey[])
                                .filter((k) => k !== "distance" || hasDistance)
                                .map((k) => (
                                  <option key={k} value={k}>
                                    {SORT_LABELS[k]}
                                  </option>
                                ))}
                            </select>
                          </label>
                        </div>

                        {filterCount > 0 && (
                          <ul className="tmh-active" aria-label="Active filters">
                            {filters.name.trim() && (
                              <li>
                                <button type="button" onClick={() => setFilters({ name: "" })}>
                                  “{filters.name.trim()}” <span aria-hidden="true">×</span>
                                </button>
                              </li>
                            )}
                            {filters.stars.map((n) => (
                              <li key={n}>
                                <button type="button" onClick={() => toggleStar(n)}>
                                  {n} star{n === 1 ? "" : "s"} <span aria-hidden="true">×</span>
                                </button>
                              </li>
                            ))}
                            {filters.score > 0 && (
                              <li>
                                <button type="button" onClick={() => setFilters({ score: 0 })}>
                                  Score {filters.score}+ <span aria-hidden="true">×</span>
                                </button>
                              </li>
                            )}
                            {filters.dist > 0 && (
                              <li>
                                <button type="button" onClick={() => setFilters({ dist: 0 })}>
                                  Within {filters.dist} km <span aria-hidden="true">×</span>
                                </button>
                              </li>
                            )}
                          </ul>
                        )}
                      </>
                    )}

                    {state.status === "loading" && !data && Array.from({ length: 5 }, (_, i) => <HotelCardSkeleton key={i} />)}

                    {data && data.hotels.length === 0 && (
                      <div className="tmh-empty">
                        <h2 className="tmh-h3">No hotels found near {placeName}</h2>
                        <p>Try another spelling or a nearby city.</p>
                      </div>
                    )}

                    {data && data.hotels.length > 0 && shown.length === 0 && (
                      <div className="tmh-empty">
                        <h2 className="tmh-h3">No hotels match these filters</h2>
                        <p>Try removing one of them.</p>
                        <button type="button" className="tmh-btn tmh-btn-solid" onClick={reset}>
                          Reset all filters
                        </button>
                      </div>
                    )}

                    {shown.length > 0 && (
                      <div className={state.status === "loading" ? "tmh-list is-stale" : "tmh-list"} aria-busy={state.status === "loading"}>
                        {pageHotels.map((h) => (
                          <HotelCard key={h.id} hotel={h} searchQuery={searchQuery} />
                        ))}
                      </div>
                    )}

                    {pages > 1 && (
                      <nav className="tmh-pager" aria-label="Pages of results">
                        {page > 1 && (
                          <Link to={pageLink(page - 1)} className="tmh-page-btn" rel="prev">
                            ← Previous
                          </Link>
                        )}
                        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                          <Link key={p} to={pageLink(p)} className={p === page ? "tmh-page-btn is-current" : "tmh-page-btn"} aria-current={p === page ? "page" : undefined}>
                            {p}
                          </Link>
                        ))}
                        {page < pages && (
                          <Link to={pageLink(page + 1)} className="tmh-page-btn" rel="next">
                            Next →
                          </Link>
                        )}
                      </nav>
                    )}

                    <p className="tmh-fineprint">Prices are not shown here. “Check price” opens TravelMate’s booking page with live prices for your dates.</p>
                  </section>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
