import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ChatPage from "./ChatPage";

// jsdom doesn't implement scrollIntoView; ChatMessages calls it in a
// useEffect whenever activeChat changes.
Element.prototype.scrollIntoView = vi.fn();

const { mockFetchUserChats, mockFetchChat, mockOnMessageHandlers } = vi.hoisted(() => ({
  mockFetchUserChats: vi.fn(),
  mockFetchChat: vi.fn(),
  // Captures the callback ChatPage registers via `ws.onMessage(cb)`, so the
  // test can simulate an incoming WebSocket frame by just calling it.
  mockOnMessageHandlers: [] as Array<(data: unknown) => void>,
}));

// Hoisted and module-level so the same object reference is returned on
// every call — ChatPage's `initializeWebSocket` is a `useCallback` keyed on
// `[accessToken, user]`, so a fresh object each render would recreate it
// every render, re-firing the effect that depends on it in an infinite loop.
const mockAuthState = {
  auth: {
    user: { id: 1, email: "customer@example.com" },
    accessToken: "test-token",
  },
};

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector(mockAuthState),
}));

vi.mock("../api/chat", async () => {
  const actual = await vi.importActual<typeof import("../api/chat")>("../api/chat");
  return {
    ...actual,
    fetchUserChats: mockFetchUserChats,
    fetchChat: mockFetchChat,
  };
});

vi.mock("../utils/websocket", () => ({
  ChatWebSocket: class {
    sessionId: number;
    constructor(sessionId: number) {
      this.sessionId = sessionId;
    }
    onMessage(cb: (data: unknown) => void) {
      mockOnMessageHandlers.push(cb);
    }
    onOpen() {}
    onClose() {}
    connect() {}
    close() {}
  },
}));

vi.mock("../../../pages/homePage/Navbar", () => ({ default: () => <div>navbar</div> }));
vi.mock("../../../components/Breadcrumbs", () => ({ default: () => <div>breadcrumbs</div> }));
vi.mock("../components/chat/AgentList", () => ({ default: () => <div>agent-list</div> }));
vi.mock("../components/chat/ChatInput", () => ({ default: () => <div>chat-input</div> }));
vi.mock("../components/ChatHistory", () => ({ default: () => <div>chat-history</div> }));

describe("ChatPage live admin-joined indicator", () => {
  afterEach(() => {
    mockFetchUserChats.mockReset();
    mockFetchChat.mockReset();
    mockOnMessageHandlers.length = 0;
  });

  const renderChatPage = async () => {
    mockFetchUserChats.mockResolvedValue([{ id: 7 }]);
    mockFetchChat.mockResolvedValue({
      id: 7,
      status: "ACTIVE",
      messages: [],
      // No assigned_admin_info — this chat was unclaimed when opened.
      assigned_admin_info: undefined,
      claim_history: [],
    });

    render(
      <MemoryRouter>
        <ChatPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockFetchChat).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockOnMessageHandlers.length).toBe(1));
  };

  it(
    "shows a banner when a live session_update carries an assigned_admin for a " +
      "chat that was unclaimed when opened",
    async () => {
      await renderChatPage();

      mockOnMessageHandlers[0](
        JSON.stringify({
          type: "session_update",
          status: "ACTIVE",
          assigned_admin: { id: 9, first_name: "Jordan", last_name: "Lee" },
        })
      );

      expect(
        await screen.findByText("Jordan has joined this chat.")
      ).toBeInTheDocument();
    }
  );

  it(
    "a non-chat_message event (e.g. session_info) does not silently block a " +
      "real message that happens to share its fallback id",
    async () => {
      // Before the fix, any non-chat_message payload (session_info,
      // session_update, notification, pong — none of which carry an `id`)
      // fell through to normalizeMessage and was pushed into the message
      // list as a phantom entry with `id: 0` (its fallback). A *real*
      // message legitimately using id 0 would then be deduped against that
      // phantom via the `exists = messages.some(m => m.id === id)` check
      // and silently dropped — never rendered. This reproduces exactly
      // that collision.
      await renderChatPage();

      mockOnMessageHandlers[0](
        JSON.stringify({ type: "session_info", session: { id: 7 } })
      );
      mockOnMessageHandlers[0](
        JSON.stringify({
          type: "chat_message",
          id: 0,
          content: "Hello from support",
          sender_id: 9,
          created_at: new Date().toISOString(),
        })
      );

      expect(
        await screen.findByText("Hello from support")
      ).toBeInTheDocument();
    }
  );
});
