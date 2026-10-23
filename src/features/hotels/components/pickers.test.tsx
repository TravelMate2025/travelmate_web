import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DateRangeFields, type StayDates } from "./DateRangeFields";
import { GuestsField } from "./GuestsField";
import { summariseGuests, type GuestCounts } from "../guests";

function DatesHarness() {
  const [dates, setDates] = useState<StayDates>({ checkIn: null, checkOut: null });
  return (
    <div>
      <DateRangeFields value={dates} onChange={setDates} />
      <output data-testid="nights">
        {dates.checkIn && dates.checkOut
          ? Math.round((dates.checkOut.getTime() - dates.checkIn.getTime()) / 86_400_000)
          : "none"}
      </output>
    </div>
  );
}

function GuestsHarness() {
  const [guests, setGuests] = useState<GuestCounts>({ adults: 2, rooms: 1, childAges: [] });
  return <GuestsField value={guests} onChange={setGuests} />;
}

// react-date-range reacts to mouse down + up on a day, not to a plain click
const pressDay = (day: HTMLElement) => {
  fireEvent.mouseDown(day);
  fireEvent.mouseUp(day);
};

const pickableDays = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".rdrDay:not(.rdrDayDisabled):not(.rdrDayPassive)"));

afterEach(cleanup);

describe("hotels page pickers", () => {
  it("opens one calendar from either date field and picks check-in then check-out", () => {
    render(<DatesHarness />);
    expect(screen.getAllByText("Add date")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /check out/i }));
    expect(screen.getByText("Pick your check-in day")).toBeTruthy();

    const days = pickableDays();
    expect(days.length).toBeGreaterThan(3);
    pressDay(days[0]);
    expect(screen.getByText("Now pick your check-out day")).toBeTruthy();
    expect(screen.getByTestId("nights").textContent).toBe("none");

    pressDay(pickableDays()[3]);
    expect(screen.getByTestId("nights").textContent).toBe("3");
    expect(screen.getByText("3 nights")).toBeTruthy();
    expect(screen.queryAllByText("Add date")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getAllByText("Add date")).toHaveLength(2);
  });

  it("changes adults, children and rooms within sensible limits", () => {
    render(<GuestsHarness />);
    expect(screen.getByText("2 adults, 1 room")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /guests/i }));
    fireEvent.click(screen.getByRole("button", { name: "More children" }));
    fireEvent.click(screen.getByRole("button", { name: "More rooms" }));
    fireEvent.click(screen.getByRole("button", { name: "Fewer adults" }));
    expect(screen.getAllByText("1 adult, 1 child, 2 rooms").length).toBeGreaterThan(0);

    // each child has an age, starting at 8, which the guest can change
    const age = screen.getByLabelText("Child 1 age") as HTMLSelectElement;
    expect(age.value).toBe("8");
    fireEvent.change(age, { target: { value: "3" } });
    expect((screen.getByLabelText("Child 1 age") as HTMLSelectElement).value).toBe("3");
    fireEvent.click(screen.getByRole("button", { name: "More children" }));
    expect(screen.getAllByLabelText(/Child \d age/)).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Fewer children" }));
    expect(screen.getAllByLabelText(/Child \d age/)).toHaveLength(1);

    // adults and rooms cannot go below 1
    const fewerAdults = screen.getByRole("button", { name: "Fewer adults" }) as HTMLButtonElement;
    expect(fewerAdults.disabled).toBe(true);
    const fewerChildren = screen.getByRole("button", { name: "Fewer children" }) as HTMLButtonElement;
    fireEvent.click(fewerChildren);
    expect(fewerChildren.disabled).toBe(true);
  });

  it("summarises guests", () => {
    expect(summariseGuests({ adults: 1, rooms: 1, childAges: [] })).toBe("1 adult, 1 room");
    expect(summariseGuests({ adults: 3, rooms: 2, childAges: [4, 9] })).toBe("3 adults, 2 children, 2 rooms");
  });
});
