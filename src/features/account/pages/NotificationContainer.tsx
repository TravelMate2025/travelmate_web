import { useEffect, useState } from "react"
import NotificationPresenter from "./NotificationPresenter"
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
    const [notifications, setNotifications] = useState<AccountNotification[]>([]);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [hasNewNotification, setHasNewNotification] = useState(false);
    // const [selectedNotification, setSelectedNotification] = useState<AccountNotification | null>(null);

    const handleFetchNotifications = async (url?: string) => {
        setLoading(true);
        try {
            const res = await api.get(url || `${API_BASE_URL}/notifications/`);
            const data = res?.data?.results || [];

            setNotifications(prev => (url ? [...prev, ...data] : data));
            setNextPage(res?.data?.next || null);

            // Detecting  unread notifications
            const unread = data.some((n: AccountNotification) => !n.is_read);
            setHasNewNotification(unread);
        } catch (error) {
            console.log("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchNotifications()

        // Poll every 30 seconds
        const interval = setInterval(() => {
            handleFetchNotifications();
        }, 60000);

        return () => clearInterval(interval);
    },[])

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.post(`${API_BASE_URL}/api/notifications/${id}/mark_read/`);

            setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
            )
            );
        } catch (error) {
            console.log("Error marking as read:", error);
        }
    };

    // const handleNotificationDetails = async (id: string) => {
    //     try {
    //         const res = await api.get(`${API_BASE_URL}/api/notifications/${id}/`);
    //         const details = res.data;
    //         setSelectedNotification(details);
    //     } catch (error) {
    //         console.log("Error fetching notification details:", error);
    //     }
    // };

    const handleMarkAllAsRead = async () => {
        try {
        await api.post(`${API_BASE_URL}/api/notifications/mark_all_read/`);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setHasNewNotification(false);
        } catch (error) {
        console.error("Error marking all as read:", error);
        }
    };

    // const handleBulkDelete = async () => {
    //     try {
    //     await api.post(`${API_BASE_URL}/api/notifications/bulk_delete/`);
    //     setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    //     setHasNewNotification(false);
    //     } catch (error) {
    //     console.error("Error marking all as read:", error);
    //     }
    // };

    // const handleBulkMarkAsRead = async () => {
    //     try {
    //     await api.post(`${API_BASE_URL}/api/notifications/bulk_mark_read/`);
    //     setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    //     setHasNewNotification(false);
    //     } catch (error) {
    //     console.error("Error marking all as read:", error);
    //     }
    // };


  return (
    <div>
        <NotificationPresenter 
        notifications={notifications}
        loading={loading}
        onLoadMore={() => nextPage && handleFetchNotifications(nextPage)}
        hasMore={!!nextPage}
        onMarkAsRead={handleMarkAsRead}
        hasNewNotification={hasNewNotification}
        onNotificationClick={handleMarkAllAsRead}
        />
    </div>
  )
}

export default NotificationContainer