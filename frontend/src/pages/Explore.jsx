import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Briefcase,
  BookOpen,
  GraduationCap,
  User,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";

import api from "../services/api";

const Explore = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    teach: "",
    learn: "",
    location: "",
    experience: "",
  });

  const getProfiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/explore", {
        params: {
          teach: filters.teach || undefined,
          learn: filters.learn || undefined,
          location: filters.location || undefined,
          experience: filters.experience || undefined,
        },
      });

      setProfiles(response.data.profiles || []);
    } catch (error) {
      console.error("Explore error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profiles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfiles();
  }, []);

  const handleChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    getProfiles();
  };

  const handleClear = () => {
    const emptyFilters = {
      teach: "",
      learn: "",
      location: "",
      experience: "",
    };

    setFilters(emptyFilters);

    setTimeout(() => {
      getProfiles();
    }, 0);
  };

  const hasFilters = Object.values(filters).some(
    (value) => value.trim() !== ""
  );

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
            Finding skill partners
          </h2>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Looking for people who match your skills...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 sm:px-5 sm:py-7 md:px-8 md:py-9">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <section className="mb-5 sm:mb-7">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                <Sparkles size={11} />
                Skill Community
              </div>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
                Explore SkillSwap
              </h1>

              <p className="mt-1.5 max-w-2xl text-[10px] leading-4 text-slate-500 sm:text-sm sm:leading-6">
                Discover people who can teach what you want to learn and learn
                from what you already know.
              </p>
            </div>

            <div className="hidden shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-right shadow-sm sm:block">
              <p className="text-[10px] font-medium text-slate-400">
                Available
              </p>

              <p className="text-lg font-bold text-slate-900">
                {profiles.length}
              </p>

              <p className="text-[10px] text-slate-400">
                {profiles.length === 1 ? "profile" : "profiles"}
              </p>
            </div>
          </div>
        </section>

        {/* Search / Filters */}
        <form
          onSubmit={handleSearch}
          className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mb-7"
        >
          <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:h-9 sm:w-9 sm:rounded-xl">
                  <SlidersHorizontal
                    size={15}
                    className="text-blue-600"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                    Find Skill Partners
                  </h2>

                  <p className="hidden text-[10px] text-slate-400 sm:block">
                    Filter people by skills, location, and experience
                  </p>
                </div>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[9px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 sm:px-3 sm:text-xs"
                >
                  <X size={11} />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Can Teach */}
              <div>
                <label
                  htmlFor="teach"
                  className="mb-1.5 block text-[10px] font-semibold text-slate-600 sm:text-xs"
                >
                  Can Teach
                </label>

                <div className="relative">
                  <GraduationCap
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="teach"
                    type="text"
                    name="teach"
                    value={filters.teach}
                    onChange={handleChange}
                    placeholder="e.g. React"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:py-3 sm:text-xs"
                  />
                </div>
              </div>

              {/* Wants to Learn */}
              <div>
                <label
                  htmlFor="learn"
                  className="mb-1.5 block text-[10px] font-semibold text-slate-600 sm:text-xs"
                >
                  Wants to Learn
                </label>

                <div className="relative">
                  <BookOpen
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="learn"
                    type="text"
                    name="learn"
                    value={filters.learn}
                    onChange={handleChange}
                    placeholder="e.g. TypeScript"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:py-3 sm:text-xs"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-[10px] font-semibold text-slate-600 sm:text-xs"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="e.g. Kathmandu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:py-3 sm:text-xs"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="mb-1.5 block text-[10px] font-semibold text-slate-600 sm:text-xs"
                >
                  Experience
                </label>

                <div className="relative">
                  <Briefcase
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    value={filters.experience}
                    onChange={handleChange}
                    placeholder="e.g. Intermediate"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[11px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:py-3 sm:text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Search Buttons */}
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-6 sm:text-xs"
              >
                <Search size={14} />
                Search Partners
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading || !hasFilters}
                className="flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 sm:mb-6 sm:p-4">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-red-800 sm:text-xs">
                  Something went wrong
                </p>

                <p className="mt-0.5 text-[9px] leading-4 text-red-600 sm:text-xs">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={getProfiles}
                disabled={loading}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-[9px] font-semibold text-white transition hover:bg-red-700 disabled:opacity-60 sm:px-4 sm:text-xs"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="mb-3.5 flex items-center justify-between gap-3 sm:mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Search
                size={14}
                className="shrink-0 text-blue-600 sm:h-4 sm:w-4"
              />

              <h2 className="truncate text-sm font-bold text-slate-900 sm:text-lg">
                Skill Partners
              </h2>
            </div>

            <p className="mt-0.5 text-[9px] text-slate-400 sm:text-xs">
              People you can learn from and teach
            </p>
          </div>

          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-500 sm:px-3 sm:text-xs">
            {profiles.length}{" "}
            {profiles.length === 1 ? "profile" : "profiles"}
          </span>
        </div>

        {/* Empty State */}
        {profiles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:px-6 sm:py-20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 sm:h-16 sm:w-16">
              <Search
                size={21}
                className="text-blue-600 sm:h-7 sm:w-7"
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900 sm:text-lg">
              No skill partners found
            </h3>

            <p className="mx-auto mt-1.5 max-w-md text-[9px] leading-4 text-slate-500 sm:mt-2 sm:text-xs sm:leading-5">
              Try adjusting your filters or search for another skill,
              location, or experience level.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-[9px] font-semibold text-white transition hover:bg-blue-700 sm:text-xs"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Profile Grid */
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {profiles.map((profile) => (
              <article
                key={profile._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg"
              >
                {/* Profile Header */}
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">
                  <div className="flex items-center gap-3">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.user?.name || "Profile"}
                        className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-slate-100 sm:h-14 sm:w-14"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 ring-2 ring-slate-100 sm:h-14 sm:w-14">
                        <User
                          size={22}
                          className="text-blue-600 sm:h-6 sm:w-6"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {profile.user?.name || "Unknown User"}
                      </h3>

                      <div className="mt-1 flex min-w-0 items-center gap-1 text-[9px] text-slate-500 sm:text-xs">
                        <MapPin
                          size={11}
                          className="shrink-0 text-slate-400 sm:h-3.5 sm:w-3.5"
                        />

                        <span className="truncate">
                          {profile.location || "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {/* Bio */}
                  <p className="line-clamp-3 min-h-[42px] text-[10px] leading-4 text-slate-500 sm:min-h-[54px] sm:text-xs sm:leading-5">
                    {profile.bio || "No bio available."}
                  </p>

                  {/* Skills to Teach */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50">
                        <GraduationCap
                          size={12}
                          className="text-blue-600"
                        />
                      </div>

                      <h4 className="text-[10px] font-bold text-slate-800 sm:text-xs">
                        Can Teach
                      </h4>
                    </div>

                    {profile.skillsToTeach?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsToTeach.slice(0, 6).map((skill) => (
                          <span
                            key={skill._id}
                            className="rounded-full bg-blue-50 px-2 py-1 text-[8px] font-semibold text-blue-700 sm:px-2.5 sm:text-[10px]"
                          >
                            {skill.name}
                          </span>
                        ))}

                        {profile.skillsToTeach.length > 6 && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500 sm:px-2.5 sm:text-[10px]">
                            +{profile.skillsToTeach.length - 6}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[9px] text-slate-400 sm:text-[10px]">
                        No skills added
                      </p>
                    )}
                  </div>

                  {/* Skills to Learn */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
                        <BookOpen
                          size={12}
                          className="text-emerald-600"
                        />
                      </div>

                      <h4 className="text-[10px] font-bold text-slate-800 sm:text-xs">
                        Wants to Learn
                      </h4>
                    </div>

                    {profile.skillsToLearn?.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsToLearn.slice(0, 6).map((skill) => (
                          <span
                            key={skill._id}
                            className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700 sm:px-2.5 sm:text-[10px]"
                          >
                            {skill.name}
                          </span>
                        ))}

                        {profile.skillsToLearn.length > 6 && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500 sm:px-2.5 sm:text-[10px]">
                            +{profile.skillsToLearn.length - 6}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[9px] text-slate-400 sm:text-[10px]">
                        No skills added
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                    <Briefcase
                      size={13}
                      className="shrink-0 text-slate-500"
                    />

                    <span className="truncate text-[9px] font-medium text-slate-600 sm:text-[10px]">
                      {profile.experience || "Experience not specified"}
                    </span>
                  </div>

                  {/* View Profile */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/profile/${profile.user?._id}`)
                    }
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700 group-hover:shadow-md sm:text-xs"
                  >
                    View Profile
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="h-5 sm:h-8" />
      </div>
    </div>
  );
};

export default Explore;
