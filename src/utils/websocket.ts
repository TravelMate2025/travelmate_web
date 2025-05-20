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
  
    sendMessage(message: string, file?: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return reject(new Error("WebSocket not open"));
    }

    const payload: any = { message };

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        payload.attachment = reader.result;
        console.log("[WebSocket] 🚀 File read complete. Sending:", payload);
        this.socket!.send(JSON.stringify(payload));
        resolve();
      };

      reader.onerror = () => {
        console.error("❌ FileReader failed");
        reject(new Error("File reading failed"));
      };

      reader.readAsDataURL(file);
    } else {
      console.log("[WebSocket] 🚀 Sending:", payload);
      this.socket.send(JSON.stringify(payload));
      resolve();
    }
  });
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
  