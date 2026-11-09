import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TicketsPage from "./TicketsPage";

const { mockGetTickets, mockDeleteTicket } = vi.hoisted(() => ({
  mockGetTickets: vi.fn(),
  mockDeleteTicket: vi.fn(),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) =>
    selector({
      auth: {
        accessToken: "test-token",
      },
    }),
}));

vi.mock("../api/tickets", async () => {
  const actual = await vi.importActual<typeof import("../api/tickets")>(
    "../api/tickets"
  );
  return {
    ...actual,
    getTickets: mockGetTickets,
    deleteTicket: mockDeleteTicket,
  };
});

vi.mock("../../../pages/homePage/Navbar", () => ({
  default: () => <div>navbar</div>,
}));

vi.mock("../../../components/2Footer", () => ({
  default: () => <div>footer</div>,
}));

vi.mock("../../../components/Breadcrumbs", () => ({
  default: () => <div>breadcrumbs</div>,
}));

describe("TicketsPage", () => {
  afterEach(() => {
    mockGetTickets.mockReset();
    mockDeleteTicket.mockReset();
  });

  it(
    "only shows the delete menu for resolved tickets — any ticket used to be " +
      "deletable regardless of status",
    async () => {
      mockGetTickets.mockResolvedValue({
        results: [
          {
            id: 1,
            ticket_id: "TKT2026-001",
            title: "Resolved ticket",
            category: "Account",
            status: "resolved",
            created_at: "2026-07-01T10:00:00Z",
            description: "This one is resolved",
          },
          {
            id: 2,
            ticket_id: "TKT2026-002",
            title: "Pending ticket",
            category: "Account",
            status: "in_progress",
            created_at: "2026-07-02T10:00:00Z",
            description: "This one is still open",
          },
        ],
      });

      render(
        <MemoryRouter>
          <TicketsPage />
        </MemoryRouter>
      );

      await waitFor(() => expect(mockGetTickets).toHaveBeenCalledTimes(1));

      const resolvedCard = (
        await screen.findByText("Resolved ticket")
      ).closest("div.rounded-lg") as HTMLElement;
      const pendingCard = screen
        .getByText("Pending ticket")
        .closest("div.rounded-lg") as HTMLElement;

      // The "⋮" menu's only action is Delete, so hiding the whole menu for
      // a non-resolved ticket is equivalent to hiding the delete option.
      expect(within(resolvedCard).queryAllByRole("button")).toHaveLength(1);
      expect(within(pendingCard).queryAllByRole("button")).toHaveLength(0);
    }
  );
});
