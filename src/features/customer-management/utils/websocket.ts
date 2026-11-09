import { getTicketedWsUrl } from "../../../api/services/wsTicket";

// Type is used for callback signatures; allow unused parameter name in type.
type MessageCallback = (data: unknown) => void;

export class ChatWebSocket {
    private socket: WebSocket | null = null;
    public sessionId: number;
    private closed = false;

    private onMessageCallback: MessageCallback | null = null;
    private onOpenCallback: (() => void) | null = null;
    private onCloseCallback: (() => void) | null = null;

    constructor(sessionId: number) {
      this.sessionId = sessionId;
    }

    async connect() {
      let wsUrl: string;
      try {
        wsUrl = await getTicketedWsUrl(`/chat/${this.sessionId}/`);
      } catch (error) {
        console.error(`Couldn't get a WebSocket ticket for chat ${this.sessionId}`, error);
        if (this.onCloseCallback) this.onCloseCallback();
        return;
      }
      // close() was called (e.g. the user switched chats) while the ticket was in flight
      if (this.closed) return;

      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => {
        if (this.onOpenCallback) this.onOpenCallback();
      };
  
      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const raw = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
          const data = JSON.parse(raw);
          if (this.onMessageCallback) this.onMessageCallback(data);
        } catch (e) {
          console.warn("Failed to parse WebSocket message", e);
        }
      };
  
      this.socket.onclose = (event) => {
        console.warn(`WebSocket closed ❌ for chat ${this.sessionId}`);
        console.warn("Close code:", event.code, "Reason:", event.reason);
        if (this.onCloseCallback) this.onCloseCallback();
      };
  
      this.socket.onerror = (event) => {
        console.error(`WebSocket error ❌ for chat ${this.sessionId}`, event);
      };
    }
  
    sendMessage(message: string, file?: File): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          return reject(new Error("WebSocket not open"));
        }

        const payload: Record<string, unknown> = { message };

        if (file) {
          const reader = new FileReader();

          reader.onload = () => {
            payload.attachment = reader.result as string | ArrayBuffer | null;
            this.socket!.send(JSON.stringify(payload));
            resolve();
          };

          reader.onerror = () => {
            console.error("❌ FileReader failed");
            reject(new Error("File reading failed"));
          };

          reader.readAsDataURL(file);
        } else {
          this.socket.send(JSON.stringify(payload));
          resolve();
        }
    });
  }

  
    onMessage(callback: MessageCallback) {
      this.onMessageCallback = callback;
    }
  
    onOpen(callback: () => void) {
      this.onOpenCallback = callback;
    }
  
    onClose(callback: () => void) {
      this.onCloseCallback = callback;
    }
  
    close() {
      this.closed = true;
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  
