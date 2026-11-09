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
- Flight search entry page.
- Departure selection, return selection, and review flow.
- Flight payment success and payment cancelled states.
- Flight confirmation flow.

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

