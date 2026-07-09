# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stays-flow.spec.ts >> web stays flow renders results and detail from live-shaped responses
- Location: e2e/stays-flow.spec.ts:84:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Show stay results' })
    - locator resolved to <button disabled tabindex="-1" type="submit" class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary Mui-disabled MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary css-1xwf61x-MuiButtonBase-root-MuiButton-root">Show Stay results</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    113 × waiting for element to be visible, enabled and stable
        - element is not enabled
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - paragraph [ref=e7]: Stay search
    - heading "Find a destination" [level=1] [ref=e8]
    - paragraph [ref=e9]: Search by destination first, then we resolve the partner location behind the scenes.
  - generic [ref=e10]:
    - generic [ref=e13]:
      - generic [ref=e14]: Destination
      - generic [ref=e15]:
        - combobox "Destination" [active] [ref=e16]: Lekki, Lagos, Nigeria
        - generic [ref=e17]:
          - button "Clear" [ref=e18] [cursor=pointer]:
            - img [ref=e19]
          - button "Open" [ref=e21] [cursor=pointer]:
            - img [ref=e22]
        - group:
          - generic: Destination
    - generic [ref=e24]:
      - generic [ref=e25]: Stay type
      - combobox "Stay type" [ref=e26]:
        - option "Any stay type" [selected]
        - option "Unit stay"
        - option "Room stay"
    - generic [ref=e27]:
      - generic [ref=e28]: Dates
      - generic [ref=e31]:
        - img [ref=e33] [cursor=pointer]
        - textbox "Select Date" [ref=e35] [cursor=pointer]
        - group
    - generic [ref=e36]:
      - generic [ref=e37]: Guests(adults / children / rooms)
      - generic [ref=e38]:
        - spinbutton "Adults" [ref=e39]: "2"
        - spinbutton "Children" [ref=e40]: "0"
        - spinbutton "Rooms" [ref=e41]: "1"
    - generic [ref=e42]:
      - button "Show Stay results" [disabled]
```

# Test source

```ts
  18  |   results: [
  19  |     {
  20  |       id: "tm-lagos-001",
  21  |       name: "Marina Residences",
  22  |       propertyType: "apartment",
  23  |       saleMode: "unit_level",
  24  |       country: "Nigeria",
  25  |       adminLevel1: "Lagos",
  26  |       city: "Lekki",
  27  |       address: "12 Marina Road, Lagos",
  28  |       description: "A private serviced apartment with two bedrooms and a city view.",
  29  |       priceFrom: 120000,
  30  |       ratingScore: 88,
  31  |       rooms: [
  32  |         {
  33  |           id: "tm-lagos-001-r1",
  34  |           name: "Entire apartment",
  35  |           occupancy: 4,
  36  |           baseRate: 120000,
  37  |           isBookable: true,
  38  |         },
  39  |       ],
  40  |       images: [
  41  |         { secureUrl: "https://images.travelmate.local/lagos-suite-1.jpg" },
  42  |       ],
  43  |       amenities: ["wifi", "kitchen", "parking"],
  44  |       destination: { code: "lekki", name: "Lekki" },
  45  |       available: true,
  46  |     },
  47  |   ],
  48  | };
  49  | 
  50  | const pricingResponse = {
  51  |   data: {
  52  |     currency: "NGN",
  53  |     baseRate: 120000,
  54  |     weekdayRate: 110000,
  55  |     weekendRate: 135000,
  56  |     cancellationOptions: [
  57  |       {
  58  |         optionId: "FREE_CANCELLATION",
  59  |         label: "Free cancellation",
  60  |         amount: 135000,
  61  |         currency: "NGN",
  62  |         cancelDeadlineHoursBeforeCheckIn: 24,
  63  |         policyCopy: "Free cancellation up to 24 hours before check-in.",
  64  |       },
  65  |     ],
  66  |     roomCancellationOptions: [],
  67  |     ratePlans: [],
  68  |     priceBreakdown: {
  69  |       currency: "NGN",
  70  |       base: { amount: 120000 },
  71  |       taxes: { amount: 0, inclusive: true },
  72  |       fees: { amount: 0, inclusive: true },
  73  |       total: { amount: 120000 },
  74  |       rateBands: {
  75  |         weekday: { amount: 110000 },
  76  |         weekend: { amount: 135000 },
  77  |       },
  78  |       previewOptionId: "FREE_CANCELLATION",
  79  |       notes: "Test fixture",
  80  |     },
  81  |   },
  82  | };
  83  | 
  84  | test("web stays flow renders results and detail from live-shaped responses", async ({
  85  |   page,
  86  | }) => {
  87  |   await page.route("**/api/v1/public/locations?kind=stays", async (route) => {
  88  |     await route.fulfill({
  89  |       status: 200,
  90  |       contentType: "application/json",
  91  |       body: JSON.stringify(stayLocationResponse),
  92  |     });
  93  |   });
  94  | 
  95  |   await page.route("**/api/v1/public/catalog/stays**", async (route) => {
  96  |     const url = new URL(route.request().url());
  97  |     if (url.pathname.endsWith("/pricing")) {
  98  |       await route.fulfill({
  99  |         status: 200,
  100 |         contentType: "application/json",
  101 |         body: JSON.stringify(pricingResponse),
  102 |       });
  103 |       return;
  104 |     }
  105 | 
  106 |     await route.fulfill({
  107 |       status: 200,
  108 |       contentType: "application/json",
  109 |       body: JSON.stringify(staySearchResponse),
  110 |     });
  111 |   });
  112 | 
  113 |   await page.goto("/stay-search?flow=partner");
  114 | 
  115 |   const destination = page.getByLabel("Destination");
  116 |   await destination.fill("Lekki");
  117 |   await page.getByRole("option", { name: "Lekki, Lagos, Nigeria" }).click();
> 118 |   await page.getByRole("button", { name: "Show stay results" }).click();
      |                                                                 ^ Error: locator.click: Test timeout of 60000ms exceeded.
  119 | 
  120 |   await expect(page).toHaveURL(/stay-results/);
  121 |   await expect(page.getByText("Marina Residences")).toBeVisible();
  122 |   await expect(page.getByText("NGN 120,000")).toBeVisible();
  123 | 
  124 |   await page.getByText("Marina Residences").click();
  125 | 
  126 |   await expect(page).toHaveURL(/stays-detail\/tm-lagos-001/);
  127 |   await expect(page.getByRole("heading", { name: "Stay details" })).toBeVisible();
  128 |   await expect(page.getByText("NGN 120,000")).toBeVisible();
  129 |   await expect(page.getByText("Weekday: NGN 110,000")).toBeVisible();
  130 |   await expect(page.getByText("Weekend: NGN 135,000")).toBeVisible();
  131 | });
  132 | 
```