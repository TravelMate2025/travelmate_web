## 1. Architecture

### Required Pattern

Use a feature-based React structure with shared booking flow helpers for stays and transfers.

- Keep feature modules isolated where practical.
- Shared booking flow labels, routes, and mock data should live in a reusable shared layer.
- Preserve the current UI as fallback while the partner-aligned flow is built.

## 2. Flow Rules

- Follow the partner API language for stays and transfers: `search`, `detail`, `pricing`, `quote`, `hold`, `payment`, `confirmation`, and `management`.
- Keep legacy routes available until the replacement flow is fully verified.
- Use route aliases and shared labels instead of duplicating flow copy across pages.
- Prefer mock partner payloads and documented API shapes when implementing or testing flow changes.

## 3. UI Rules

- Keep the existing UI visible until the new flow is complete.
- Use the shared booking flow labels for stepper text, titles, and confirmations.
- Keep payment wording provider-neutral and redirect-based.
- Ensure stay-type language distinguishes `unit_level` from `room_level`.

## 4. Performance Rules

- Prefer lazy loading for routes and heavy screens.
- Keep bundle size in mind when adding dependencies or shared utilities.
- Avoid unnecessary re-renders by using memoization only where it helps.
- Prefer shared components over duplicating large UI blocks.
- Keep expensive calculations out of render paths.

## 5. Accessibility Rules

- Use semantic HTML first.
- Ensure interactive elements are keyboard reachable and have clear focus states.
- Keep form labels, alt text, and button text explicit.
- Preserve sufficient contrast for booking actions and status text.

## 6. Verification

- Run tests after updating flow labels, routes, or booking screens.
- Verify both canonical and legacy routes still resolve while the transition is in progress.
- Keep smoke tests aligned to the canonical booking flow paths.
- When changing shared flow helpers, update or add coverage for the affected labels and routes.
