# travelmate_web — Action Checklist

## Completed
- [x] Create review plan
- [x] Scan `travelmate_web` source files
- [x] Run quick static checks (lint/tsconfig)
- [x] Produce `code_reveiw.md`
- [x] Fix ESLint config & install `@typescript-eslint/parser` + plugin
- [x] Auto-fix lintable issues (`npx eslint . --fix`)
- [x] Move Google OAuth client ID to env var (`VITE_GOOGLE_CLIENT_ID`) in `src/main.tsx`
- [x] Add `.env.example`
- [x] Secure redux-persist — strip `accessToken`/`refreshToken` via `removeSensitiveTransform`
- [x] Simplify `PrivateRoute` to synchronous `<Navigate>` (no blank flash)
- [x] Enable `strict: true` in `tsconfig.app.json`
- [x] Fix ESLint config rule ordering bug (`js.recommended` before TS plugin; disable base `no-unused-vars`)
  - Down from 226 problems (201 errors) → 0 errors, 123 warnings
- [x] Fix 30 remaining lint errors:
  - Removed `no-useless-catch` wrappers in `src/features/account/api/info.ts`
  - Fixed conditional React hooks (`useState`/`useEffect` after early return) in `EnterNewEmail.tsx`, `NewEmailOtp.tsx`
  - Added comment to empty `catch {}` blocks in `DownloadPage.tsx`, `Download.tsx`
  - Wrapped `case "round-trip":` in braces in `flightApi.ts`
  - Replaced `@ts-ignore` with `@ts-expect-error` in `ClassSelector.tsx`
  - Fixed `</>` → `</React.Fragment>` parsing error in `FlightDrawer.tsx`
  - Removed constant `|| ""` from template literals in `SearchFilter.tsx`, `UpdateSearchFilter.tsx`
  - Prefixed unused catch vars with `_` across 7 files
  - Converted ternary-as-statement to `if/else` in all 4 `bookingTabs/` components and 2 car rental files
  - Removed dead expressions (`profile;` in `PersonalInfo.tsx`, dead logical chain in `AgentList.tsx`, unused comparison in `ReviewModal.tsx`)
  - Removed unused `toErrorString` in `Flight.tsx`
  - Fixed `borderBottom: 1 ? ...` constant condition in `FlightDrawer.tsx`
  - Added `caughtErrorsIgnorePattern: '^_'` to ESLint config
- [x] Fix Redux `serializableCheck` — replaced `false` with targeted `ignoredActions` for redux-persist actions
- [x] Add route-level code splitting — all 35+ route components converted to `React.lazy` + `<Suspense>` with spinner fallback in `App.tsx`
- [x] Consolidate toast libraries — removed `react-toastify` from all 10 source files, migrated to `react-hot-toast` throughout
- [x] Re-enable `React.StrictMode` in `src/main.tsx`
- [x] Remove unused `@coreui/react-pro` dependency
- [x] Clear the remaining `travelmate_web` production build blockers
- [x] Prioritize `src/features/flights/api/flightApi.ts`
- [x] Prioritize `src/features/car_rentals/services/transferService.ts`
- [x] Prioritize `src/features/customer-management/api/tickets.ts`
- [x] Prioritize `src/features/stays/pages/BookingConfirmationPage.tsx`
- [x] Prioritize `src/pages/flights/flightConfirmation/FlightConfirmationPage.tsx`
- [x] Remove the last unsafe cast in `src/features/customer-management/pages/ChatPage.tsx`
- [x] Replace `catch (err: any)` in `src/features/account/pages/ProfileInfo.tsx`
- [x] Broaden flight price summary typing so confirmation and booking flows share one shape
- [x] Tighten `src/features/customer-management/api/faqs.ts`
- [x] Tighten `src/features/flights/api/nationalityApi.ts`
- [x] Tighten `src/features/car_rentals/services/recentSearch.ts`
- [x] Replace `any` error handling in `src/features/account/pages/CreateAccount.tsx`
- [x] Replace `any` error handling in `src/features/account/pages/Login.tsx`
- [x] Fix `src/pages/flights/returnFlight/ReturnPage.tsx:214` for `getFlight` and `tripType`
- [x] Fix `src/pages/PaymentMethods.tsx:209` for `isCardFormValid` and `saveCard`
- [x] Fix `src/features/account/pages/ProfileInfo.tsx:114` for `dispatch`
- [x] Tighten `src/features/flights/api/locationApi.ts`
- [x] Tighten `src/features/flights/slices/roundTripSlices.ts`
- [x] Tighten `src/features/car_rentals/services/locationService.ts`
- [x] Tighten `src/features/customer-management/components/faq/FaqTabs.tsx`
- [x] Finish the bundle/UI cleanup pass
  - `antd` was only used for loading skeletons and one review toast, so those screens now use MUI `Skeleton` and `react-hot-toast`.
  - `index` bundle moved from `3,505.99 kB` to `3,320.34 kB`; gzip moved from `1,042.58 kB` to `989.52 kB`.
  - Removed the `INEFFECTIVE_DYNAMIC_IMPORT` warning by moving the airport-taxi booking screen behind a lazy wrapper.
- [x] Finish the TypeScript cleanup pass
  - Completed `BookingProgress.tsx`, `GuestInformation.tsx`, `ReviewModal.tsx`, `DateSelector.tsx`, `LocationSelector.tsx`, `features/account/api/auth.ts`, `UpdatePasswordContainer.tsx`, `ProfileInfoTab.tsx`, `DeleteAccountModal.tsx`, `EditContactInfoModal.tsx`, `EditBasicInfoModal.tsx`, `DeparturePage.tsx`, `ReturnPage.tsx`, `FlightDrawer.tsx`, `carPaymentSlice.ts`, `types/booking.ts`, `CarList.tsx`, `RecentSearch.tsx`, `useFormPersistence.ts`, `SortOverlay.tsx`, `DownloadPage.tsx`, `Page.tsx`, `PersonalInfo.tsx`, `Complete.tsx`, `FirstStep.tsx`, `PaymentMethod.tsx`, `Passengers.tsx`, `carPaidFor/DownloadPage.tsx`, `offerAcceptedPage/Complete.tsx`, `offerAcceptedPage/components/FirstStep.tsx`, `offerAcceptedPage/components/PaymentMethod.tsx`, `displayAllCars/CarList.tsx`, `displayAllCars/DisplayCars.tsx`, `displayAllCars/SortOverlay.tsx`, `carsFirstScreen/Page.tsx`, `hooks/useFormPersistence.ts`, `carsFirstScreen/CarBookingFirstScreen.tsx`, `pages/AirportTaxi.tsx`, and `pages/homePage/WelcomePage.tsx`.
- [x] Finish the hook dependency cleanup pass
  - `carsFirstScreen/Page.tsx` now uses a mount-time state initializer instead of a dependency suppression.
  - Cleaned `BookingConfirmationPage.tsx`, `TicketsPage.tsx`, `VerifyPage.tsx`, `VerifyEmailForPasswordReset.tsx`, `UpdatePasswordContainer.tsx`, `UpdateEmailContainer.tsx`, and `WriteAReview.tsx`.
- [x] Finish the stale eslint-disable cleanup pass
  - Removed avoidable suppressions in `EmailOtp.tsx`, `PasswordOtp.tsx`, `Download.tsx`, `BookingsDetails/stays/index.tsx`, `BookingsDetails/transfers/index.tsx`, and `customer-management/types/chat.ts`.

---

## Pending

### LOW — Lint And Accessibility
- [ ] Run Lighthouse / axe on the home, booking, and account flows and capture the main issues
- [ ] Ensure all `<img>` tags have `alt` attributes
- [ ] Ensure forms have proper `<label>` associations
- [ ] Verify keyboard focus handling in modals and dialogs

### LOW — Testing And CI
- [x] Add `vitest` as a devDependency and baseline jsdom/RTL setup
- [x] Write unit tests for critical reducers like `authSlice` and `staysSlice`
- [x] Write a smoke test for `PrivateRoute` redirect behavior
- [x] Add route smoke coverage for login, stays search, booking progress, flight, and account screens
- [x] Add a GitHub Actions workflow for `npm ci`, `npm run lint`, `npm run test`, and `npm run build`

### LOW — Developer Ergonomics
- [x] Update `README.md` with setup steps, env vars, and `npm run` commands
- [x] Add Husky and `lint-staged` for pre-commit linting

---

## Final Verification (run last)
### Completed
- [x] `npm run lint` — 0 errors ✅
- [x] `npm run test` — includes route smoke coverage for the main user flows
- [x] `npm run build` — clean build, no TS errors
- [x] `npm audit` — clean after dependency upgrades
