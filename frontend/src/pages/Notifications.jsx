import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  RefreshCw,
  UserPlus,
  CircleCheck,
  CircleX,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Notifications = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState(null);
  const [error, setError] = useState("");

  const getNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Get notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    getNotifications();
  }, [authLoading, user]);

  const markAsRead = async (notificationId) => {
    try {
      setMarkingId(notificationId);
      setError("");

      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setUnreadCount((previous) => Math.max(previous - 1, 0));
    } catch (error) {
      console.error("Mark notification as read error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setMarkingId(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);
      setError("");

      await api.patch("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const formatNotificationTime = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - notificationDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} ${
        hours === 1 ? "hour" : "hours"
      } ago`;
    }

    if (days < 7) {
      return `${days} ${
        days === 1 ? "day" : "days"
      } ago`;
    }

    return notificationDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year:
        notificationDate.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case "request_received":
        return "New Skill Swap Request";

      case "request_accepted":
        return "Request Accepted";

      case "request_rejected":
        return "Request Rejected";

      case "new_message":
        return "New Message";

      default:
        return "Notification";
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case "request_received":
        return UserPlus;

      case "request_accepted":
        return CircleCheck;

      case "request_rejected":
        return CircleX;

      case "new_message":
        return MessageCircle;

      default:
        return Bell;
    }
  };

  const getNotificationIconStyle = (notification) => {
    switch (notification.type) {
      case "request_received":
        return notification.isRead
          ? "bg-slate-100 text-slate-500"
          : "bg-blue-100 text-blue-600";

      case "request_accepted":
        return notification.isRead
          ? "bg-slate-100 text-slate-500"
          : "bg-emerald-100 text-emerald-600";

      case "request_rejected":
        return notification.isRead
          ? "bg-slate-100 text-slate-500"
          : "bg-red-100 text-red-600";

      case "new_message":
        return notification.isRead
          ? "bg-slate-100 text-slate-500"
          : "bg-violet-100 text-violet-600";

      default:
        return notification.isRead
          ? "bg-slate-100 text-slate-500"
          : "bg-blue-100 text-blue-600";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <Loader2
              size={24}
              className="animate-spin text-blue-600"
            />
          </div>

          <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">
            Loading your notifications
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Checking your latest requests and messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">

        {/* =================================
            PAGE HEADER
        ================================== */}

        <section className="mb-5 sm:mb-7">
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                <Sparkles size={11} />
                Skill Exchange
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[8px] font-bold text-white sm:h-6 sm:min-w-6 sm:text-[10px]">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </div>

              <p className="mt-1 text-[9px] text-slate-500 sm:mt-1.5 sm:text-xs md:text-sm">
                Stay updated with your SkillSwap activity
              </p>
            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={getNotifications}
              disabled={loading}
              aria-label="Refresh notifications"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3"
            >
              <RefreshCw
                size={13}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              <span className="hidden text-[10px] font-semibold sm:inline sm:text-xs">
                {loading ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </section>

        {/* =================================
            ERROR
        ================================== */}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:mb-5 sm:rounded-2xl sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 text-[9px] leading-4 text-red-700 sm:text-xs">
                {error}
              </p>

              <button
                type="button"
                onClick={getNotifications}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-red-700 sm:px-3 sm:py-2 sm:text-xs"
              >
                <RefreshCw size={10} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* =================================
            FACEBOOK STYLE NOTIFICATION PANEL
        ================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Panel Header */}

          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900 sm:text-sm md:text-base">
                Notifications
              </h2>

              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 sm:px-2 sm:text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={markingAll}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[8px] font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
              >
                {markingAll ? (
                  <Loader2
                    size={10}
                    className="animate-spin sm:h-3.5 sm:w-3.5"
                  />
                ) : (
                  <CheckCheck
                    size={11}
                    className="sm:h-3.5 sm:w-3.5"
                  />
                )}

                <span className="hidden xs:inline sm:inline">
                  Mark all as read
                </span>

                <span className="sm:hidden">
                  Mark all
                </span>
              </button>
            )}
          </div>

          {/* =================================
              NOTIFICATION LIST
          ================================== */}

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center sm:py-20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 sm:h-14 sm:w-14">
                <Bell
                  size={21}
                  className="text-blue-600 sm:h-6 sm:w-6"
                />
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900 sm:text-base">
                No notifications
              </h3>

              <p className="mt-1 max-w-sm text-[9px] leading-4 text-slate-500 sm:text-xs sm:leading-5">
                You're all caught up. New requests,
                messages, and updates will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {notifications.map((notification) => {
                const NotificationIcon =
                  getNotificationIcon(notification);

                return (
                  <div
                    key={notification._id}
                    className={`group relative flex items-start gap-2.5 px-3 py-3 transition sm:gap-3.5 sm:px-5 sm:py-4 ${
                      notification.isRead
                        ? "bg-white hover:bg-slate-50"
                        : "bg-blue-50/70 hover:bg-blue-50"
                    }`}
                  >

                    {/* =================================
                        ICON
                    ================================== */}

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${getNotificationIconStyle(
                        notification
                      )}`}
                    >
                      <NotificationIcon
                        size={16}
                        className="sm:h-[18px] sm:w-[18px]"
                      />
                    </div>

                    {/* =================================
                        CONTENT
                    ================================== */}

                    <div className="min-w-0 flex-1">

                      {/* Title + Dot */}

                      <div className="flex items-start justify-between gap-2">

                        <div className="min-w-0">

                          <h3 className="text-[10px] font-bold leading-4 text-slate-900 sm:text-sm sm:leading-5">
                            {getNotificationTitle(
                              notification
                            )}
                          </h3>

                          <p className="mt-0.5 text-[9px] leading-4 text-slate-600 sm:mt-1 sm:text-xs sm:leading-5 md:text-sm">
                            {notification.sender?.name && (
                              <span className="font-semibold text-slate-800">
                                {notification.sender.name}{" "}
                              </span>
                            )}

                            {notification.message}
                          </p>

                        </div>

                        {!notification.isRead && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 sm:h-2.5 sm:w-2.5" />
                        )}

                      </div>

                      {/* Time */}

                      <p className="mt-1 text-[8px] font-medium text-slate-400 sm:mt-1.5 sm:text-[10px]">
                        {formatNotificationTime(
                          notification.createdAt
                        )}
                      </p>

                      {/* Action */}

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                          disabled={
                            markingId ===
                            notification._id
                          }
                          className="mt-2 flex items-center gap-1 rounded-lg border border-blue-100 bg-white px-2 py-1.5 text-[8px] font-semibold text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-2.5 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-[10px]"
                        >
                          {markingId ===
                          notification._id ? (
                            <Loader2
                              size={10}
                              className="animate-spin"
                            />
                          ) : (
                            <Check size={10} />
                          )}

                          {markingId ===
                          notification._id
                            ? "Marking..."
                            : "Mark as read"}
                        </button>
                      )}

                      {/* Read State */}

                      {notification.isRead && (
                        <div className="mt-1.5 flex items-center gap-1 text-[8px] font-medium text-slate-400 sm:mt-2 sm:text-[10px]">
                          <Check
                            size={10}
                            className="sm:h-3 sm:w-3"
                          />

                          Read
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =================================
            MESSAGES ACTION
        ================================== */}

        <div className="flex justify-center py-4 sm:py-5">
          <button
            type="button"
            onClick={() => navigate("/chat")}
            className="rounded-lg px-3 py-2 text-[9px] font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-4 sm:py-2.5 sm:text-xs md:text-sm"
          >
            Go to Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;