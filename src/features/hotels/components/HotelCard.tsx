import { Link } from "react-router-dom";
import { hotelsRoutes } from "../routes";
import { outOfTen, scoreWord } from "../format";
import type { HotelSummary } from "../types";

export function Stars({ count }: { count: number | null }) {
  const n = Math.round(count ?? 0);
  if (n <= 0) return null;
  return (
    <span className="tmh-stars" role="img" aria-label={`${n} star hotel`}>
      {"★".repeat(n)}
    </span>
  );
}

type Props = {
  hotel: HotelSummary;
  /** The current search as a query string, so the details page keeps the dates and guests. */
  searchQuery: string;
};

export function HotelCard({ hotel, searchQuery }: Props) {
  const place = [hotel.city, hotel.country].filter(Boolean).join(", ");
  const score10 = hotel.review ? Number(outOfTen(hotel.review.score)) : null;
  return (
    <article className="tmh-hotel">
      <Link to={`${hotelsRoutes.detail(hotel.id)}?${searchQuery}`} className="tmh-hotel-photo" aria-label={`${hotel.name}: view details`}>
        {hotel.image ? <img className="tmh-cover" src={hotel.image} alt="" loading="lazy" /> : null}
      </Link>
      <div className="tmh-hotel-body">
        <div className="tmh-hotel-head">
          <div>
            <h3 className="tmh-hotel-name">
              <Link to={`${hotelsRoutes.detail(hotel.id)}?${searchQuery}`}>{hotel.name}</Link>
            </h3>
            <Stars count={hotel.stars} />
            <p className="tmh-hotel-place">
              {place}
              {hotel.distance_km !== undefined && ` · ${hotel.distance_km} km from the centre`}
            </p>
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
        </div>
        {hotel.facilities.length > 0 && (
          <ul className="tmh-tags">
            {hotel.facilities.slice(0, 5).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        <div className="tmh-hotel-actions">
          <Link to={`${hotelsRoutes.detail(hotel.id)}?${searchQuery}`} className="tmh-btn tmh-btn-ghost">
            View details
          </Link>
          <a href={hotel.book_url} className="tmh-btn tmh-btn-solid">
            Check price
          </a>
        </div>
      </div>
    </article>
  );
}

export function HotelCardSkeleton() {
  return (
    <div className="tmh-hotel is-loading" aria-hidden="true">
      <div className="tmh-hotel-photo" />
      <div className="tmh-hotel-body">
        <span className="tmh-skel" />
        <span className="tmh-skel is-short" />
        <span className="tmh-skel is-short" />
      </div>
    </div>
  );
}
