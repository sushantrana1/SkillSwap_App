import { Link } from "react-router-dom";
import {
  User,
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  Bell,
  MessageCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const [stats, setStats] = useState({
    matches: 0,
    pendingRequests: 0,
    unreadNotifications: 0,
    conversations: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [recentRequests, setRecentRequests] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setStatsLoading(true);
      setDashboardError("");

      const [
        matchesResponse,
        requestsResponse,
        notificationsResponse,
        conversationsResponse,
      ] = await Promise.all([
        api.get("/matches"),
        api.get("/requests/received"),
        api.get("/notifications"),
        api.get("/chat/conversations"),
      ]);

      const matchesData = matchesResponse.data;
      const requestsData = requestsResponse.data;
      const notificationsData = notificationsResponse.data;
      const conversationsData = conversationsResponse.data;

      const pendingRequests = (requestsData.requests || []).filter(
        (request) => request.status === "pending",
      ).length;

      setStats({
        matches: matchesData.count || 0,
        pendingRequests,
        unreadNotifications: notificationsData.unreadCount || 0,
        conversations:
          conversationsData.count ||
          conversationsData.conversations?.length ||
          0,
      });

      setRecentRequests((requestsData.requests || []).slice(0, 3));

      setRecentNotifications(
        (notificationsData.notifications || []).slice(0, 3),
      );
    } catch (error) {
      console.error("Failed to load dashboard data:", error);

      if (error.response?.status !== 401) {
        setDashboardError(
          "Unable to load your dashboard data. Please try again.",
        );
      }
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setStatsLoading(false);
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-200 border-t-blue-600">
            <span className="sr-only">Loading</span>
          </div>

          <p className="mt-4 text-sm text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <User size={26} className="text-blue-600" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
            Please log in
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            You need to be logged in to view your dashboard.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Matches",
      value: stats.matches,
      description: "People matching your skills",
      action: "View matches",
      link: "/matches",
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
      hoverStyle: "group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      description: "Requests waiting for you",
      action: "View requests",
      link: "/requests",
      icon: Clock,
      iconStyle: "bg-amber-50 text-amber-600",
      hoverStyle: "group-hover:bg-amber-500 group-hover:text-white",
    },
    {
      title: "Notifications",
      value: stats.unreadNotifications,
      description: "Unread updates and alerts",
      action: "View notifications",
      link: "/notifications",
      icon: Bell,
      iconStyle: "bg-red-50 text-red-600",
      hoverStyle: "group-hover:bg-red-500 group-hover:text-white",
    },
    {
      title: "Conversations",
      value: stats.conversations,
      description: "Your active conversations",
      action: "Open chat",
      link: "/chat",
      icon: MessageCircle,
      iconStyle: "bg-emerald-50 text-emerald-600",
      hoverStyle: "group-hover:bg-emerald-500 group-hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-500 to-gray-300 px-5 py-6 text-white shadow-lg sm:mb-7 sm:px-7 sm:py-8 md:px-9 md:py-10">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-blue-50 backdrop-blur-sm sm:text-xs">
              <Sparkles size={13} />
              SKILLSWAP DASHBOARD
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Welcome back, {user?.name}!
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-blue-100 sm:mt-3 sm:text-sm sm:leading-6 md:text-base">
              Manage your skills, discover new skill partners, and keep track of
              your SkillSwap activity.
            </p>

            <div className="mt-5 flex flex-row gap-2 sm:flex-wrap sm:gap-2.5">
              <Link
                to="/explore"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
              >
                Explore Users
                <ArrowRight size={13} className="shrink-0 sm:h-4 sm:w-4" />
              </Link>

              <Link
                to="/profile"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:flex-none sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </section>

        {/* Error */}
        {dashboardError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mb-7 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-red-800 sm:text-base">
                  Dashboard data could not be loaded
                </h2>

                <p className="mt-1 text-xs leading-5 text-red-700 sm:text-sm">
                  {dashboardError}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDashboardData}
                disabled={statsLoading}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                <RefreshCw
                  size={15}
                  className={statsLoading ? "animate-spin" : ""}
                />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <section className="mb-5 grid grid-cols-2 gap-3 sm:mb-7 sm:gap-4 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                to={card.link}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">
                      {card.title}
                    </p>

                    <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:mt-2 sm:text-3xl">
                      {statsLoading ? "..." : card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition sm:h-11 sm:w-11 ${card.iconStyle} ${card.hoverStyle}`}
                  >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={21} className="hidden sm:block" />
                  </div>
                </div>

                <p className="mt-2 hidden text-xs leading-5 text-slate-500 sm:block">
                  {card.description}
                </p>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-600 sm:mt-4 sm:text-xs">
                  {card.action}
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </section>

        {/* Profile */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-7 sm:p-6 md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm sm:h-14 sm:w-14">
                <User size={22} className="sm:hidden" />
                <User size={27} className="hidden sm:block" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 sm:text-xs">
                  Your account
                </p>

                <h2 className="mt-0.5 truncate text-base font-bold text-slate-900 sm:text-xl">
                  {user?.name}
                </h2>

                <p className="truncate text-xs text-slate-500 sm:text-sm">
                  {user?.email}
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto sm:text-sm"
            >
              Edit Profile
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
            <div className="rounded-xl bg-slate-50 p-3.5 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400 sm:text-xs">
                Account Role
              </p>

              <p className="mt-1 text-xs font-semibold capitalize text-slate-800 sm:text-sm">
                {user?.role || "User"}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3.5 sm:p-4">
              <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600 sm:text-xs">
                Account Status
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 sm:h-2 sm:w-2" />

                <p className="text-xs font-semibold text-emerald-700 sm:text-sm">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-5 grid gap-4 sm:mb-7 md:grid-cols-2 md:gap-5">
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-12 sm:w-12">
                <BookOpen size={20} className="sm:hidden" />
                <BookOpen size={24} className="hidden sm:block" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Skills to Teach
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Skills you can share with others
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-600 sm:mt-5 sm:text-sm sm:leading-6">
              Add and manage the skills you can teach through your profile.
            </p>

            <Link
              to="/profile"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700 sm:text-sm"
            >
              Manage Skills
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                <GraduationCap size={20} className="sm:hidden" />
                <GraduationCap size={24} className="hidden sm:block" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                  Skills to Learn
                </h2>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Skills you want to learn
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-600 sm:mt-5 sm:text-sm sm:leading-6">
              Add and manage the skills you want to learn through your profile.
            </p>

            <Link
              to="/profile"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition hover:text-emerald-700 sm:text-sm"
            >
              Manage Skills
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-5 grid gap-4 sm:mb-7 lg:grid-cols-2 lg:gap-5">
          {/* Requests */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-xl">
                  Recent Requests
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-sm">
                  Your latest incoming requests.
                </p>
              </div>

              <Link
                to="/requests"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-blue-600 sm:text-xs"
              >
                View All
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
              {statsLoading ? (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Loading requests...
                  </p>
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center sm:p-6">
                  <Clock size={22} className="mx-auto text-slate-400" />

                  <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                    You have no recent requests.
                  </p>

                  <Link
                    to="/explore"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
                  >
                    Explore Users
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                recentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200 hover:bg-white sm:p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 sm:h-10 sm:w-10">
                      {request.sender?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                        {request.sender?.name || "Unknown User"}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">
                        Sent you a skill swap request.
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold capitalize sm:px-2.5 sm:text-[10px] ${
                        request.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : request.status === "accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 sm:text-xl">
                  Recent Notifications
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-sm">
                  Your latest SkillSwap activity.
                </p>
              </div>

              <Link
                to="/notifications"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-blue-600 sm:text-xs"
              >
                View All
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
              {statsLoading ? (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500 sm:text-sm">
                    Loading notifications...
                  </p>
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center sm:p-6">
                  <Bell size={22} className="mx-auto text-slate-400" />

                  <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                    You have no recent notifications.
                  </p>
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`rounded-xl border p-3 sm:p-4 ${
                      notification.isRead
                        ? "border-slate-100 bg-slate-50"
                        : "border-blue-100 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          notification.isRead ? "bg-slate-100" : "bg-blue-100"
                        }`}
                      >
                        <Bell
                          size={15}
                          className={
                            notification.isRead
                              ? "text-slate-400"
                              : "text-blue-600"
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 sm:text-sm">
                          {notification.sender?.name || "SkillSwap"}
                        </p>

                        <p className="mt-0.5 text-[10px] leading-4 text-slate-600 sm:text-xs sm:leading-5">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:p-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 sm:text-xs">
              Shortcuts
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Quickly access the most important SkillSwap features.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            <Link
              to="/profile"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 sm:h-11 sm:w-11">
                <User size={18} className="sm:hidden" />
                <User size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Edit Profile
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Update your profile information and skills.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 sm:mt-4 sm:text-xs">
                Manage Profile
                <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/explore"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 sm:h-11 sm:w-11">
                <Users size={18} className="sm:hidden" />
                <Users size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Explore Users
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Discover people who have skills you want to learn.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 sm:mt-4 sm:text-xs">
                Explore
                <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/matches"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 sm:h-11 sm:w-11">
                <GraduationCap size={18} className="sm:hidden" />
                <GraduationCap size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Find Matches
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Find users whose skills match your learning goals.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 sm:mt-4 sm:text-xs">
                Find Matches
                <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/requests"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 sm:h-11 sm:w-11">
                <Clock size={18} className="sm:hidden" />
                <Clock size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Requests
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Review incoming and sent skill swap requests.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 sm:mt-4 sm:text-xs">
                View Requests
                <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/notifications"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 sm:h-11 sm:w-11">
                <Bell size={18} className="sm:hidden" />
                <Bell size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Notifications
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Check your latest requests and messages.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-red-600 sm:mt-4 sm:text-xs">
                View Notifications
                <ArrowRight size={12} />
              </span>
            </Link>

            <Link
              to="/chat"
              className="group rounded-xl border border-slate-200 p-3.5 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 sm:h-11 sm:w-11">
                <MessageCircle size={18} className="sm:hidden" />
                <MessageCircle size={22} className="hidden sm:block" />
              </div>

              <h3 className="mt-3 text-xs font-bold text-slate-800 sm:mt-4 sm:text-sm">
                Chat
              </h3>

              <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">
                Continue conversations with your skill partners.
              </p>

              <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 sm:mt-4 sm:text-xs">
                Open Chat
                <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
