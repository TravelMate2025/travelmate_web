import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import api from "../../../api/services/api";
import { ChatWebSocket } from "./websocket";

vi.mock("../../../api/services/api", () => ({ default: { post: vi.fn() } }));

const openedUrls: string[] = [];

class FakeWebSocket {
  static OPEN = 1;
  readyState = 0;
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  constructor(url: string) {
    openedUrls.push(url);
  }
  close() {}
  send() {}
}

describe("ChatWebSocket", () => {
  beforeEach(() => {
    openedUrls.length = 0;
    vi.stubGlobal("WebSocket", FakeWebSocket);
    vi.mocked(api.post).mockResolvedValue({ data: { ticket: "t-123" } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("connects with a single-use ticket instead of the access token", async () => {
    await new ChatWebSocket(42).connect();

    expect(api.post).toHaveBeenCalledWith("/auth/ws-ticket/");
    expect(openedUrls).toHaveLength(1);
    expect(openedUrls[0]).toMatch(/\/chat\/42\/\?ticket=t-123$/);
  });

  it("doesn't open a socket if closed while the ticket was being fetched", async () => {
    const ws = new ChatWebSocket(42);
    const connecting = ws.connect();
    ws.close();
    await connecting;

    expect(openedUrls).toHaveLength(0);
  });

  it("reports a failed ticket request as a close", async () => {
    vi.mocked(api.post).mockRejectedValue(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const onClose = vi.fn();
    const ws = new ChatWebSocket(42);
    ws.onClose(onClose);

    await ws.connect();

    expect(onClose).toHaveBeenCalled();
    expect(openedUrls).toHaveLength(0);
  });
});
