# AGENTS.md — travelmate_web

This file is the authoritative guide for all contributors and coding agents working on this repository. Follow it strictly. When a requested change conflicts with these rules, call out the conflict and propose a compliant alternative before proceeding.

---

## What this project is

`travelmate_web` is the React + Vite consumer web app for TravelMate. It covers discovery, booking, account management, support, and post-booking flows for stays, transfers, and flights.

The backend (`travelmate_backend`) is the only source of truth for all data. Never call a partner API or external service directly from the web app.

---

## Tech stack

| Concern | Library |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v7 |
| State | Redux Toolkit + react-redux + redux-persist |
| HTTP | Axios (with token-refresh interceptor) |
| UI components | MUI v6 + Tailwind CSS v4 |
| Google OAuth | @react-oauth/google |
| Firebase | firebase (push notifications) |
| Notifications | react-hot-toast |
| PDF | @react-pdf/renderer + jspdf + html2canvas |
| Animation | framer-motion |
| Date picking | react-date-range + MUI date pickers |
| Icons | lucide-react + react-icons + MUI icons |
| WebSocket | native WebSocket (notification provider) |

---

## Project structure

```
travelmate_web/
├── src/
│   ├── features/            # feature modules (primary home for all product code)
│   │   ├── account/         # auth, profile, settings, notifications
│   │   ├── stays/           # stay search, detail, booking, confirmation
│   │   ├── car_rentals/     # transfer search, detail, booking, confirmation
│   │   ├── flights/         # flight search and booking
│   │   ├── customer-management/ # FAQ, tickets, chat
│   │   └── shared/          # booking flow routes, labels, shared types
│   ├── pages/               # top-level route pages that compose features
│   │   └── homePage/        # home page sub-components (Navbar, WelcomePage, etc.)
│   ├── components/          # app-wide shared UI components
│   ├── routes/              # PrivateRoute and routing helpers
│   ├── store/               # Redux store setup and root reducer
│   ├── assets/              # images, SVGs, fonts
│   ├── App.tsx              # root route definitions
│   └── main.tsx             # entry point
```

Feature module layout:

```
features/<domain>/
├── api/           # Axios API call functions
├── components/    # domain-specific UI components
├── pages/         # full-page screen components
├── slice.ts       # Redux slice (state + reducers + thunks)
└── types.ts       # TypeScript types for this domain
```

---

## Architecture rules

1. **All API calls go through `features/<domain>/api/`.** No `fetch` or `axios` calls inside components or pages.
2. **State lives in Redux.** Use Redux Toolkit slices. Do not use local component state for data that needs to persist or be shared across routes.
3. **redux-persist** is active — be deliberate about what is persisted vs. cleared on logout.
4. **Pages compose components.** Pages should not contain inline business logic; delegate to components and Redux thunks.
5. **Routing is defined in `App.tsx`.** Use `bookingFlowRoutes` from `features/shared/bookingFlowRoutes.ts` for all booking-related paths — never hardcode paths in components.
6. **Lazy load all pages.** Every route-level component must use `React.lazy()` with a `<Suspense>` fallback. Only `Home`, `Login`, and `CreateAccount` may be eagerly loaded.
7. **Token refresh must be transparent.** The Axios interceptor handles 401 responses by refreshing the access token and retrying. Components never handle token refresh manually.
8. **Never navigate to `/stay-search` or any booking route directly from the home nav.** Use `/?tab=stays`, `/?tab=transfers`, etc. to stay on the home screen.

---

## Auth flows

### Registration (new user)
```
POST /api/registration_with_otp/submit_email/   → sends OTP
POST /api/registration_with_otp/verify_otp/    → verifies OTP
POST /api/registration_with_otp/resend_otp/   → resend OTP
POST /api/registration_with_otp/set_password/  → creates account + returns JWT
```

### Login (existing user)
```
POST /api/auth/jwt/validate-email/     → check email exists
POST /api/auth/jwt/validate-password/  → credentials → JWT pair
```

### Token lifecycle
```
POST /api/auth/jwt/token/refresh/   → body: { refresh: "<refresh_token>" }
POST /api/users/logout/             → blacklists refresh token
```

### Password reset
```
POST /api/users/reset_password/
POST /api/users/validate-reset-token/
POST /api/users/set_new_password/
```

### Social login
```
POST /api/auth/social/google/   → body: { access_token }
```

---

## State management rules

- Auth state (`accessToken`, `refreshToken`, `user`) lives in `authSlice` and is persisted via redux-persist.
- On logout: clear `authSlice`, clear `profileSlice`, and any booking-related slices that hold user-specific state.
- Thunks handle async operations (API calls). Reducers are pure.
- Do not put UI state (loading spinners, modal open/close) in Redux — use local `useState`.

---

## Styling rules

- Use **Tailwind CSS** for layout, spacing, and responsive design.
- Use **MUI** for complex interactive components (tabs, drawers, menus, autocomplete, date pickers).
- Do not mix MUI `sx` prop styles and Tailwind classes on the same element — pick one per component.
- Brand primary: `#023E8A` (blue). Accent: `#FF6F1E` (orange).
- All screens must be responsive: mobile-first, tested at 375px, 768px, and 1280px widths.

---

## Booking flow rules

- Booking routes are defined in `features/shared/bookingFlowRoutes.ts`. Add new routes there, not as raw strings.
- Booking flow labels (stepper text, button copy) come from `features/shared/booking/bookingFlowLabels.ts`.
- The stays booking flow is: search → results → detail → `BookingProgress` (3 steps) → confirmation.
- The transfer booking flow is: search → results → detail → review → guest details → payment → confirmation.
- Never call the partner API directly — all partner data flows through `travelmate_backend`.

---

## Code style

- TypeScript strict mode is on. No `any` unless genuinely unavoidable.
- Component files: PascalCase. Utility files: camelCase.
- Named exports preferred over default exports for components (easier refactoring).
- No inline styles. No hardcoded pixel values outside Tailwind/MUI config.
- Delete dead code and unused imports.

---

## Testing rules

- Run `npm test` or `npm run test` for the test suite.
- Smoke tests cover canonical booking flow paths — keep them passing after any route or label change.
- After updating `bookingFlowRoutes` or `bookingFlowLabels`, update or add tests for affected paths.
- Mock Axios calls in tests — do not make live API requests.

---

## Forbidden practices

- Direct `fetch` or `axios` calls inside components or pages
- Hardcoded route paths in components (use `bookingFlowRoutes`)
- Eagerly loaded route components (except Home, Login, CreateAccount)
- Business logic inside JSX render functions
- Persisting sensitive data (tokens are fine in redux-persist; never store passwords)
- Calling partner APIs or external services directly from the frontend
- `console.log` left in production-facing code paths
