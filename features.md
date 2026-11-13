# TravelMate Web Features

## Overview
`travelmate_web` is the React + Vite client for the TravelMate consumer web experience. It covers discovery, booking, account management, support, and a set of post-booking detail pages for stays, flights, and car rentals.

## Core Surface Areas

### Public And Marketing
- Home landing page with branded hero sections, destination highlights, app download promotion, updates, and footer content.
- Static informational pages for `About`, `Privacy Policy`, and `Terms of Use`.
- Public navigation entry points for visitors who are not signed in.

### Authentication And Onboarding
- Account creation and login.
- Email verification flow.
- Password setup, password reset, and password recovery continuation.
- Protected routing for authenticated flows through `PrivateRoute`.

### Stays
- Stay search results.
- Stay detail pages by hotel id.
- Booking progress and booking confirmation.
- Paid booking download page.
- Stays detail experiences such as rooms, photos, amenities, policies, refund/cancellation rules, reviews, and room selection.

### Flights
Being rebuilt from scratch on Amadeus Quick-Connect. The current flight UI is deleted in phase W0; see [Flights UI rebuild](#flights-ui-rebuild-amadeus-quick-connect) below.

### Car Rentals And Airport Taxi
- Car rental search and results.
- Car offer/acceptance flow.
- Car booking confirmation.
- Payment success, payment failure, and downloadable post-booking output.
- Airport taxi entry page.

### Bookings And History
- Booking list page.
- Separate booking detail views for stays and transfers.
- Favorites page for saved items.

### Customer Support
- FAQ pages.
- Live chat page.
- Support ticket list and ticket detail pages.

### Account And Settings
- Account dashboard.
- Profile info page.
- Security page.
- Email update flow.
- Password update flow.
- Notification preferences.
- Payment methods page.
- Reviews page.
- Review detail page.

## Supporting UI And Infrastructure
- Top navigation and footer components for public browsing.
- Breadcrumb support.
- Toast notifications for app-wide feedback.
- Redux store with persistence.
- Axios configuration and token refresh helpers for API access.
- Scroll-to-top behavior for route changes.

## Notable Implementation Notes
- The app is organized by feature rather than by screen type, which makes booking and account workflows easier to follow.
- Several routes are guarded, but the homepage and discovery flows remain public.
- The codebase includes both product UI and support tooling, so the app functions as a full consumer portal rather than only a booking checkout.

---

## Flights UI rebuild (Amadeus Quick-Connect)

Started 12 Nov 2026. The flight UI is built **before** the backend, against the agreed data format and a fake data layer. The backend phases in `travelmate_backend/flights_plan.md` (F2 onwards) then replace the fake data with real calls.

### Ground rules

- **Source of truth for screens:** the approved web mock (Main, Results, Fares, Travellers, Extras, Pay, Status, Manage, MultiCity, PriceChanged, HoldExpired, BookingFailed). Seats are in the mock but are **R3** and not built here.
- **Source of truth for data:** `flights_plan.md` §C2 (offer format) and §C9 (v2 endpoints). The UI never sends prices; it sends `offerToken` and the server prices.
- **Scope:** R1 (sell and ticket) and R2 (complete service). R3 (seats, search by schedule, low-cost/NDC content) is deferred.
- **Fake data layer:** every call goes through `features/flights/api/` (AGENTS.md rule 1). A switch `VITE_FLIGHTS_API_MODE=mock|live` picks fake responses or the real backend, with **no changes in components**. Fake responses are built from real Amadeus test-host responses (12 Nov 2026), reshaped to §C2; no invented prices or flights.
- **Every fake scenario the backend can produce is reachable in mock mode:** price changed, hold expired, seats sold out, booking failed after payment, ticket being issued, ticketed, schedule change. Pick it with a dev-only query string, e.g. `?mock=price-changed`.
- **Currencies:** USD, NGN, GBP. The default comes from the user's country (NG → NGN, GB → GBP, else USD), with a switcher. Amounts are shown as the server sends them; the UI does no currency conversion.
- **Codebase rules (AGENTS.md):**
  - Routes live in `bookingFlowRoutes`, labels in `bookingFlowLabels`, and every page is lazy-loaded.
  - Redux slices with thunks; no business logic in JSX.
  - Tailwind for layout, MUI for complex inputs, brand colours `#023E8A` and `#FF6F1E`.
  - Responsive at 375, 768 and 1280 px.
- **Sensitive data:** never persist passport numbers or dates of birth with redux-persist. Persist only the search criteria and the chosen currency.
- **Each phase is done when:** `npm run build` and `npm test` pass, a Playwright spec covers the phase at 375/768/1280 in mock mode, and the screen matches the mock.

### Phases

#### W0: Remove the old flight UI and set up the foundation
Delete:
- [x] `src/features/flights/` (all of it, including the 45k-line `data.ts` airport bundle, `roundTripSlices.ts`, `flightApi.ts`, `locationApi.ts`, `nationalityApi.ts`, `components/ui/*`).
- [x] `src/pages/flights/` (departure, return, review, confirmation) and `src/pages/Flight.tsx`.
- [x] Old routes in `App.tsx` and `bookingFlowRoutes` (`flightDeparture`, `flightReturn`, `flightReview`, `flightPaymentSuccess`, `flightPaymentCancelled`) and the matching labels and tests.
- [x] `flightsApi`, `nationsApi`, `locationApi` reducers and middleware in `src/store/index.ts`; flight references in `performLogout.ts` (+ test) and `src/api/services/api.ts`.
- [x] `FlightsPersonalized.tsx` (built on the old API).

Keep, and rewire in W1: `pages/homePage/Flight.tsx`, `FlightsHomeContent.tsx`, `FlightsClassBrowse.tsx`, `FlightsPopularRoutes.tsx`, `FlightsTrustRow.tsx`, `FlightsPromoBanner.tsx`, `FlightsFAQ.tsx`.

Build:
- [x] `features/flights/types.ts`: §C2 offer, places, search criteria, price check result, booking requirements, booking (status, PNR, tickets, payment), cancellation preview, error codes.
- [x] `features/flights/api/`: one function per §C9 endpoint plus the mock/live switch.
- [x] `features/flights/mocks/`: fixtures (search LOS⇄LON return, one-way, multi-city LOS→LON→DXB→LOS, LOS⇄ABV domestic, empty result) and the scenarios listed above.
- [x] `features/flights/slice.ts`: search criteria, results, chosen offer, travellers, booking id, currency.
- [x] New routes in `bookingFlowRoutes` (results, fare, travellers, extras, review and pay, status, manage) and labels in `bookingFlowLabels`. Step count comes from config so R1 can hide Extras.
- [x] Currency preference: country default plus switcher. *(Not in the site header: the header is shared by every page, so the switcher sits in the search card and on the results and multi-city pages. Moving it into the header is still open.)*

Exit: the app builds with no old flight code, and the home Flights tab renders its kept sections.

**Done 12 Nov 2026** (branch `feature/flights-ui-rebuild`):
- 44 old files removed.
- The contract is in `features/flights/types.ts`; the fake data and scenarios are described in `features/flights/mocks/README.md`.
- 161 unit tests and `e2e/flights-home.spec.ts` pass at 375/768/1280.
- Until W1 the home search slot shows "Flight search is being rebuilt", and Popular routes cards scroll to the top instead of searching.


#### W1: Flights page and search (R1)
Changed during W1 (user decision): flights got its own page at `/flights`, styled like `/hotels`, instead of a tab on the home page. The top nav links to it; the home tab bar now has only Stays and Transfers.

- [x] `/flights` page following the approved web mock: photo hero ("Find your next flight"), search card, travellers panel, recent searches, three promises.
- [x] Trip type: return, one-way, multi-city (2 to 6 flights, add and remove).
- [x] Airport and city autocomplete from `places` (replaces `data.ts`), with recent searches and "Search again".
- [x] Separate Depart and Return dates, each with ± 0–3 flexible days. No past dates; return not before departure; multi-city in date order.
- [x] Travellers and cabin panel: adults, children 2–11, infants on lap (at most one per adult), infants in own seat, 9 seated travellers maximum. Cabins: Economy, Premium Economy, Business, First.
- [x] Direct flights only and Include nearby airports.
- [x] Sections:
  - Browse by class sets the cabin and shows real "from" fares (`class-fares` API).
  - Popular routes per country come from the API, with "Change country".
  - Why book your flight with us, the promo card (from the `campaign` API; hidden when there's none) and the FAQ, all with the mock's copy.
- [x] Search criteria in the URL (results can be shared and reloaded); old `/?tab=flights` links redirect to `/flights`.

**Done 12 Nov 2026.**
- Results page shows the search summary and states only (searching, error, no results, count); W2 builds the flight list.
- New API endpoints for the backend: `popular-routes`, `class-fares`, `campaign`. New search fields: `flexibleDays` per leg, `includeNearbyAirports`.
- Open: the "support hours" promise (left out of Why book until confirmed).

#### W2: Results (R1)
Built from the approved mock's Results and MultiCity screens; sizes checked against its CSS.

- [x] Search summary pill ("Edit search") with currency; changing currency searches again in that currency.
- [x] Booking steps (from config; R1 shows Flight, Fare, Travellers, Pay).
- [x] Sort tabs: Best, Cheapest, Fastest, each with its top price and total travel time. Best balances price and time.
- [x] Filters (side panel on desktop, "Filters" button on phones):
  - Stops and Airlines, each with "from" prices.
  - What's included: 2 checked bags, free changes, refundable.
  - Outbound departure time.
  - Same airport both ways (for city searches like London).
  - Reset.
- [x] Offer card:
  - Airline and fare brand.
  - One line per direction (times, +1 day, duration, stops and stop length).
  - Bags.
  - Notes: different airports, overnight / long stops, airport changes, fastest, ticketing deadline within 21 days.
  - Price per adult (plus a total line for several travellers), seats left.
  - See fares, Flight details.
- [x] Flight details: each flight (number, airline, aircraft, duration, cabin, operated by) and each stop (length, overnight, airport change).
- [x] Multi-city results under the form: "N options for your N flights", numbered lines, whole-trip price, Select.
- [x] Loading skeletons, search error with retry, no results, no matches for filters; 10 at a time with "Show more".

**Done 13 Nov 2026.** Shows every offer, not one per airline as the mock's sample did. On the recorded data the fastest trip is Royal Air Maroc at $965.70 (19h 10m), not the mock's RwandAir example. "See fares" / "Select" go to the Fare step (W3).

#### W3: Fare and price check (R1), with fare families (W8)
Built from the approved mock's Fares and PriceChanged screens; sizes checked against its CSS. The mock shows the fare families on this screen, so W8 was built here too.

- [x] Calls `price` when the screen opens and shows a "price confirmed with the airline" banner; prices again when another fare is picked.
- [x] Selected flight card (airline, aircraft, each direction, flight details), steps with "1 Flight ✓" back to results, currency.
- [x] Fare cards: Included / For a fee / Free / No rows from the airline's amenities (fare conditions as fallback), tagline, price difference, "Best value for bags". The chosen fare alone when the airline has no families.
- [x] Bottom bar: selected fare and total, "Continue to traveller details", full fare rules (plain summary, then the airline's text).
- [x] Price changed (up) dialog: price you saw vs new price, continue or see other flights. If the price goes down, the banner says so and booking continues at the lower price.
- [x] Offer no longer available (sold out) or expired: explained, with "See other flights" / "Search again".

**Done 13 Nov 2026.** Fare families are priced for the whole trip ($787.70 / $840.20 / $945.20 on the recorded data), not the mock's outbound-only upgrade prices.

#### W4: Traveller details (R1)
Built from the approved mock's Travelers screen; sizes checked against its CSS.

- [x] One card per traveller, built from the airline's requirements returned by the price check (gender, date of birth, passport only when asked; ages always for children and infants). No hardcoded per-airline rules.
- [x] Names as on passport: plain letters, up to 20 characters each (Amadeus error 477). The lap infant is linked to an adult (one lap each); adult + infant names up to 41 characters together, with the guide's shortened version offered for approval.
- [x] Ages checked against the trip: adults 12+, children 2–11 at the start, infants under 2 for the whole trip. Passport, when given, must be valid after the last flight.
- [x] Contact email and mobile with country code (kept as a country, so shared codes like +1 stay as picked).
- [x] "Use my profile details" for the signed-in user; passport and frequent flyer are optional unless the airline requires them.
- [x] Sign-in required: the step is behind `PrivateRoute`, so sign-in happens before anything is typed; after sign-in the price is checked again. Traveller details stay in Redux only (not persisted).
- [x] Trip summary with the real fare and taxes from the price check.

**Done 13 Nov 2026.** "Continue to payment" goes to Review and pay (W5). The country list for phone codes and passports covers 37 countries until the backend's country table exists.

#### W5: Review and pay (R1)
Built from the approved mock's Pay, HoldExpired and BookingFailed (before payment) screens; sizes checked against its CSS.

- [x] Holds the seats on arrival (create booking): orange timer bar with the countdown to the payment deadline; Flights (with the different-airports "Heads up"), Travellers, Fare conditions (plain summary + full rules) and Price summary with the reservation (PNR).
- [x] Pay in USD, NGN or GBP with amounts from the server (`payable` on the booking, fixed at hold).
- [x] Consent checkbox; the Pay button is enabled only when it is ticked.
- [x] Flutterwave checkout via `checkout`, and the return page: success goes to the booking status (W6); cancelled or failed explains and offers "Back to payment" while the seats are held.
- [x] Hold expired screen ("Your seats were released", check this flight again / see other flights); seats sold out while holding; price changed at hold (dialog; "See other flights" releases the seats).
- [x] A reload during payment resumes the same held booking (only the booking id is stored, never traveller details), so the seats are never held twice. React's development double-run can't create two holds either.

**Done 13 Nov 2026.** Contract additions for the backend: `FlightBooking.payable` (per-currency flights / bags / total) and `FlightBooking.priceChange`.

#### W6: Booking status and confirmation (R1)
Done 13 Nov 2026, as the mock's Status and BookingFailed (after payment) screens show them. Page: `FlightBookingStatusPage` at `bookingFlowRoutes.flightBookingStatus` (signed in).
- [x] Status timeline: payment received → booked with airline → issuing ticket → ticket issued and sent.
- [x] Polls the booking every 5 s until ticketed or failed; safe to leave and return (only the booking id is kept, so a reload resumes it).
- [x] References: TravelMate booking reference, airline PNR, e-ticket numbers when issued.
- [x] Booking failed after payment: automatic full refund with its progress. Uses the mock's refund timeline, not `shared/refundTracking` (whose panel looks different from the mock); the refund data comes from the booking's `refund`.
- [x] Add to calendar (.ics download), Manage booking. "Online check-in" left out until there is a check-in link.

Exit: the issuing, ticketed and failed-after-payment scenarios render.

#### W7: My bookings and manage (R1)
Done 13 Nov 2026, as the mock's Manage screen shows it. Page: `FlightManageBookingPage` at `bookingFlowRoutes.flightBookingManage` (signed in).
- [x] Flights in the bookings list with status badges. v2 flights load from `flights/api` next to stays and transfers (one failing doesn't hide the other) and open Manage; the old v1 flight rows and their dead `/bookings/flight-details` link are gone. Paid-then-not-booked goes under Cancelled (it's a refund, not a payment failure); seats released under Payment failed.
- [x] Manage page: itinerary, references, tickets, download itinerary PDF (jsPDF, loaded on click), contact support, and the fare panel. **Airline check-in link left out:** the booking has no check-in URL yet (needs one in the contract, or a per-airline list). Bag weights show only when the airline gives them (the recorded fare gives "1 bag").
- [x] Cancel before ticketing: full refund preview, reason, confirm, then refund tracking. Opens from "Cancel booking" on Manage, or from Cancel on My bookings (`?cancel=1`); "Keep my booking" closes it. Unpaid holds go to Review and pay instead.

Exit: **R1 UI complete.** The whole journey works in mock mode and is ready for backend F2–F6.

#### W8: Fare families (R2)
Done with W3 (13 Nov 2026), as the mock's Fares screen shows them.
- [x] Fare screen shows the airline's fare options from `upsell` (e.g. Eco Essential, Classic, Flex), with what is included, the price difference, and the selection carried into the booking.

#### W9: Paid extra bags (R2)
Done 13 Nov 2026, as the mock's Extras screen shows it (its "Seat selection" card is R3 and left out). Page: `FlightExtrasPage` at `bookingFlowRoutes.flightExtras` (signed in).
- [x] Extras step (turned on by config): bag options per direction from the price check with bags, running total, and bags shown on review, status and manage. Switch: `VITE_FLIGHTS_EXTRAS=on` (on in `.env.local` and Playwright). The step and its stepper pill only appear when the airline sells bags for the chosen offer; otherwise Travellers goes straight to payment. Real Royal Air Maroc prices: +1 bag $210.00 / +2 $530.00 outbound, $235.20 / $593.60 return. Weights show only when the airline gives them.

#### W10: Cancellation after ticketing (R2)
- [ ] Manage → cancel when ticketed: refund estimate from `cancellation-preview` (non-refundable fare vs refundable taxes), request, then status until the airline confirms and the refund completes.
- [ ] Void within the airline's void window, shown as a full refund when available.

#### W11: Schedule change alerts (R2)
- [ ] Alert on the booking list and manage page when the airline changes a flight: what changed, and contact or alternative options.
- [ ] Notification through the existing notification provider.

Exit: **R2 UI complete.**

#### Later (R3, not planned yet)
- Seat choice (Seats screen in the mock); needs the consolidator to confirm seat EMDs.
- Search by schedule (Availabilities).
- Low-cost/NDC content.

