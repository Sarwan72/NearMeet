import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationRead } from "../lib/api";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications(user._id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const updated = await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? updated : n))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  if (loading) return <p className="text-gray-400 text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-gray-300 text-center">No notifications yet.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`p-4 rounded-xl ${
                  n.isRead ? "bg-white/5" : "bg-white/20"
                }`}
              >
                <p className="text-yellow-400 font-semibold">
                  {n.vendor?.hotelName || "A Vendor"}
                </p>
                <p className="text-white">{n.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="mt-2 text-sm text-blue-400 hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
