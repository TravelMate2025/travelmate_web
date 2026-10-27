import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Dialog } from "@mui/material";
import { usePageMeta } from "../../../hooks/usePageMeta";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import { Stars } from "../components/HotelCard";
import { outOfTen, scoreWord } from "../format";
import { HotelsApiError, getHotel } from "../api/hotelsApi";
import { hotelsRoutes } from "../routes";
import { buildSearchParams, parseSearch, stayLine } from "../search";
import type { HotelDetails } from "../types";
import "../hotels.css";
import "../results.css";
import { refreshBookLink, withVisitor } from "../visitor";

const FACILITIES_SHOWN = 16;

export default function HotelDetailsPage() {
  const { hotelId = "" } = useParams();
  const [params] = useSearchParams();
  const search = useMemo(() => parseSearch(params), [params]);
  const backQuery = useMemo(() => buildSearchParams(search).toString(), [search]);

  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; hotel?: HotelDetails; error?: string }>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [gallery, setGallery] = useState<number | null>(null);
  const [allFacilities, setAllFacilities] = useState(false);

  usePageMeta({
    title: `${state.hotel?.name ?? "Hotel"} | TravelMate`,
    description: state.hotel
      ? `${state.hotel.name} in ${[state.hotel.city, state.hotel.country].filter(Boolean).join(", ")}: photos, facilities and guest reviews. Check live prices with TravelMate.`
      : "Hotel details with TravelMate.",
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    getHotel(hotelId, search, controller.signal)
      .then((hotel) => setState({ status: "ready", hotel }))
      .catch((error: Error) => {
        if (error.name === "AbortError") return;
        setState({
          status: "error",
          error: error instanceof HotelsApiError && error.status === 404 ? "We could not find this hotel." : error instanceof HotelsApiError ? error.message : "Something went wrong. Please try again.",
        });
      });
    return () => controller.abort();
  }, [hotelId, search, attempt]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [hotelId]);

  const hotel = state.hotel;
  const score10 = hotel?.review ? Number(outOfTen(hotel.review.score)) : null;
  const images = hotel?.images ?? [];
  const back = `${hotelsRoutes.results}?${backQuery}`;

  return (
    <>
      <Navbar />
      <div className="tmh">
        <main className="tmh-detail">
          <Link to={back} className="tmh-back">
            ← Back to results
          </Link>

          {state.status === "loading" && (
            <div className="tmh-detail-skel" aria-busy="true" aria-label="Loading hotel">
              <span className="tmh-skel is-photo" />
              <span className="tmh-skel" />
              <span className="tmh-skel is-short" />
            </div>
          )}

          {state.status === "error" && (
            <div className="tmh-empty" role="alert">
              <h1 className="tmh-h3">{state.error}</h1>
              <div className="tmh-hotel-actions">
                <button type="button" className="tmh-btn tmh-btn-solid" onClick={() => setAttempt((n) => n + 1)}>
                  Try again
                </button>
                <Link to={back} className="tmh-btn tmh-btn-ghost">
                  Back to results
                </Link>
              </div>
            </div>
          )}

          {state.status === "ready" && hotel && (
            <>
              <header className="tmh-detail-head">
                <div>
                  <h1 className="tmh-h3">{hotel.name}</h1>
                  <Stars count={hotel.stars} />
                  <p className="tmh-hotel-place">{hotel.full_address || [hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")}</p>
                </div>
                {hotel.review && score10 !== null && (
                  <div className="tmh-hotel-review">
                    <span>
                      <b>{scoreWord(score10)}</b>
                      <small>{hotel.review.count.toLocaleString("en")} reviews</small>
                    </span>
                    <span className="tmh-score">{score10.toFixed(1)}</span>
                  </div>
                )}
              </header>

              {images.length > 0 && (
                <div className="tmh-gallery" data-count={Math.min(images.length, 5)}>
                  {images.slice(0, 5).map((src, i) => (
                    <button key={src} type="button" className="tmh-gallery-item" onClick={() => setGallery(i)} aria-label={`Open photo ${i + 1} of ${images.length}`}>
                      <img className="tmh-cover" src={src} alt={i === 0 ? hotel.name : ""} loading={i === 0 ? "eager" : "lazy"} />
                      {i === 4 && images.length > 5 && <span className="tmh-gallery-more">+{images.length - 5} photos</span>}
                    </button>
                  ))}
                </div>
              )}

              <div className="tmh-detail-cols">
                <div className="tmh-detail-main">
                  {hotel.description && (
                    <section>
                      <h2 className="tmh-h4">About this stay</h2>
                      <p className="tmh-prose">{hotel.description}</p>
                    </section>
                  )}
                  {hotel.facilities.length > 0 && (
                    <section>
                      <h2 className="tmh-h4">What this place offers</h2>
                      <ul className="tmh-facilities">
                        {(allFacilities ? hotel.facilities : hotel.facilities.slice(0, FACILITIES_SHOWN)).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      {hotel.facilities.length > FACILITIES_SHOWN && (
                        <button type="button" className="tmh-more-btn" onClick={() => setAllFacilities((v) => !v)}>
                          {allFacilities ? "Show fewer" : `Show all ${hotel.facilities.length}`}
                        </button>
                      )}
                    </section>
                  )}
                  {(hotel.check_in_time || hotel.check_out_time) && (
                    <section>
                      <h2 className="tmh-h4">Good to know</h2>
                      <p className="tmh-prose">
                        {hotel.check_in_time && `Check-in from ${hotel.check_in_time}. `}
                        {hotel.check_out_time && `Check-out until ${hotel.check_out_time}.`}
                      </p>
                    </section>
                  )}
                </div>

                <aside className="tmh-book" aria-label="Check price">
                  <h2 className="tmh-h4">Your stay</h2>
                  <p className="tmh-book-line">{stayLine(search)}</p>
                  <a href={withVisitor(hotel.book_url)} onClick={refreshBookLink(hotel.book_url)} className="tmh-btn tmh-btn-solid tmh-btn-wide">
                    Check price
                  </a>
                  <p className="tmh-fineprint">Live prices, rooms and booking are on TravelMate’s secure booking page. Taxes and fees are shown before you pay.</p>
                </aside>
              </div>

              <Dialog open={gallery !== null} onClose={() => setGallery(null)} maxWidth="lg" fullWidth aria-label="Photos">
                <div className="tmh-lightbox">
                  <button type="button" className="tmh-lightbox-close" onClick={() => setGallery(null)} aria-label="Close photos">
                    ×
                  </button>
                  <div className="tmh-lightbox-grid">
                    {images.map((src, i) => (
                      <img key={src} src={src} alt={i === 0 ? hotel.name : ""} loading="lazy" ref={(el) => { if (el && i === gallery) el.scrollIntoView({ block: "center" }); }} />
                    ))}
                  </div>
                </div>
              </Dialog>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
