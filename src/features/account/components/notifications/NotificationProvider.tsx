
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

import { Notification } from "./notifications.types";
import { WsMessageType } from "./ws.types";
import { NotificationCategory } from "./category.types";
import { WsNotificationMessage } from "./ws.payload.types";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const WS_URL = `wss://travelmate-backend-0suw.onrender.com/ws/notifications/?authorization=${accessToken}`;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const payload: WsNotificationMessage = JSON.parse(event.data);
        if (payload.event !== "notification.created") return;

        const { data } = payload;
        const details = data.notification_details;

        const categoryKey =
          details.category.toUpperCase() as keyof typeof NotificationCategory;

        const notification: Notification = {
          id: data.id,
          title: details.title,
          message: details.message,
          type: details.notification_type as WsMessageType,
          category: NotificationCategory[categoryKey],
          createdAt: data.created_at,
          isRead: data.is_read,
          readAt: data.read_at,
          link: details.link,
          sourceApp: details.source_app,
        };

        setNotifications((prev) => [notification, ...prev]);
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed", e.code, e.reason);
      wsRef.current = null;
    };

    return () => {
      ws.close();
    };
  }, [accessToken]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return context;
}
