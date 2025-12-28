import Navbar from "../../../pages/homePage/Navbar";
import Footer from "../../../components/2Footer";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import { FiBell } from "react-icons/fi";

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

type NotificationPresenterProps = {
  notifications: AccountNotification[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onMarkAsRead: (id: string) => void;
  hasNewNotification?: boolean;
  onNotificationClick?: () => void;
};

function NotificationPresenter({
  notifications,
  loading,
  hasMore,
  onLoadMore,
  onMarkAsRead,
}: NotificationPresenterProps) {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Notification" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="my-10"></div>
      <Navbar />
      <div className="ml-4 sm:ml-8 md:ml-10 hidden md:block">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="px-4 sm:px-6 md:px-10">
        <h2
          className="text-lg sm:text-xl md:text-[20px]
         font-bold mb-4 ml-4 sm:ml-6 md:ml-10 text-center md:text-left"
        >
          Notifications
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="h-[150px] w-[90%] sm:w-[70%] md:w-[50%] m-auto mt-[20%] sm:mt-[10%] text-center">
            <div
              className="w-[60px] sm:w-[70px] h-[60px] sm:h-[70px] p-2 
              m-auto bg-gray-100 rounded-full border border-gray-200 flex flex-col
              items-center justify-center mb-5"
            >
              <FiBell size={30} className="sm:size-[34px] text-gray-700" />
            </div>
            <div className="w-full sm:w-[350px] md:w-[390px] m-auto px-2">
              <h2 className="text-lg sm:text-[20px] font-semibold">
                No Notifications Yet
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                We’ll inform you about booking confirmations and travel updates
                here.
              </p>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)} // MARK AS READ ON CLICK
                className="border-b border-gray-400 w-[95%] sm:w-[90%] m-auto flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2 sm:gap-0 cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 ml-2">
                  <div
                    className={`w-[30px] h-[30px] p-1 rounded-full flex items-center justify-center 
                      ${item.is_read ? "bg-gray-200" : "bg-blue-100"}`}
                  >
                    <FiBell className="text-gray-800" />
                  </div>
                  <div className="max-w-[90%] sm:max-w-[75%]">
                    <p className="font-semibold text-sm sm:text-base">
                      {item.notification_details.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 break-words">
                      {item.notification_details.message}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] sm:text-[13px] mt-1 sm:-mt-4 mr-2 text-gray-600 text-right">
                  <p>{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={onLoadMore}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
          >
            Load More
          </button>
        </div>
      )}

      <div className="hidden md:block">
        <TravelmateApp />
      </div>

      <div className="m-10"></div>
      <Footer />
    </div>
  );
}

export default NotificationPresenter;
