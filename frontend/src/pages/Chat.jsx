import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { useNavigate, useSearchParams } from "react-router-dom";

import { io } from "socket.io-client";

import {
  MessageCircle,
  Send,
  User,
  Loader2,
  RefreshCw,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

import api from "../services/api";

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, loading: authLoading } = useAuth();

  const socketRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const selectedConversationRef = useRef(null);
  const shouldScrollToBottomRef = useRef(false);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [chatError, setChatError] = useState("");

  const getConversations = async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const response = await api.get("/chat/conversations");

      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error("Get conversations error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load conversations. Please try again.",
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  const getMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      setChatError("");

      const response = await api.get(
        `/chat/conversation/${conversationId}/messages`,
      );

      setMessages(response.data.messages || []);

      shouldScrollToBottomRef.current = true;
    } catch (error) {
      console.error("Get messages error:", error);

      setChatError(
        error.response?.data?.message ||
          "Failed to load messages. Please try again.",
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollMessagesToBottom = (behavior = "auto") => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  };

  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  /*
   * Socket connection.
   *
   * IMPORTANT:
   * selectedConversation is NOT a dependency here.
   * This prevents the socket from disconnecting/reconnecting
   * every time the user changes conversations.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      navigate("/login");
      return;
    }

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth: {
          token: currentToken,
        },
        transports: ["polling", "websocket"],
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      setChatError("");

      /*
       * If a conversation was already selected and the socket
       * reconnects, join that conversation again.
       */
      const currentConversation =
        selectedConversationRef.current;

      if (currentConversation?._id) {
        socket.emit(
          "joinConversation",
          currentConversation._id,
        );
      }
    });

    socket.on("receiveMessage", (message) => {
      const currentConversation =
        selectedConversationRef.current;

      const isCurrentConversation =
        currentConversation?._id === message.conversation;

      const container = messagesContainerRef.current;

      let isNearBottom = true;

      if (container) {
        const distanceFromBottom =
          container.scrollHeight -
          container.scrollTop -
          container.clientHeight;

        isNearBottom = distanceFromBottom < 120;
      }

      setMessages((previous) => {
        const exists = previous.some(
          (item) => item._id === message._id,
        );

        if (exists) {
          return previous;
        }

        /*
         * Only add the message to the currently opened
         * conversation.
         */
        if (!isCurrentConversation) {
          return previous;
        }

        return [...previous, message];
      });

      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation._id === message.conversation) {
            return {
              ...conversation,
              lastMessage: message,
              updatedAt: message.createdAt,
            };
          }

          return conversation;
        }),
      );

      /*
       * Stop the sending spinner immediately when the server
       * confirms the message.
       */
      if (isCurrentConversation) {
        setSending(false);

        if (
          message.sender?._id === user?._id ||
          isNearBottom
        ) {
          shouldScrollToBottomRef.current = true;
        }
      }
    });

    socket.on("conversationJoined", (data) => {
      console.log("Joined conversation:", data.conversationId);

      setChatError("");
    });

    socket.on("chatError", (data) => {
      console.error("Chat error:", data.message);

      setChatError(
        data.message || "Something went wrong with chat.",
      );

      setSending(false);
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message,
      );

      setChatError(
        "Unable to connect to chat. Please refresh the page and try again.",
      );

      setSending(false);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      getConversations();
    }
  }, [authLoading, user]);

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    selectedConversationRef.current = conversation;

    setMessages([]);
    setChatError("");

    shouldScrollToBottomRef.current = true;

    await getMessages(conversation._id);

    if (
      socketRef.current &&
      socketRef.current.connected
    ) {
      socketRef.current.emit(
        "joinConversation",
        conversation._id,
      );
    } else {
      setChatError(
        "Chat connection is not available. Please refresh the page.",
      );
    }
  };

  useEffect(() => {
    const conversationId =
      searchParams.get("conversationId");

    if (
      !conversationId ||
      loadingConversations ||
      conversations.length === 0
    ) {
      return;
    }

    const conversation = conversations.find(
      (item) => item._id === conversationId,
    );

    if (!conversation) {
      setChatError("Conversation could not be found.");
      return;
    }

    if (
      selectedConversationRef.current?._id ===
      conversation._id
    ) {
      return;
    }

    handleSelectConversation(conversation);
  }, [
    searchParams,
    loadingConversations,
    conversations,
  ]);

  /*
   * Scroll only the internal message container.
   */
  useEffect(() => {
    if (!shouldScrollToBottomRef.current) {
      return;
    }

    if (loadingMessages) {
      return;
    }

    const timer = setTimeout(() => {
      scrollMessagesToBottom("auto");

      shouldScrollToBottomRef.current = false;
    }, 30);

    return () => clearTimeout(timer);
  }, [messages, loadingMessages]);

  const handleSendMessage = (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text || !selectedConversation) {
      return;
    }

    if (
      !socketRef.current ||
      !socketRef.current.connected
    ) {
      setChatError(
        "Chat connection is not available. Please refresh the page.",
      );

      return;
    }

    setSending(true);
    setChatError("");

    /*
     * Keep the input cleared immediately.
     */
    setMessageText("");

    /*
     * The server will return receiveMessage.
     */
    socketRef.current.emit("sendMessage", {
      conversationId: selectedConversation._id,
      text,
    });
  };

  const handleMobileBack = () => {
    setSelectedConversation(null);
    selectedConversationRef.current = null;

    setMessages([]);
    setChatError("");
    setMessageText("");

    /*
     * Remove conversationId from the URL on mobile.
     */
    navigate("/chat", {
      replace: true,
    });
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation?.participants || !user?._id) {
      return null;
    }

    return conversation.participants.find(
      (participant) => participant._id !== user._id,
    );
  };

  const getInitial = (name) => {
    if (!name) {
      return "U";
    }

    return name.charAt(0).toUpperCase();
  };

  const formatMessageTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ProfileAvatar = ({
    person,
    size = "md",
    className = "",
  }) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      sm: "h-8 w-8 text-[10px]",
      md: "h-10 w-10 text-xs",
      lg: "h-11 w-11 text-sm",
    };

    const iconSizes = {
      sm: 14,
      md: 17,
      lg: 19,
    };

    const image =
      person?.profileImage ||
      person?.profile?.profileImage ||
      "";

    const showImage = image && !imageError;

    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-sm ${sizeClasses[size]} ${className}`}
      >
        {showImage ? (
          <img
            src={image}
            alt={person?.name || "User"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : person?.name ? (
          getInitial(person.name)
        ) : (
          <User size={iconSizes[size]} />
        )}
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <Loader2
            size={27}
            className="animate-spin text-blue-600"
          />

          <p className="text-xs sm:text-sm">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }
if (loadingConversations) {
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
          Loading your conversations
        </h2>

        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Getting your messages ready...
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <section className="mb-5 sm:mb-7">
          <div className="flex items-center justify-between gap-3 sm:items-end">
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                <Sparkles size={11} />
                Skill Matching
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                Messages
              </h1>

              <p className="mt-1.5 max-w-2xl text-[10px] leading-4 text-slate-500 sm:text-sm sm:leading-6">
                Chat with your skill swap partners
              </p>
            </div>

            <button
              type="button"
              onClick={getConversations}
              disabled={loadingConversations}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-[10px] font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-3.5 sm:py-2.5 sm:text-xs md:text-sm"
            >
              <RefreshCw
                size={12}
                className={
                  loadingConversations
                    ? "animate-spin sm:h-3.5 sm:w-3.5"
                    : "sm:h-3.5 sm:w-3.5"
                }
              />

              {loadingConversations
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </section>

        {/* Main Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 sm:mb-5 sm:p-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-4 text-red-700 sm:text-sm">
                {error}
              </p>

              <button
                type="button"
                onClick={getConversations}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-red-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Fixed Chat Window */}
        <div className="grid h-[calc(100dvh-165px)] min-h-[480px] max-h-[720px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:h-[calc(100dvh-190px)] md:min-h-[540px]">
          <div className="grid min-h-0 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">

            {/* Conversation List */}
            <div
              className={`${
                selectedConversation
                  ? "hidden md:flex"
                  : "flex"
              } min-h-0 min-w-0 flex-col border-r border-slate-200 bg-white`}
            >
              <div className="shrink-0 border-b border-slate-200 px-3.5 py-3.5 sm:px-5 sm:py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                      Conversations
                    </h2>

                    <p className="mt-0.5 text-[9px] text-gray-500 sm:text-xs">
                      {conversations.length}{" "}
                      {conversations.length === 1
                        ? "conversation"
                        : "conversations"}
                    </p>
                  </div>

                  <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-50 px-2 text-[9px] font-bold text-blue-600 sm:h-8 sm:min-w-8 sm:text-[10px]">
                    {conversations.length}
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl">
                      <MessageCircle
                        size={22}
                        className="text-blue-600 sm:h-7 sm:w-7"
                      />
                    </div>

                    <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">
                      No conversations
                    </h3>

                    <p className="mt-1.5 max-w-[220px] text-[10px] leading-4 text-gray-500 sm:text-sm sm:leading-5">
                      Accept a skill swap request to start
                      chatting.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/requests")}
                      className="mt-3 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-blue-700 sm:mt-4 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      View Requests
                    </button>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const otherUser =
                      getOtherParticipant(conversation);

                    const isSelected =
                      selectedConversation?._id ===
                      conversation._id;

                    return (
                      <button
                        key={conversation._id}
                        type="button"
                        onClick={() =>
                          handleSelectConversation(
                            conversation,
                          )
                        }
                        className={`group flex w-full items-center gap-2.5 border-b border-slate-100 px-3 py-3 text-left transition sm:gap-3 sm:px-4 sm:py-4 ${
                          isSelected
                            ? "bg-blue-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <ProfileAvatar
                          person={otherUser}
                          size="md"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-[11px] font-bold text-gray-900 sm:text-sm">
                              {otherUser?.name || "User"}
                            </h3>

                            {conversation.lastMessage
                              ?.createdAt && (
                              <span className="shrink-0 text-[8px] text-gray-400 sm:text-[9px]">
                                {formatMessageTime(
                                  conversation.lastMessage
                                    .createdAt,
                                )}
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[9px] text-gray-500 sm:mt-1 sm:text-xs">
                            {conversation.lastMessage
                              ?.text ||
                              "Start a conversation"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat */}
            <div
              className={`${
                selectedConversation
                  ? "flex"
                  : "hidden md:flex"
              } min-h-0 min-w-0 flex-col bg-white`}
            >
              {!selectedConversation ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 sm:mb-5 sm:h-16 sm:w-16">
                    <MessageCircle
                      size={27}
                      className="text-blue-600 sm:h-8 sm:w-8"
                    />
                  </div>

                  <h2 className="text-sm font-semibold text-gray-900 sm:text-lg">
                    Select a conversation
                  </h2>

                  <p className="mt-1.5 max-w-sm text-[10px] leading-4 text-gray-500 sm:text-sm sm:leading-6">
                    Choose a conversation from the left to
                    start chatting with your skill swap partner.
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="flex min-h-[62px] shrink-0 items-center gap-2.5 border-b border-slate-200 bg-white px-3.5 py-3 sm:min-h-[72px] sm:gap-3 sm:px-5 sm:py-4">
                    {(() => {
                      const otherUser =
                        getOtherParticipant(
                          selectedConversation,
                        );

                      return (
                        <>
                          <ProfileAvatar
                            person={otherUser}
                            size="lg"
                          />

                          <div className="min-w-0 flex-1">
                            <h2 className="truncate text-xs font-bold text-gray-900 sm:text-base">
                              {otherUser?.name || "User"}
                            </h2>

                            <div className="mt-0.5 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                              <p className="text-[9px] text-gray-500 sm:text-xs">
                                Skill Swap Partner
                              </p>
                            </div>
                          </div>

                          {/* Mobile Back Button */}
                          <button
                            type="button"
                            onClick={handleMobileBack}
                            className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[9px] font-semibold text-gray-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600 md:hidden"
                          >
                            <ChevronLeft size={13} />

                            <span>Back</span>
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Chat Error */}
                  {chatError && (
                    <div className="shrink-0 border-b border-red-200 bg-red-50 px-3 py-2.5 sm:px-5 sm:py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 text-[10px] leading-4 text-red-700 sm:text-sm">
                          {chatError}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            getMessages(
                              selectedConversation._id,
                            )
                          }
                          className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-red-700 hover:text-red-900 sm:gap-2 sm:text-xs"
                        >
                          <RefreshCw size={11} />
                          Retry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={messagesContainerRef}
                    className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-50 px-3 py-4 sm:px-5 sm:py-5"
                  >
                    {loadingMessages ? (
                      <div className="flex min-h-full items-center justify-center">
                        <div className="flex flex-col items-center gap-2.5 text-gray-500 sm:gap-3">
                          <Loader2
                            size={23}
                            className="animate-spin text-blue-600 sm:h-7 sm:w-7"
                          />

                          <p className="text-[10px] sm:text-sm">
                            Loading messages...
                          </p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex min-h-full flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl">
                          <MessageCircle
                            size={22}
                            className="text-gray-300 sm:h-7 sm:w-7"
                          />
                        </div>

                        <p className="mt-2 text-[10px] font-medium text-gray-500 sm:mt-3 sm:text-sm">
                          No messages yet.
                        </p>

                        <p className="mt-0.5 text-[9px] text-gray-400 sm:mt-1 sm:text-xs">
                          Send the first message.
                        </p>
                      </div>
                    ) : (
                      <div className="flex min-h-full flex-col justify-end">
                        <div className="space-y-2.5 sm:space-y-3">
                          {messages.map((message) => {
                            const isMine =
                              message.sender?._id ===
                              user?._id;

                            return (
                              <div
                                key={message._id}
                                className={`flex ${
                                  isMine
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-[86%] px-3 py-2 sm:max-w-[72%] sm:px-4 sm:py-3 ${
                                    isMine
                                      ? "rounded-2xl rounded-br-md bg-blue-600 text-white shadow-sm"
                                      : "rounded-2xl rounded-bl-md border border-slate-200 bg-white text-gray-900 shadow-sm"
                                  }`}
                                >
                                  <p className="break-words text-[11px] leading-4 sm:text-sm sm:leading-6">
                                    {message.text}
                                  </p>

                                  <p
                                    className={`mt-1 text-[8px] sm:text-[10px] ${
                                      isMine
                                        ? "text-blue-100"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    {formatMessageTime(
                                      message.createdAt,
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Composer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="shrink-0 border-t border-slate-200 bg-white px-2.5 py-2.5 sm:p-4"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(event) =>
                          setMessageText(event.target.value)
                        }
                        placeholder="Type a message..."
                        maxLength={2000}
                        disabled={sending}
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[11px] outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                      />

                      <button
                        type="submit"
                        disabled={
                          sending || !messageText.trim()
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12 sm:rounded-xl"
                      >
                        {sending ? (
                          <Loader2
                            size={15}
                            className="animate-spin sm:h-[19px] sm:w-[19px]"
                          />
                        ) : (
                          <Send
                            size={15}
                            className="sm:h-[19px] sm:w-[19px]"
                          />
                        )}
                      </button>
                    </div>

                    <div className="mt-1 text-right text-[8px] text-gray-400 sm:mt-2 sm:text-[11px]">
                      {messageText.length}/2000
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;