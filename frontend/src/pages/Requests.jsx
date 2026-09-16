import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Check,
  X,
  ArrowRight,
  RefreshCw,
  Inbox,
  Send,
  MessageCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

const Requests = () => {
  const navigate = useNavigate();

  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const getRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const [receivedResponse, sentResponse] = await Promise.all([
        api.get("/requests/received"),
        api.get("/requests/sent"),
      ]);

      setReceivedRequests(receivedResponse.data.requests || []);
      setSentRequests(sentResponse.data.requests || []);
    } catch (error) {
      console.error("Get requests error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load requests. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const handleChat = async (userId) => {
    try {
      setActionLoading(`chat-${userId}`);
      setError("");

      const response = await api.post("/chat/conversation", {
        userId,
      });

      const conversation = response.data.conversation;

      if (!conversation?._id) {
        throw new Error("Conversation was not returned");
      }

      navigate(`/chat?conversationId=${conversation._id}`);
    } catch (error) {
      console.error("Open conversation error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to open conversation. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = async (requestId, senderId) => {
    try {
      setActionLoading(requestId);
      setError("");

      await api.patch(`/requests/${requestId}/accept`);

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "accepted",
              }
            : request,
        ),
      );

      const conversationResponse = await api.post("/chat/conversation", {
        userId: senderId,
      });

      const conversation = conversationResponse.data.conversation;

      if (!conversation?._id) {
        throw new Error("Conversation was not returned");
      }

      navigate(`/chat?conversationId=${conversation._id}`);
    } catch (error) {
      console.error("Accept request error:", error);

      setError(
        error.response?.data?.message ||
          "Request was accepted, but chat could not be opened.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setActionLoading(requestId);
      setError("");

      await api.patch(`/requests/${requestId}/reject`);

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "rejected",
              }
            : request,
        ),
      );
    } catch (error) {
      console.error("Reject request error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to reject request. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "accepted") {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (status === "rejected") {
      return "border-red-100 bg-red-50 text-red-700";
    }

    return "border-amber-100 bg-amber-50 text-amber-700";
  };

  const getProfileImage = (person) => {
    if (!person) return "";

    return (
      person.profileImage ||
      person.profile?.profileImage ||
      person.avatar ||
      person.image ||
      person.photo ||
      ""
    );
  };

  const ProfileAvatar = ({
    person,
    fallbackColor = "blue",
  }) => {
    const image = getProfileImage(person);

    const fallbackClass =
      fallbackColor === "emerald"
        ? "bg-emerald-50 text-emerald-600"
        : "bg-blue-50 text-blue-600";

    return (
      <div
        className={`h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl ${
          image ? "bg-slate-100" : fallbackClass
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={person?.name || "User"}
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.parentElement.classList.add(
                "flex",
                "items-center",
                "justify-center",
                fallbackClass.split(" ")[0],
              );
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User
              size={21}
              className={`sm:h-[26px] sm:w-[26px] ${
                fallbackColor === "emerald"
                  ? "text-emerald-600"
                  : "text-blue-600"
              }`}
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
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
            Loading requests
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Getting your skill exchange requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">
        <section className="mb-5 sm:mb-7">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                <Sparkles size={11} />
                Skill Exchange
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                Requests
              </h1>

              <p className="mt-1.5 max-w-2xl text-[10px] leading-4 text-slate-500 sm:text-sm sm:leading-6">
                Manage your skill exchange requests and connect with people.
              </p>
            </div>

            <button
              type="button"
              onClick={getRequests}
              disabled={loading}
              aria-label="Refresh requests"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <RefreshCw
                size={12}
                className={`sm:h-[15px] sm:w-[15px] ${
                  loading ? "animate-spin" : ""
                }`}
              />

              <span className="sm:hidden">
                {loading ? "..." : "Refresh"}
              </span>

              <span className="hidden sm:inline">
                {loading ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-3.5 sm:mb-8 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-5 text-red-700 sm:text-sm">
                {error}
              </p>

              <button
                type="button"
                onClick={getRequests}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-red-700 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          </div>
        )}

        <section className="mb-8 sm:mb-12">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 sm:h-11 sm:w-11">
              <Inbox
                size={18}
                className="text-blue-600 sm:h-5 sm:w-5"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-blue-700 sm:text-xl">
                  Incoming Requests
                </h2>

                {receivedRequests.length > 0 && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 sm:px-2 sm:text-[10px]">
                    {receivedRequests.length}
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-sm">
                People who want to exchange skills with you.
              </p>
            </div>
          </div>

          {receivedRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-6 sm:py-14">
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-slate-50 sm:h-14 sm:w-14">
                <Inbox
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800 sm:text-base">
                No incoming requests
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-500 sm:text-sm">
                You don't have any skill exchange requests yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {receivedRequests.map((request) => {
                const sender = request.sender;
                const isLoading = actionLoading === request._id;

                return (
                  <article
                    key={request._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-blue-100 hover:shadow-md"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <ProfileAvatar
                            person={sender}
                            fallbackColor="blue"
                          />

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-lg">
                              {sender?.name || "Unknown User"}
                            </h3>

                            <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-sm">
                              {sender?.email || ""}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold capitalize sm:px-3 sm:py-1.5 sm:text-xs ${getStatusStyle(
                            request.status,
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {request.message && (
                        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 sm:mt-5 sm:px-4 sm:py-3.5">
                          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                            <MessageCircle size={11} />
                            Message
                          </div>

                          <p className="text-[10px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
                            "{request.message}"
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-1.5 sm:mt-5 sm:gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/profile/${sender?._id}`)
                          }
                          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-[9px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:gap-2 sm:rounded-xl sm:px-3 sm:text-xs"
                        >
                          <span className="truncate">
                            View Profile
                          </span>

                          <ArrowRight
                            size={12}
                            className="shrink-0 sm:h-4 sm:w-4"
                          />
                        </button>

                        {request.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleAccept(
                                  request._id,
                                  sender?._id,
                                )
                              }
                              disabled={isLoading}
                              className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
                            >
                              {isLoading ? (
                                <Loader2
                                  size={12}
                                  className="shrink-0 animate-spin sm:h-4 sm:w-4"
                                />
                              ) : (
                                <Check
                                  size={12}
                                  className="shrink-0 sm:h-4 sm:w-4"
                                />
                              )}

                              <span className="truncate">
                                {isLoading ? "Accepting" : "Accept"}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReject(request._id)
                              }
                              disabled={isLoading}
                              className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
                            >
                              {isLoading ? (
                                <Loader2
                                  size={12}
                                  className="shrink-0 animate-spin sm:h-4 sm:w-4"
                                />
                              ) : (
                                <X
                                  size={12}
                                  className="shrink-0 sm:h-4 sm:w-4"
                                />
                              )}

                              <span className="truncate">
                                {isLoading ? "Rejecting" : "Reject"}
                              </span>
                            </button>
                          </>
                        )}

                        {request.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChat(sender?._id)
                            }
                            disabled={
                              actionLoading ===
                              `chat-${sender?._id}`
                            }
                            className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
                          >
                            {actionLoading ===
                            `chat-${sender?._id}` ? (
                              <Loader2
                                size={12}
                                className="shrink-0 animate-spin sm:h-4 sm:w-4"
                              />
                            ) : (
                              <MessageCircle
                                size={12}
                                className="shrink-0 sm:h-4 sm:w-4"
                              />
                            )}

                            <span className="truncate">
                              {actionLoading ===
                              `chat-${sender?._id}`
                                ? "Opening"
                                : "Chat"}
                            </span>
                          </button>
                        )}

                        {request.status === "rejected" && (
                          <div className="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-red-50 px-2 py-2.5 text-[9px] font-semibold text-red-600 sm:rounded-xl sm:text-xs">
                            Request Declined
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 sm:h-11 sm:w-11">
              <Send
                size={18}
                className="text-emerald-600 sm:h-5 sm:w-5"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-blue-700 sm:text-xl">
                  Sent Requests
                </h2>

                {sentRequests.length > 0 && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 sm:px-2 sm:text-[10px]">
                    {sentRequests.length}
                  </span>
                )}
              </div>

              <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-sm">
                Requests you have sent to other users.
              </p>
            </div>
          </div>

          {sentRequests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm sm:px-6 sm:py-14">
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-slate-50 sm:h-14 sm:w-14">
                <Send
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 text-sm font-bold text-slate-800 sm:text-base">
                No sent requests
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-[10px] leading-5 text-slate-500 sm:text-sm">
                You haven't sent any skill exchange requests yet.
              </p>

              <button
                type="button"
                onClick={() => navigate("/explore")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:mt-5 sm:px-5 sm:text-sm"
              >
                Explore People
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sentRequests.map((request) => {
                const receiver = request.receiver;

                return (
                  <article
                    key={request._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:border-emerald-100 hover:shadow-md"
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <ProfileAvatar
                            person={receiver}
                            fallbackColor="emerald"
                          />

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 sm:text-lg">
                              {receiver?.name || "Unknown User"}
                            </h3>

                            <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-sm">
                              {receiver?.email || ""}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold capitalize sm:px-3 sm:py-1.5 sm:text-xs ${getStatusStyle(
                            request.status,
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      {request.message && (
                        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 sm:mt-5 sm:px-4 sm:py-3.5">
                          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">
                            <MessageCircle size={11} />
                            Message
                          </div>

                          <p className="text-[10px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
                            "{request.message}"
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-1.5 sm:mt-5 sm:gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/profile/${receiver?._id}`,
                            )
                          }
                          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-[9px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:gap-2 sm:rounded-xl sm:px-3 sm:text-xs"
                        >
                          <span className="truncate">
                            View Profile
                          </span>

                          <ArrowRight
                            size={12}
                            className="shrink-0 sm:h-4 sm:w-4"
                          />
                        </button>

                        {request.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleChat(receiver?._id)
                            }
                            disabled={
                              actionLoading ===
                              `chat-${receiver?._id}`
                            }
                            className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-2.5 text-[9px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:rounded-xl sm:px-3 sm:text-xs"
                          >
                            {actionLoading ===
                            `chat-${receiver?._id}` ? (
                              <Loader2
                                size={12}
                                className="shrink-0 animate-spin sm:h-4 sm:w-4"
                              />
                            ) : (
                              <MessageCircle
                                size={12}
                                className="shrink-0 sm:h-4 sm:w-4"
                              />
                            )}

                            <span className="truncate">
                              {actionLoading ===
                              `chat-${receiver?._id}`
                                ? "Opening"
                                : "Chat"}
                            </span>
                          </button>
                        )}

                        {request.status === "pending" && (
                          <div className="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-amber-50 px-2 py-2.5 text-[9px] font-semibold text-amber-700 sm:rounded-xl sm:text-xs">
                            Waiting
                          </div>
                        )}

                        {request.status === "rejected" && (
                          <div className="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-red-50 px-2 py-2.5 text-[9px] font-semibold text-red-600 sm:rounded-xl sm:text-xs">
                            Declined
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Requests;

