import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { suggestPlaces } from "../api/hotelsApi";
import { DateRangeFields, type StayDates } from "./DateRangeFields";
import { GuestsField } from "./GuestsField";
import { fromIsoDate, hasPlace, toIsoDate } from "../search";
import type { GuestCounts } from "../guests";
import type { PlaceSuggestion, SearchState } from "../types";

type Props = {
  /** What the card starts with (the landing page starts empty; the results page starts with the current search). */
  initial: SearchState;
  onSearch: (search: SearchState) => void;
  /** Landing page only: a place picked from a card fills the box. */
  fillPlace?: { name: string; lat: number; lng: number; nonce: number } | null;
  notice?: string;
  tabs?: ReactNode;
  formRef?: Ref<HTMLFormElement>;
};

/** The search card: place with suggestions, one calendar for both dates, guests with child ages. */
export function SearchCard({ initial, onSearch, fillPlace, notice, tabs, formRef }: Props) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(initial.name || initial.q);
  const [picked, setPicked] = useState<{ name: string; lat: number; lng: number } | null>(
    initial.lat !== null && initial.lng !== null ? { name: initial.name, lat: initial.lat, lng: initial.lng } : null,
  );
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [problem, setProblem] = useState("");
  const [dates, setDates] = useState<StayDates>({
    checkIn: fromIsoDate(initial.checkIn),
    checkOut: fromIsoDate(initial.checkOut),
  });
  const [guests, setGuests] = useState<GuestCounts>({
    adults: initial.adults,
    rooms: initial.rooms,
    childAges: initial.childAges,
  });

  // a place chosen from a destination card on the landing page
  useEffect(() => {
    if (!fillPlace) return;
    setText(fillPlace.name);
    setPicked({ name: fillPlace.name, lat: fillPlace.lat, lng: fillPlace.lng });
    setSuggestions([]);
    setOpen(false);
    setProblem("");
  }, [fillPlace]);

  // suggestions while typing (waits a moment, cancels the previous request)
  useEffect(() => {
    const query = text.trim();
    if (picked || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      suggestPlaces(query, controller.signal)
        .then((places) => {
          setSuggestions(places);
          setActive(-1);
        })
        .catch(() => setSuggestions([]));
    }, 250);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [text, picked]);

  const choose = (place: PlaceSuggestion) => {
    setText(place.name);
    setPicked({ name: place.name, lat: place.lat, lng: place.lng });
    setSuggestions([]);
    setOpen(false);
    setProblem("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(suggestions[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const search: SearchState = {
      q: picked ? "" : text.trim(),
      lat: picked ? picked.lat : null,
      lng: picked ? picked.lng : null,
      name: picked ? picked.name : "",
      checkIn: dates.checkIn && dates.checkOut ? toIsoDate(dates.checkIn) : "",
      checkOut: dates.checkIn && dates.checkOut ? toIsoDate(dates.checkOut) : "",
      adults: guests.adults,
      rooms: guests.rooms,
      childAges: guests.childAges,
    };
    if (!hasPlace(search)) {
      setProblem("Type a city, region or hotel first.");
      inputRef.current?.focus();
      return;
    }
    setProblem("");
    onSearch(search);
  };

  const showList = open && suggestions.length > 0;

  return (
    <div className="tmh-search">
      {tabs}
      <form ref={formRef} className="tmh-form" role="search" onSubmit={submit}>
        <label className="tmh-field tmh-field-where">
          <span>Where to</span>
          <input
            ref={inputRef}
            name="where"
            placeholder="City, region or hotel"
            autoComplete="off"
            value={text}
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            onChange={(event) => {
              setText(event.target.value);
              setPicked(null);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => window.setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
          />
          {showList && (
            <ul id={listId} role="listbox" className="tmh-suggest">
              {suggestions.map((place, index) => (
                <li
                  key={`${place.name}-${place.country_code}-${index}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  className={index === active ? "is-active" : ""}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    choose(place);
                  }}
                >
                  <b>{place.name}</b>
                  {place.country_code && <small>{place.country_code}</small>}
                </li>
              ))}
            </ul>
          )}
        </label>
        <DateRangeFields value={dates} onChange={setDates} />
        <GuestsField value={guests} onChange={setGuests} />
        <button type="submit" className="tmh-go">
          Search
        </button>
      </form>
      {problem && (
        <p className="tmh-note is-problem" role="alert">
          {problem}
        </p>
      )}
      {notice && !problem && (
        <p className="tmh-note" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
