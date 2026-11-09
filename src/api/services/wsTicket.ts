import api from "./api";

const WS_BASE_URL = (import.meta.env.VITE_WS_BASE_URL || "ws://127.0.0.1:8000/ws").replace(/\/$/, "");

// Browsers can't send an Authorization header on a WebSocket handshake. Rather
// than putting the access token in the URL (where proxies and servers log it),
// fetch a single-use ticket that expires within seconds and connect with that.
export const getTicketedWsUrl = async (path: string): Promise<string> => {
  const res = await api.post<{ ticket: string }>("/auth/ws-ticket/");
  return `${WS_BASE_URL}${path}?ticket=${encodeURIComponent(res.data.ticket)}`;
};
