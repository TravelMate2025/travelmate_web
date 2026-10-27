import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { HotelCard, HotelCardSkeleton } from "../components/HotelCard";
import { SearchCard } from "../components/SearchCard";
import { HotelsApiError, searchHotels } from "../api/hotelsApi";
import { hotelsRoutes } from "../routes";
import { buildSearchParams, hasPlace, parseSearch, stayLine } from "../search";
import type { HotelsPageResult, SearchState } from "../types";
import "../hotels.css";
import "../results.css";

const MAX_PAGE = 5;

export default function HotelResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const search = useMemo(() => parseSearch(params), [params]);
  const page = Math.min(MAX_PAGE, Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1));
  const searchQuery = useMemo(() => buildSearchParams(search).toString(), [search]);

  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; data?: HotelsPageResult; error?: string }>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  const placeName = state.data?.place?.name || search.name || search.q || "your destination";
  usePageMeta({
    title: `Hotels in ${placeName} | TravelMate`,
    description: `Hotels, villas and resorts in ${placeName}, with guest scores and photos. Check live prices and book with TravelMate.`,
  });

  useEffect(() => {
    if (!hasPlace(search)) return;
    const controller = new AbortController();
    setState((s) => ({ status: "loading", data: s.data }));
    searchHotels(search, page, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", error: error instanceof HotelsApiError ? error.message : "Something went wrong. Please try again." });
      });
    return () => controller.abort();
  }, [search, page, attempt]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const goTo = (s: SearchState, p = 1) => navigate(`${hotelsRoutes.results}?${buildSearchParams(s, p > 1 ? { page: String(p) } : {}).toString()}`);
  const pageLink = (p: number) => `${hotelsRoutes.results}?${buildSearchParams(search, p > 1 ? { page: String(p) } : {}).toString()}`;

  const data = state.data;
  const pages = data?.pages ?? 0;

  return (
    <>
      <Navbar />
      <div className="tmh">
        <section className="tmh-top">
          <SearchCard key={searchQuery} initial={search} onSearch={(s) => goTo(s)} />
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
                  <h1 className="tmh-h3">{state.status === "ready" && data ? `${data.total} places to stay near ${placeName}` : `Places to stay near ${placeName}`}</h1>
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

              {state.status === "loading" && !data && Array.from({ length: 5 }, (_, i) => <HotelCardSkeleton key={i} />)}

              {state.status !== "error" && data && data.hotels.length === 0 && (
                <div className="tmh-empty">
                  <h2 className="tmh-h3">No hotels found near {placeName}</h2>
                  <p>Try another spelling or a nearby city.</p>
                </div>
              )}

              {state.status !== "error" && data && data.hotels.length > 0 && (
                <div className={state.status === "loading" ? "tmh-list is-stale" : "tmh-list"} aria-busy={state.status === "loading"}>
                  {data.hotels.map((h) => (
                    <HotelCard key={h.id} hotel={h} searchQuery={searchQuery} />
                  ))}
                </div>
              )}

              {pages > 1 && state.status !== "error" && (
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
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
