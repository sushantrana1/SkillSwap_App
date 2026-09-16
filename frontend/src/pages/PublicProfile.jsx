import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  User,
  Send,
  CheckCircle,
  Loader2,
  Sparkles,
  GraduationCap,
  BookOpen,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

const PublicProfile = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState("");

  const getPublicProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await api.get(`/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.profile);
    } catch (error) {
      console.error("Get public profile error:", error);

      setError(
        error.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPublicProfile();
  }, [userId]);

  const handleSendRequest = async () => {
    try {
      setRequestLoading(true);
      setRequestError("");

      const token = localStorage.getItem("token");

      await api.post(
        "/requests",
        {
          receiver: userId,
          message:
            "Hi! I'd like to exchange skills and learn from each other.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRequestSent(true);
    } catch (error) {
      console.error("Send request error:", error);

      setRequestError(
        error.response?.data?.message ||
          "Failed to send request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  const getInitial = () => {
    const name = profile?.user?.name;

    if (!name) return "U";

    return name.charAt(0).toUpperCase();
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
          <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2
                size={26}
                className="animate-spin text-blue-600"
              />
            </div>

            <h2 className="text-base font-semibold text-slate-900">
              Loading profile
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Please wait while we load this SkillSwap profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <User size={26} />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Profile unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              <ArrowLeft size={17} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-72 overflow-hidden">
        <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Back */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600 hover:shadow-sm"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back
          </Link>
        </div>

        {/* Main Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left">
              {/* Avatar */}
              <div className="relative shrink-0">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile?.user?.name || "Profile"}
                    className="h-28 w-28 rounded-3xl border-4 border-white/90 object-cover shadow-xl sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white/90 bg-white/15 text-white shadow-xl backdrop-blur-sm sm:h-32 sm:w-32">
                    <span className="text-4xl font-bold">
                      {getInitial()}
                    </span>
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-blue-600 bg-emerald-500 text-white shadow-md">
                  <ShieldCheck size={16} />
                </div>
              </div>

              {/* User Info */}
              <div className="mt-6 min-w-0 sm:ml-7 sm:mt-0">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <Sparkles size={13} />
                  SkillSwap Member
                </div>

                <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {profile?.user?.name || "SkillSwap Member"}
                </h1>

                {profile?.user?.email && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
                    <Mail size={15} />
                    <span className="break-all">
                      {profile.user.email}
                    </span>
                  </div>
                )}

                {profile?.location && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-blue-100 sm:justify-start">
                    <MapPin size={15} />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Content */}
          <div className="p-5 sm:p-7 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:gap-10">
              {/* Left Content */}
              <div className="min-w-0 space-y-8">
                {/* About */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <User size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        About
                      </h2>

                      <p className="text-xs text-slate-500">
                        A little about this member
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {profile?.bio ||
                        "This user has not added a bio yet."}
                    </p>
                  </div>
                </section>

                {/* Quick Info */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-slate-900">
                      Profile Information
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Learn more about how they prefer to exchange skills.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Location */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50/30">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                          <MapPin size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Location
                          </p>

                          <p className="mt-1 break-words text-sm font-medium text-slate-700">
                            {profile?.location || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-violet-200 hover:bg-violet-50/30">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                          <Briefcase size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Experience
                          </p>

                          <p className="mt-1 break-words text-sm font-medium text-slate-700">
                            {profile?.experience || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30 sm:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                          <Clock size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Availability
                          </p>

                          <p className="mt-1 break-words text-sm font-medium leading-6 text-slate-700">
                            {profile?.availability ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Skills to Teach */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <GraduationCap size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Skills They Can Teach
                      </h2>

                      <p className="text-xs text-slate-500">
                        Knowledge they can share with others
                      </p>
                    </div>
                  </div>

                  {profile?.skillsToTeach?.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.skillsToTeach.map((skill) => (
                        <span
                          key={skill._id}
                          className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                      No teaching skills have been added yet.
                    </div>
                  )}
                </section>

                {/* Skills to Learn */}
                <section>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BookOpen size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Skills They Want to Learn
                      </h2>

                      <p className="text-xs text-slate-500">
                        Skills they are interested in learning
                      </p>
                    </div>
                  </div>

                  {profile?.skillsToLearn?.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {profile.skillsToLearn.map((skill) => (
                        <span
                          key={skill._id}
                          className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-100"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                      No learning skills have been added yet.
                    </div>
                  )}
                </section>
              </div>

              {/* Right Action Panel */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="mb-5">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
                      <MessageCircle size={20} />
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      Start a Skill Swap
                    </h2>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      Connect with {profile?.user?.name || "this member"} and
                      exchange knowledge with each other.
                    </p>
                  </div>

                  {requestError && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                      {requestError}
                    </div>
                  )}

                  {requestSent ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckCircle size={18} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-emerald-800">
                            Request sent
                          </p>

                          <p className="mt-1 text-xs leading-5 text-emerald-700">
                            Your skill swap request has been sent successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendRequest}
                      disabled={requestLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md"
                    >
                      {requestLoading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Skill Swap Request
                        </>
                      )}
                    </button>
                  )}

                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3 text-xs leading-5 text-slate-500">
                    <ShieldCheck
                      size={15}
                      className="mt-0.5 shrink-0 text-emerald-500"
                    />
                    <span>
                      SkillSwap helps members connect and exchange knowledge
                      with each other.
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Bottom Back */}
        <div className="mt-6 flex justify-center sm:mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-blue-600 hover:shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to SkillSwap
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PublicProfile;