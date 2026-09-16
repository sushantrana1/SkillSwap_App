import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  MapPin,
  GraduationCap,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

import api from "../services/api";

const Matches = () => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestLoading, setRequestLoading] = useState(null);
  const [requestSent, setRequestSent] = useState({});
  const [requestError, setRequestError] = useState("");

  const getMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/matches");

      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Get matches error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load matches. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  const handleSendRequest = async (receiverId) => {
    try {
      setRequestLoading(receiverId);
      setRequestError("");

      await api.post("/requests", {
        receiver: receiverId,
        message:
          "Hi! I think we can exchange skills and learn from each other.",
      });

      setRequestSent((previous) => ({
        ...previous,
        [receiverId]: true,
      }));
    } catch (error) {
      console.error("Send request error:", error);

      setRequestError(
        error.response?.data?.message ||
          "Failed to send request. Please try again.",
      );
    } finally {
      setRequestLoading(null);
    }
  };

  const getScoreStyle = (score) => {
    if (score >= 80) {
      return {
        wrapper: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        label: "Excellent Match",
      };
    }

    if (score >= 60) {
      return {
        wrapper: "bg-blue-50 border-blue-100",
        text: "text-blue-700",
        label: "Strong Match",
      };
    }

    return {
      wrapper: "bg-indigo-50 border-indigo-100",
      text: "text-indigo-700",
      label: "Good Match",
    };
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
            Finding your best matches
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Looking for people who fit your skills...
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
                Your Matches
              </h1>

              <p className="mt-1.5 max-w-2xl text-[10px] leading-4 text-slate-500 sm:text-sm sm:leading-6">
                Find people who can teach you and learn from you.
              </p>
            </div>

            <button
              type="button"
              onClick={getMatches}
              disabled={loading}
              aria-label="Refresh matches"
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

        {/* Request Error */}
        {requestError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:mb-5">
            <p className="text-xs leading-5 text-red-700 sm:text-sm">
              {requestError}
            </p>
          </div>
        )}

        {/* Main Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 sm:mb-7 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-red-800 sm:text-base">
                  Unable to load matches
                </h2>

                <p className="mt-1 text-xs leading-5 text-red-700 sm:text-sm">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={getMatches}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 sm:text-sm"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && matches.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm sm:px-6 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 sm:h-16 sm:w-16">
              <User
                size={26}
                className="text-blue-600 sm:hidden"
              />

              <User
                size={30}
                className="hidden text-blue-600 sm:block"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900 sm:text-xl">
              No matches yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Add skills you can teach and skills you want to learn to find
              people who match with you.
            </p>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:mt-6 sm:px-5 sm:text-sm"
            >
              Update My Skills
              <ArrowRight size={15} />
            </button>
          </section>
        ) : (
          <>
            {/* Result Count */}
            <div className="mb-4 flex items-center justify-between sm:mb-5">
              <p className="text-[11px] text-slate-500 sm:text-sm">
                Found{" "}
                <span className="font-bold text-slate-900">
                  {matches.length}
                </span>{" "}
                potential{" "}
                {matches.length === 1 ? "match" : "matches"}
              </p>
            </div>

            {/* Match Cards */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {matches.map((match) => {
                const profile = match.profile;
                const receiverId = profile.user?._id;
                const scoreStyle = getScoreStyle(match.matchScore);

                return (
                  <article
                    key={profile._id}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Score Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
                          Match Score
                        </p>

                        <p
                          className={`mt-0.5 text-[10px] font-semibold ${scoreStyle.text} sm:text-xs`}
                        >
                          {scoreStyle.label}
                        </p>
                      </div>

                      <div
                        className={`shrink-0 rounded-xl border px-2.5 py-1.5 ${scoreStyle.wrapper}`}
                      >
                        <span
                          className={`text-base font-bold ${scoreStyle.text} sm:text-lg`}
                        >
                          {match.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Profile */}
                    <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">
                      <div className="flex items-center gap-3">
                        {profile.profileImage ? (
                          <img
                            src={profile.profileImage}
                            alt={profile.user?.name || "Profile"}
                            className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100 sm:h-16 sm:w-16"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 sm:h-16 sm:w-16">
                            <User
                              size={25}
                              className="text-blue-600"
                            />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                            {profile.user?.name || "Unknown User"}
                          </h2>

                          <div className="mt-1 flex min-w-0 items-center gap-1 text-[10px] text-slate-500 sm:text-xs">
                            <MapPin
                              size={12}
                              className="shrink-0"
                            />

                            <span className="truncate">
                              {profile.location ||
                                "Location not specified"}
                            </span>
                          </div>

                          {profile.experience && (
                            <p className="mt-1 truncate text-[10px] text-slate-400 sm:text-xs">
                              {profile.experience} experience
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="space-y-4">
                        {/* Can Teach */}
                        <div>
                          <div className="mb-2 flex items-center gap-1.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                              <GraduationCap
                                size={14}
                                className="text-blue-600"
                              />
                            </div>

                            <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                              Can Teach You
                            </h3>
                          </div>

                          {match.skillsTheyCanTeachMe?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {match.skillsTheyCanTeachMe.map((skill) => (
                                <span
                                  key={skill._id}
                                  className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-semibold text-blue-700 sm:text-[10px]"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              No direct teaching match
                            </p>
                          )}
                        </div>

                        {/* Can Learn */}
                        <div>
                          <div className="mb-2 flex items-center gap-1.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                              <BookOpen
                                size={14}
                                className="text-emerald-600"
                              />
                            </div>

                            <h3 className="text-xs font-bold text-slate-800 sm:text-sm">
                              You Can Teach Them
                            </h3>
                          </div>

                          {match.skillsICanTeachThem?.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {match.skillsICanTeachThem.map((skill) => (
                                <span
                                  key={skill._id}
                                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700 sm:text-[10px]"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-400 sm:text-xs">
                              No direct learning match
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/profile/${receiverId}`)
                          }
                          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-[10px] font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:gap-1.5 sm:text-xs"
                        >
                          <span className="truncate">
                            View Profile
                          </span>
                          <ArrowRight
                            size={13}
                            className="shrink-0 sm:h-[14px] sm:w-[14px]"
                          />
                        </button>

                        {requestSent[receiverId] ? (
                          <button
                            type="button"
                            disabled
                            className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 py-2.5 text-[10px] font-semibold text-emerald-700 sm:gap-1.5 sm:text-xs"
                          >
                            <CheckCircle
                              size={13}
                              className="shrink-0 sm:h-[14px] sm:w-[14px]"
                            />

                            <span className="truncate">
                              Request Sent
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleSendRequest(receiverId)
                            }
                            disabled={
                              requestLoading === receiverId
                            }
                            className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-blue-600 px-2 py-2.5 text-[10px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:text-xs"
                          >
                            {requestLoading === receiverId ? (
                              <>
                                <Loader2
                                  size={13}
                                  className="shrink-0 animate-spin sm:h-[14px] sm:w-[14px]"
                                />

                                <span className="truncate">
                                  Sending...
                                </span>
                              </>
                            ) : (
                              <>
                                <Send
                                  size={13}
                                  className="shrink-0 sm:h-[14px] sm:w-[14px]"
                                />

                                <span className="truncate">
                                  Send Request
                                </span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Matches;

