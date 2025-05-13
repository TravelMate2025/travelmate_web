// src/utils/websocket.ts
export class ChatWebSocket {
    private socket: WebSocket | null = null;
    public sessionId: number;
    private token: string;
  
    private onMessageCallback: ((message: any) => void) | null = null;
    private onOpenCallback: (() => void) | null = null;
    private onCloseCallback: (() => void) | null = null;
  
    constructor(sessionId: number, token: string) {
      this.sessionId = sessionId;
      this.token = token;
    }
  
    connect() {
      const wsUrl = `wss://travelmate-backend-0suw.onrender.com/ws/chat/${this.sessionId}/?token=${this.token}`;
      console.log(`Connecting to WebSocket: ${wsUrl}`);
  
      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => {
        console.log(`WebSocket connected ✅ to chat ${this.sessionId}`);
        if (this.onOpenCallback) this.onOpenCallback();
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        if (this.onMessageCallback) this.onMessageCallback(data);
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
  
    sendMessage(message: string, clientId?: string) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const payload: any = { message };
        if (clientId) payload.clientId = clientId;
        console.log("[WebSocket] 🚀 Sending:", payload);
        this.socket.send(JSON.stringify(payload));
      } else {
        console.error("[WebSocket] ❌ Cannot send: socket not open.");
      }
    }
  
    onMessage(callback: (message: any) => void) {
      this.onMessageCallback = callback;
    }
  
    onOpen(callback: () => void) {
      this.onOpenCallback = callback;
    }
  
    onClose(callback: () => void) {
      this.onCloseCallback = callback;
    }
  
    close() {
      if (this.socket) {
        this.socket.close();
      }
    }
  }
  