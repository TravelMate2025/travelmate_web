import { expect, test } from "@playwright/test";

// Phase W0 (features.md): the old flight UI is gone, the home Flights tab still
// shows the sections we kept, and the old /flights page lands on that tab.
const widths = [375, 768, 1280];

for (const width of widths) {
  test(`home Flights tab keeps its sections at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?tab=flights");

    await expect(page.getByText("Flight search is being rebuilt").first()).toBeVisible();
    for (const heading of ["Browse by class", "Popular routes", "Why book your flight with us", "Frequently asked questions"]) {
      await expect(page.getByText(heading, { exact: true }).first()).toBeAttached();
    }
    await expect(page.getByText("Illustrative — not a live offer").first()).toBeAttached();
  });
}

test("old /flights page opens the home Flights tab", async ({ page }) => {
  await page.goto("/flights");
  await expect(page).toHaveURL(/\/\?tab=flights$/);
  await expect(page.getByText("Flight search is being rebuilt").first()).toBeVisible();
});
