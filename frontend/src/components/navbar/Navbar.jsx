import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  CircleCheck,
  CircleX,
  ClipboardList,
  Home,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  RefreshCw,
  Search,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [notificationMenuOpen, setNotificationMenuOpen] =
    useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] =
    useState(false);
  const [notificationsError, setNotificationsError] =
    useState("");
  const [markingNotificationId, setMarkingNotificationId] =
    useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const fetchProfileImage = async () => {
    if (!isAuthenticated) {
      setProfileImage("");
      return;
    }

    try {
      setProfileLoading(true);

      const response = await api.get("/profile/me");

      const image =
        response.data?.profile?.profileImage || "";

      setProfileImage(image);
    } catch (error) {
      console.error(
        "Failed to fetch profile image:",
        error,
      );

      setProfileImage("");
    } finally {
      setProfileLoading(false);
    }
  };

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await fetch(
        `${apiUrl}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) return;

      const data = await response.json();

      setUnreadCount(data?.unreadCount || 0);
    } catch (error) {
      console.error(
        "Failed to fetch unread notifications:",
        error,
      );
    }
  };

  // =========================================================
  // FETCH NOTIFICATIONS
  // =========================================================

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setNotificationsLoading(true);
      setNotificationsError("");

      const response = await api.get("/notifications");

      const notificationData =
        response.data?.notifications || [];

      setNotifications(notificationData);

      if (
        typeof response.data?.unreadCount === "number"
      ) {
        setUnreadCount(response.data.unreadCount);
      } else {
        const unread = notificationData.filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadCount(unread);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications:",
        error,
      );

      setNotificationsError(
        error?.response?.data?.message ||
          "Unable to load notifications.",
      );
    } finally {
      setNotificationsLoading(false);
    }
  };

  // =========================================================
  // MARK ONE NOTIFICATION AS READ
  // =========================================================

  const markNotificationAsRead = async (
    notificationId,
  ) => {
    if (!notificationId) return;

    try {
      setMarkingNotificationId(notificationId);

      await api.patch(
        `/notifications/${notificationId}/read`,
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1),
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    } finally {
      setMarkingNotificationId(null);
    }
  };

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  const markAllNotificationsAsRead = async () => {
    if (unreadCount <= 0 || markingAll) return;

    try {
      setMarkingAll(true);

      await api.patch("/notifications/read-all");

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // =========================================================
  // NOTIFICATION HELPERS
  // =========================================================

  const getNotificationTitle = (notification) => {
    switch (notification?.type) {
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
    const iconProps = {
      size: 17,
      strokeWidth: 2.2,
    };

    switch (notification?.type) {
      case "request_received":
        return <UserPlus {...iconProps} />;

      case "request_accepted":
        return <CircleCheck {...iconProps} />;

      case "request_rejected":
        return <CircleX {...iconProps} />;

      case "new_message":
        return <MessageCircle {...iconProps} />;

      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationIconStyle = (notification) => {
    if (notification?.isRead) {
      return "bg-slate-100 text-slate-500";
    }

    switch (notification?.type) {
      case "request_received":
        return "bg-blue-100 text-blue-600";

      case "request_accepted":
        return "bg-emerald-100 text-emerald-600";

      case "request_rejected":
        return "bg-red-100 text-red-600";

      case "new_message":
        return "bg-violet-100 text-violet-600";

      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const formatNotificationTime = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const difference =
      now.getTime() - date.getTime();

    const seconds = Math.floor(
      difference / 1000,
    );

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 30) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // =========================================================
  // AUTH EFFECT
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setProfileImage("");
      setNotifications([]);
      setNotificationMenuOpen(false);

      return;
    }

    fetchUnreadCount();
    fetchProfileImage();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // =========================================================
  // PROFILE REFRESH
  // =========================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchProfileImage();
  }, [location.pathname]);

  // =========================================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // =========================================================

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);
  }, [location.pathname]);

  // =========================================================
  // PROFILE OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  // =========================================================
  // NOTIFICATION OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(
          event.target,
        )
      ) {
        setNotificationMenuOpen(false);
      }
    };

    if (notificationMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [notificationMenuOpen]);

  // =========================================================
  // MOBILE OUTSIDE CLICK
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [mobileMenuOpen]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    setNotificationMenuOpen(false);

    logout();

    navigate("/login");
  };

  // =========================================================
  // NOTIFICATION BUTTON
  // =========================================================

  const handleNotificationButtonClick = () => {
    setProfileMenuOpen(false);

    setNotificationMenuOpen((previous) => {
      const nextState = !previous;

      if (nextState) {
        fetchNotifications();
      }

      return nextState;
    });
  };

  // =========================================================
  // PROFILE AVATAR
  // =========================================================

  const getInitial = () => {
    if (!user?.name) return "U";

    return user.name.charAt(0).toUpperCase();
  };

  const ProfileAvatar = ({
    size = "desktop",
    className = "",
  }) => {
    const sizeClass =
      size === "mobile"
        ? "h-8 w-8 rounded-full"
        : size === "dropdown"
          ? "h-10 w-10 rounded-full"
          : "h-9 w-9 rounded-full";

    return (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 font-bold text-white shadow-sm ring-2 ring-white ${sizeClass} ${className}`}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt={user?.name || "Profile"}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : profileLoading ? (
          <Loader2
            size={size === "mobile" ? 14 : 15}
            className="animate-spin"
          />
        ) : (
          <span className="text-xs">
            {getInitial()}
          </span>
        )}
      </div>
    );
  };

  // =========================================================
  // NAV CLASSES
  // =========================================================

  const desktopNavClass = ({ isActive }) =>
    `group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between gap-4">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="SkillSwap Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-600/30">
              <span className="relative z-10">
                S
              </span>

              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </div>

            <span className="text-xl font-bold tracking-tight text-gray-950 sm:text-[22px]">
              Skill
              <span className="text-blue-600">
                Swap
              </span>
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav className="hidden items-center gap-1 lg:flex">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/"
                  className={desktopNavClass}
                >
                  <Home size={16} />
                  Home
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={desktopNavClass}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/explore"
                  className={desktopNavClass}
                >
                  <Search size={16} />
                  Explore
                </NavLink>

                <NavLink
                  to="/matches"
                  className={desktopNavClass}
                >
                  <Users size={16} />
                  Matches
                </NavLink>

                <NavLink
                  to="/requests"
                  className={desktopNavClass}
                >
                  <ClipboardList size={16} />
                  Requests
                </NavLink>

                <NavLink
                  to="/chat"
                  className={desktopNavClass}
                >
                  <MessageCircle size={16} />
                  Messages
                </NavLink>
              </>
            )}
          </nav>

          {/* =================================================
              DESKTOP RIGHT
          ================================================== */}

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                {/* Bell */}
                <button
                  type="button"
                  onClick={
                    handleNotificationButtonClick
                  }
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                    notificationMenuOpen
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                  }`}
                  aria-label="Notifications"
                  aria-expanded={
                    notificationMenuOpen
                  }
                >
                  <Bell size={19} />

                  {unreadCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {/* =========================================
                    USER PROFILE WRAPPER
                    PANEL IS ANCHORED HERE
                ========================================== */}

                <div
                  ref={(element) => {
                    profileMenuRef.current = element;
                    notificationMenuRef.current =
                      element;
                  }}
                  className="relative ml-1"
                >
                  {/* User Profile Button */}

                  <button
                    type="button"
                    onClick={() => {
                      setNotificationMenuOpen(false);

                      setProfileMenuOpen(
                        (previous) =>
                          !previous,
                      );
                    }}
                    className={`group flex max-w-[220px] items-center gap-2.5 rounded-xl border px-2 py-1.5 transition-all duration-200 ${
                      profileMenuOpen
                        ? "border-gray-200 bg-gray-50"
                        : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                    }`}
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                  >
                    <ProfileAvatar />

                    <div className="hidden min-w-0 xl:block">
                      <p className="max-w-[115px] truncate text-left text-sm font-semibold text-gray-900">
                        {user?.name || "User"}
                      </p>

                      <p className="text-left text-[11px] text-gray-500">
                        SkillSwap member
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                        profileMenuOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {/* =======================================
                      NOTIFICATION PANEL
                      FAR RIGHT UNDER PROFILE
                  ======================================== */}

                  {notificationMenuOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-full
                        z-[100]
                        mt-3
                        w-[520px]
                        max-w-[calc(100vw-24px)]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-2xl
                        shadow-gray-900/15
                      "
                    >
                      {/* Header */}
                      <div className="border-b border-gray-100 bg-white px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <Bell size={19} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-gray-950">
                                  Notifications
                                </h2>

                                {unreadCount > 0 && (
                                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                    {unreadCount} unread
                                  </span>
                                )}
                              </div>

                              <p className="mt-0.5 text-xs text-gray-500">
                                Stay updated with your
                                SkillSwap activity
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={
                                fetchNotifications
                              }
                              disabled={
                                notificationsLoading
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                              title="Refresh notifications"
                            >
                              <RefreshCw
                                size={15}
                                className={
                                  notificationsLoading
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                            </button>

                            {unreadCount > 0 && (
                              <button
                                type="button"
                                onClick={
                                  markAllNotificationsAsRead
                                }
                                disabled={markingAll}
                                className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-50 sm:flex"
                              >
                                {markingAll ? (
                                  <Loader2
                                    size={13}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <CheckCheck
                                    size={13}
                                  />
                                )}

                                Mark all read
                              </button>
                            )}
                          </div>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={
                              markAllNotificationsAsRead
                            }
                            disabled={markingAll}
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-600 sm:hidden"
                          >
                            {markingAll ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCheck size={13} />
                            )}

                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-[520px] min-h-[220px] overflow-y-auto bg-gray-50/60">
                        {/* Loading */}
                        {notificationsLoading && (
                          <div className="space-y-2 p-3">
                            {[1, 2, 3, 4].map(
                              (item) => (
                                <div
                                  key={item}
                                  className="animate-pulse rounded-xl bg-white p-4"
                                >
                                  <div className="flex gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200" />

                                    <div className="flex-1 space-y-2">
                                      <div className="h-3 w-40 rounded bg-gray-200" />
                                      <div className="h-3 w-4/5 rounded bg-gray-200" />
                                      <div className="h-2.5 w-16 rounded bg-gray-200" />
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        {/* Error */}
                        {!notificationsLoading &&
                          notificationsError && (
                            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                                <CircleX size={22} />
                              </div>

                              <h3 className="text-sm font-semibold text-gray-900">
                                Couldn't load
                                notifications
                              </h3>

                              <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500">
                                {notificationsError}
                              </p>

                              <button
                                type="button"
                                onClick={
                                  fetchNotifications
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                              >
                                <RefreshCw size={13} />
                                Try again
                              </button>
                            </div>
                          )}

                        {/* Empty */}
                        {!notificationsLoading &&
                          !notificationsError &&
                          notifications.length ===
                            0 && (
                            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                                <Bell size={25} />
                              </div>

                              <h3 className="text-sm font-bold text-gray-900">
                                No notifications yet
                              </h3>

                              <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
                                When you receive requests,
                                messages, or updates,
                                they'll appear here.
                              </p>
                            </div>
                          )}

                        {/* Notifications */}
                        {!notificationsLoading &&
                          !notificationsError &&
                          notifications.length > 0 && (
                            <div className="space-y-1.5 p-2.5">
                              {notifications
                                .slice(0, 8)
                                .map(
                                  (notification) => {
                                    const isUnread =
                                      !notification.isRead;

                                    return (
                                      <div
                                        key={
                                          notification._id
                                        }
                                        className={`rounded-xl border p-3.5 transition ${
                                          isUnread
                                            ? "border-blue-100 bg-white shadow-sm"
                                            : "border-transparent bg-white/70"
                                        } hover:border-gray-200 hover:bg-white`}
                                      >
                                        <div className="flex gap-3">
                                          <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getNotificationIconStyle(
                                              notification,
                                            )}`}
                                          >
                                            {getNotificationIcon(
                                              notification,
                                            )}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                  <h3
                                                    className={`truncate text-xs font-bold ${
                                                      isUnread
                                                        ? "text-gray-950"
                                                        : "text-gray-700"
                                                    }`}
                                                  >
                                                    {getNotificationTitle(
                                                      notification,
                                                    )}
                                                  </h3>

                                                  {isUnread && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                                                  )}
                                                </div>

                                                {notification
                                                  ?.sender
                                                  ?.name && (
                                                  <p className="mt-0.5 truncate text-[10px] font-medium text-blue-600">
                                                    {
                                                      notification
                                                        .sender
                                                        .name
                                                    }
                                                  </p>
                                                )}
                                              </div>

                                              <span className="shrink-0 text-[10px] text-gray-400">
                                                {formatNotificationTime(
                                                  notification.createdAt,
                                                )}
                                              </span>
                                            </div>

                                            <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-gray-600">
                                              {
                                                notification.message
                                              }
                                            </p>

                                            {isUnread && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  markNotificationAsRead(
                                                    notification._id,
                                                  )
                                                }
                                                disabled={
                                                  markingNotificationId ===
                                                  notification._id
                                                }
                                                className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                                              >
                                                {markingNotificationId ===
                                                notification._id ? (
                                                  <Loader2
                                                    size={11}
                                                    className="animate-spin"
                                                  />
                                                ) : (
                                                  <Check
                                                    size={11}
                                                  />
                                                )}

                                                Mark as read
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                            </div>
                          )}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 bg-white p-2.5">
                        <Link
                          to="/notifications"
                          onClick={() =>
                            setNotificationMenuOpen(
                              false,
                            )
                          }
                          className="flex items-center justify-center rounded-xl bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* =======================================
                      PROFILE DROPDOWN
                  ======================================== */}

                  {profileMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-900/10"
                      role="menu"
                    >
                      <div className="mb-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-gray-50 px-3 py-3">
                        <ProfileAvatar size="dropdown" />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {user?.name || "User"}
                          </p>

                          <p className="truncate text-xs text-gray-500">
                            {user?.email ||
                              "SkillSwap member"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                        role="menuitem"
                      >
                        <UserRound size={17} />
                        My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                        role="menuitem"
                      >
                        <LayoutDashboard size={17} />
                        Dashboard
                      </Link>

                      <Link
                        to="/notifications"
                        onClick={() =>
                          setProfileMenuOpen(false)
                        }
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
                        role="menuitem"
                      >
                        <span className="flex items-center gap-3">
                          <Bell size={17} />
                          Notifications
                        </span>

                        {unreadCount > 0 && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                            {unreadCount > 99
                              ? "99+"
                              : unreadCount}
                          </span>
                        )}
                      </Link>

                      <div className="my-2 border-t border-gray-100" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                        role="menuitem"
                      >
                        <LogOut size={17} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className={desktopNavClass}
                >
                  <Home size={16} />
                  Home
                </NavLink>

                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* =================================================
              MOBILE RIGHT
          ================================================== */}

          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                aria-label="Notifications"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous,
                )
              }
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
                mobileMenuOpen
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label={
                mobileMenuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FLOATING MENU
      ====================================================== */}

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute right-3 top-[73px] w-[190px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-900/15 lg:hidden sm:right-6"
        >
          <div className="max-h-[calc(100vh-85px)] overflow-y-auto p-1.5">
            {isAuthenticated && (
              <div className="mb-1.5 flex items-center gap-2 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-2">
                <ProfileAvatar size="mobile" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-gray-900">
                    {user?.name || "User"}
                  </p>

                  <Link
                    to="/profile"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="text-[9px] font-semibold text-blue-600"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            )}

            <nav className="grid gap-0.5">
              <NavLink
                to="/"
                className={mobileNavClass}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                <Home size={15} />
                <span>Home</span>
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <UserRound size={15} />
                    <span>My Profile</span>
                  </NavLink>

                  <NavLink
                    to="/explore"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <Search size={15} />
                    <span>Explore</span>
                  </NavLink>

                  <NavLink
                    to="/matches"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <Users size={15} />
                    <span>Matches</span>
                  </NavLink>

                  <NavLink
                    to="/requests"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <ClipboardList size={15} />
                    <span>Requests</span>
                  </NavLink>

                  <NavLink
                    to="/chat"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <MessageCircle size={15} />
                    <span>Messages</span>
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={mobileNavClass}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    <Bell size={15} />

                    <span className="flex flex-1 items-center justify-between">
                      Notifications

                      {unreadCount > 0 && (
                        <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                          {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                        </span>
                      )}
                    </span>
                  </NavLink>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid gap-1.5 pt-1">
                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="rounded-lg border border-gray-200 px-2.5 py-2 text-center text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="rounded-lg bg-blue-600 px-2.5 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;