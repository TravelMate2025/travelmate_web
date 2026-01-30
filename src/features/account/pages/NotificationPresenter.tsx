import { useState, useMemo } from "react";
import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import { FiBell, FiMoreHorizontal } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";


type NotificationDetails = {
  id: string;
  title: string;
  message: string;
  created_at: string;
};

type AccountNotification = {
  id: string;
  notification_details: NotificationDetails;
  is_read: boolean;
  created_at: string;
};

type Props = {
  notifications: AccountNotification[];
  loading: boolean;
  isDeleting: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteOne: (id: string) => void;
  onDeleteAll: () => void;
  hasNewNotification: boolean;
};

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}hr`;
  const days = Math.floor(hrs / 24);
  return `${days}days`;
};

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const groupNotifications = (notifications: AccountNotification[]) => {
  const today: AccountNotification[] = [];
  const yesterday: AccountNotification[] = [];
  const last7Days: AccountNotification[] = [];
  const older: AccountNotification[] = [];

  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const last7Start = new Date(todayStart);
  last7Start.setDate(todayStart.getDate() - 7);

  notifications.forEach((n) => {
    const created = new Date(n.created_at);

    if (created >= todayStart) today.push(n);
    else if (created >= yesterdayStart) yesterday.push(n);
    else if (created >= last7Start) last7Days.push(n);
    else older.push(n);
  });

  return { today, yesterday, last7Days, older };
};


function NotificationPresenter({
  notifications,
  loading,
  isDeleting,
  hasMore,
  onLoadMore,
  onMarkAsRead,
  onDeleteOne,
  onDeleteAll,
}: Props) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;
  }, [filter, notifications]);

  const grouped = groupNotifications(filtered);

  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Notification" },
  ];

  const renderSection = (title: string, items: AccountNotification[]) =>
    items.length > 0 && (
    <>
      <h3 className="mt-6 mb-2 text-sm font-semibold text-gray-700">
        {title}
      </h3>
      <div className="bg-gray-200 rounded">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative p-2  py-3"
          >
            <div className="flex justify-between gap-4">
              {/* BODY (MARK AS READ HERE ONLY) */}
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (!item.is_read) onMarkAsRead(item.id);
                }}
              >
                <p
                  className={`text-sm ${
                    item.is_read ? "font-normal" : "font-bold"
                  }`}
                >
                  {item.notification_details.title}
                </p>
                <p className="text-xs text-gray-600">
                  {item.notification_details.message}
                </p>
              </div>

              {/* TIME + MENU */}
              <div className="relative text-right text-xs text-gray-500">
                <p>{formatRelativeTime(item.created_at)}</p>

                <FiMoreHorizontal
                  className="mt-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === item.id ? null : item.id);
                  }}
                />

                {menuOpen === item.id && (
                  <div className="absolute right-0 top-9 z-20 w-20 rounded bg-white shadow">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOne(item.id);
                        setMenuOpen(null);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="ml-10 hidden md:block mt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="px-6 md:px-10">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>

        {/* FILTER + DELETE */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 rounded ${
                filter === "unread"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              Unread
            </button>
          </div>

          <button
            onClick={onDeleteAll}
            className="flex items-center gap-1 text-red-600"
          >
            <FaTrash /> {isDeleting ? "Deleting..." : "Delete All"}
          </button>
        </div>

        {/* STATES */}
        {loading && <p className="text-center">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center mt-20">
            <FiBell size={40} className="m-auto text-gray-500" />
            <p className="mt-2 text-gray-600">No Notifications</p>
          </div>
        )}

        {!loading && (
          <>
            {renderSection("Today", grouped.today)}
            {renderSection("Yesterday", grouped.yesterday)}
            {renderSection("Last 7 Days", grouped.last7Days)}
            {renderSection("Older", grouped.older)}
          </>
        )}

        {hasMore && (
          <div className="text-center mt-6">
            <button
              onClick={onLoadMore}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <TravelmateApp />
      <Footer />
    </div>
  );
}

export default NotificationPresenter;
