import { useEffect, useState } from "react";
import NotificationPresenter from "./NotificationPresenter";
import { useNotifications } from "../components/notifications/NotificationProvider"; // use your actual path
import api from "../../../api/services/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type NotificationDetails = {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  source_app: string;
  link: string;
  target_object: string;
  created_at: string;
};

type AccountNotification = {
  id: string;
  notification: string;
  notification_details: NotificationDetails;
  user: number;
  is_read: boolean;
  read_at: string;
  created_at: string;
};

function NotificationContainer() {
  const { notifications: wsNotifications } = useNotifications(); // from provider
  const [notifications, setNotifications] = useState<AccountNotification[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);


  useEffect(() => {
    if (!wsNotifications.length) return;

    const newNotifications: AccountNotification[] = wsNotifications.map((n) => ({
      id: n.id,
      notification: "",
      notification_details: {
        id: n.id,
        title: n.title,
        message: n.message,
        notification_type: n.type,
        source_app: n.sourceApp || "",
        link: n.link || "",
        target_object: "",
        created_at: n.createdAt,
      },
      user: 0,
      is_read: n.isRead ?? false,
      read_at: n.readAt ?? "",
      created_at: n.createdAt,
    }));

    setNotifications((prev) => {
      const ids = new Set(prev.map((n) => n.id));
      const merged = [
        ...newNotifications.filter((n) => !ids.has(n.id)),
        ...prev,
      ];
      return merged;
    });

    setHasNewNotification(true);
  }, [wsNotifications]);

  //initial notifications
  const handleFetchNotifications = async (url?: string) => {
    setLoading(true);
    try {
      const res = await api.get(url || `${API_BASE_URL}/notifications/`);
      const data = res?.data?.results || [];

      setNotifications((prev) => (url ? [...prev, ...data] : data));
      setNextPage(res?.data?.next || null);
      setHasNewNotification(data.some((n: AccountNotification) => !n.is_read));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.post(`${API_BASE_URL}/notifications/${id}/mark_read/`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await api.post(`/notifications/bulk-delete/`, { notification_ids: [id] });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleting(true);
      const ids = notifications.map((n) => n.id);
      if (ids.length === 0) return;

      await api.post(`/notifications/bulk-delete/`, { notification_ids: ids });
      setNotifications([]);
      setHasNewNotification(false);
      setIsDeleting(false);
    } catch (err) {
      console.error("Error deleting all notifications:", err);
    }
  };

  return (
    <NotificationPresenter
      notifications={notifications}
      loading={loading}
      isDeleting={isDeleting}
      hasMore={!!nextPage}
      onLoadMore={() => nextPage && handleFetchNotifications(nextPage)}
      onMarkAsRead={handleMarkAsRead}
      onDeleteOne={handleDeleteOne}
      onDeleteAll={handleDeleteAll}
      hasNewNotification={hasNewNotification}
    />
  );
}

export default NotificationContainer;
