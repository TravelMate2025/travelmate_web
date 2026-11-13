# Flights fake data layer

The flight UI is built before the backend (features.md, "Flights UI rebuild"). With
`VITE_FLIGHTS_API_MODE=mock` in `.env.local`, `features/flights/api` serves the data
below instead of calling `travelmate_backend`. Components don't know which one they use.
The mode is fixed at build time: a live build contains no mock code or data at all, and a
mock build loads it as a separate chunk on first use.

## What the data is

Real responses from the Amadeus Quick-Connect **test host**, recorded on 12 Nov 2026,
converted to the v2 contract in `../types.ts`. Nothing booked; search, price and upsell only.

| Fixture | Search | Offers |
|---|---|---|
| `return_los_lon` | Lagos ⇄ London, 15–28 Dec, 1 adult | 60 (6 airlines, from $787.70) |
| `oneway_los_lon` | Lagos → London, 15 Dec, 1 adult | 40 (10 airlines, from $386.10) |
| `multicity` | LOS→LON 15 Dec, LON→DXB 20 Dec, DXB→LOS 28 Dec | 20 (Emirates, from $1,299.60) |
| `family_los_dxb` | Lagos ⇄ Dubai, 2 adults, 1 child, 1 lap infant | 20 (from $2,305.20) |
| `empty_abv_phc` | Abuja → Port Harcourt | 0 (real empty result) |

- `priceCheck.json`: price check for the Royal Air Maroc offer `mock-return_los_lon-1`, with extra-bag prices and fare rule text.
- `fareOptions.json`: Eco Essential / Classic / Flex for the same offer, upgraded for the whole trip.
- `places.json`: airports and cities for autocomplete (until the backend airport table exists).

Lagos ⇄ Abuja returned no offers on the test host (known domestic coverage gap), so there's no domestic fixture.

## How the mock behaves

- **Route matching:** by city and trip type; a specific airport (LHR) narrows results. Other routes, and any cabin other than Economy, return no results.
- **Dates:** offers move to the dates you search.
- **Passengers:** the family search is used for 2 adults + 1 child + 1 lap infant to Dubai; otherwise prices are the recorded 1-adult prices whatever you pick.
- **Currency:** USD as recorded. NGN and GBP use `DEV_ONLY_RATES_FROM_USD` in `transform.ts`. These are **not TravelMate rates**; the live API prices on the server.
- **Price check details:** bags, fare rules and fare families exist only for `mock-return_los_lon-1`. Other offers price with no bags or rule text.
- **Bookings:** a hold lasts 15 minutes. After payment the booking moves from paid (4 s) to ticketing (10 s) to ticketed. PNRs and ticket numbers are random, in the real format.
- **Storage:** state lives in `sessionStorage`, so a reload mid-booking behaves like the server.

## Scenarios

Add `?mock=<name>` to any URL. It sticks for the tab until `?mock=off`.

| Name | Effect |
|---|---|
| `no-results` | Search returns nothing |
| `search-error` | Search fails as if offline |
| `price-up` / `price-down` | Price check reports a change (synthetic +5% / −3%) |
| `sold-out` | Price check and hold fail: seats gone at this price |
| `offer-expired` | Price check fails: search again |
| `hold-expired` | Payment window is 45 seconds |
| `failed-after-payment` | Paid, then the booking fails and a full refund starts |
| `slow-ticketing` | Stays on "issuing your ticket" |
| `schedule-change` | After ticketing, the last flight moves 2 hours later |

## Re-recording

The capture and conversion scripts were run from the session scratchpad, not the repo. To
refresh the data: search, price (`include=detailed-fare-rules,bags`) and upsell on the test
host with `core.amadeus_enterprise.flights`, then convert to `../types.ts`. Upsell responses
have no brand labels (only codes like `ECLASSIC`); the backend needs the same label fallback.
