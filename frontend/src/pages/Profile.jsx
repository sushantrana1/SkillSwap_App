import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  User,
  Briefcase,
  Clock,
  Pencil,
  X,
  Camera,
  Search,
  Plus,
  Check,
  Sparkles,
  BookOpen,
  GraduationCap,
  Save,
  ChevronDown,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   SKILL PICKER
========================================================= */

/* =========================================================
   SKILL PICKER
========================================================= */

const SkillPicker = ({
  type,
  value,
  onChange,
  category,
  onCategoryChange,
  selectedSkills,
  availableSkills,
  categories,
  onAdd,
  onRemove,
}) => {
  const isTeach = type === "teach";

  const safeAvailableSkills = Array.isArray(availableSkills)
    ? availableSkills.filter(
        (skill) => skill && (skill._id || skill.id) && skill.name,
      )
    : [];

  const safeSelectedSkills = Array.isArray(selectedSkills)
    ? selectedSkills
    : [];

  const getSkillId = (skill) => {
    if (!skill) return "";

    return String(skill._id || skill.id || "");
  };

  const filteredSkills = useMemo(() => {
    const search = String(value || "")
      .trim()
      .toLowerCase();

    const selectedIds = new Set(
      safeSelectedSkills.map((skill) => getSkillId(skill)),
    );

    return safeAvailableSkills.filter((skill) => {
      const skillName = String(skill.name || "").toLowerCase();

      const skillCategory = String(skill.category || "");

      const matchesSearch = search === "" || skillName.includes(search);

      const matchesCategory =
        category === "All" || skillCategory === String(category);

      const alreadySelected = selectedIds.has(getSkillId(skill));

      return matchesSearch && matchesCategory && !alreadySelected;
    });
  }, [value, category, safeAvailableSkills, safeSelectedSkills]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (filteredSkills.length > 0) {
        onAdd(filteredSkills[0]);
      }
    }

    if (event.key === "Escape") {
      onChange("");
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${
        isTeach
          ? "border-blue-200 bg-blue-50/40"
          : "border-emerald-200 bg-emerald-50/40"
      }`}
    >
      {/* HEADER */}

      <div className="border-b border-black/5 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isTeach
                ? "bg-blue-100 text-blue-600"
                : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {isTeach ? <GraduationCap size={21} /> : <BookOpen size={21} />}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900">
              {isTeach ? "Skills I Can Teach" : "Skills I Want to Learn"}
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {isTeach
                ? "Choose skills you feel confident helping others with."
                : "Choose skills you would like to learn from others."}
            </p>
          </div>
        </div>
      </div>

      {/* SELECTED SKILLS */}

      <div className="px-4 pt-4 sm:px-5">
        {safeSelectedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {safeSelectedSkills.map((skill) => (
              <div
                key={getSkillId(skill)}
                className={`group inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-semibold shadow-sm ${
                  isTeach
                    ? "border-blue-200 text-blue-700"
                    : "border-emerald-200 text-emerald-700"
                }`}
              >
                <span>{skill.name}</span>

                <button
                  type="button"
                  onClick={() => onRemove(getSkillId(skill))}
                  className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                  aria-label={`Remove ${skill.name}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-4 text-center">
            <p className="text-xs text-slate-400">No skills selected yet</p>
          </div>
        )}
      </div>

      {/* SEARCH */}

      <div className="p-4 sm:p-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTeach
                ? "Search skills you can teach..."
                : "Search skills you want to learn..."
            }
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER */}

        <div className="mt-3">
          <div className="relative">
            <select
              value={category}
              onChange={(event) => onCategoryChange(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-xs font-medium text-slate-600 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All categories" : item}
                </option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        {/* SEARCH RESULTS */}

        <div className="mt-3">
          {filteredSkills.length > 0 ? (
            <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {filteredSkills.slice(0, 20).map((skill) => (
                <button
                  key={getSkillId(skill)}
                  type="button"
                  onClick={() => onAdd(skill)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {skill.name}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      {skill.category || "General"}
                    </p>
                  </div>

                  <span
                    className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      isTeach
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    <Plus size={15} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center">
              <Search size={20} className="mx-auto text-slate-300" />

              <p className="mt-2 text-xs font-medium text-slate-500">
                No matching skills found
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {safeAvailableSkills.length === 0
                  ? "No skills were loaded from the skill catalog."
                  : "Try another skill name or category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PROFILE PAGE
========================================================= */

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [availableSkills, setAvailableSkills] = useState([]);

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    profileImage: "",
    skillsToTeach: [],
    skillsToLearn: [],
    experience: "",
    availability: "",
  });

  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");

  const [teachCategory, setTeachCategory] = useState("All");

  const [learnCategory, setLearnCategory] = useState("All");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =======================================================
     GET SKILLS
  ======================================================= */

  const getSkills = async () => {
    try {
      const response = await api.get("/skills");

      console.log("Skills API response:", response.data);

      const skills =
        response.data?.skills || response.data?.data || response.data || [];

      setAvailableSkills(Array.isArray(skills) ? skills : []);
    } catch (error) {
      console.error("Get skills error:", error);
      setAvailableSkills([]);
    }
  };

  /* =======================================================
     GET PROFILE
  ======================================================= */

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.profile;

      setProfile(data);

      setFormData({
        bio: data.bio || "",
        location: data.location || "",
        profileImage: data.profileImage || "",
        skillsToTeach: data.skillsToTeach || [],
        skillsToLearn: data.skillsToLearn || [],
        experience: data.experience || "",
        availability: data.availability || "",
      });
    } catch (error) {
      console.error("Get profile error:", error);

      if (error.response?.status !== 404) {
        setError(error.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    getSkills();
  }, []);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        availableSkills.map((skill) => skill?.category).filter(Boolean),
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [availableSkills]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setError("");
  };

  /* =======================================================
     ADD TEACH SKILL
  ======================================================= */

  const addTeachSkill = (skill) => {
    if (!skill) return;

    const exists = formData.skillsToTeach.some(
      (item) => String(item?._id) === String(skill?._id),
    );

    if (exists) return;

    setFormData((previous) => ({
      ...previous,
      skillsToTeach: [...previous.skillsToTeach, skill],
    }));

    setTeachSkill("");
    setError("");
  };

  /* =======================================================
     ADD LEARN SKILL
  ======================================================= */

  const addLearnSkill = (skill) => {
    if (!skill) return;

    const exists = formData.skillsToLearn.some(
      (item) => String(item?._id) === String(skill?._id),
    );

    if (exists) return;

    setFormData((previous) => ({
      ...previous,
      skillsToLearn: [...previous.skillsToLearn, skill],
    }));

    setLearnSkill("");
    setError("");
  };

  /* =======================================================
     REMOVE TEACH SKILL
  ======================================================= */

  const removeTeachSkill = (skillId) => {
    setFormData((previous) => ({
      ...previous,
      skillsToTeach: previous.skillsToTeach.filter(
        (skill) => String(skill?._id) !== String(skillId),
      ),
    }));
  };

  /* =======================================================
     REMOVE LEARN SKILL
  ======================================================= */

  const removeLearnSkill = (skillId) => {
    setFormData((previous) => ({
      ...previous,
      skillsToLearn: previous.skillsToLearn.filter(
        (skill) => String(skill?._id) !== String(skillId),
      ),
    }));
  };

  /* =======================================================
     START EDITING
  ======================================================= */

  const handleEdit = () => {
    setMessage("");
    setError("");

    setSelectedImage(null);
    setImagePreview("");

    setEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CANCEL EDITING
  ======================================================= */

  const handleCancel = () => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        location: profile.location || "",
        profileImage: profile.profileImage || "",
        skillsToTeach: profile.skillsToTeach || [],
        skillsToLearn: profile.skillsToLearn || [],
        experience: profile.experience || "",
        availability: profile.availability || "",
      });
    }

    setSelectedImage(null);
    setImagePreview("");

    setTeachSkill("");
    setLearnSkill("");

    setTeachCategory("All");
    setLearnCategory("All");

    setError("");
    setEditing(false);
  };

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("bio", formData.bio);
      data.append("location", formData.location);
      data.append("experience", formData.experience);
      data.append("availability", formData.availability);

      formData.skillsToTeach.forEach((skill) => {
        data.append("skillsToTeach", skill.name);
      });

      formData.skillsToLearn.forEach((skill) => {
        data.append("skillsToLearn", skill.name);
      });

      if (selectedImage) {
        data.append("profileImage", selectedImage);
      }

      const response = await api.post("/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profileResponse = await api.get("/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfile = profileResponse.data.profile;

      setProfile(updatedProfile);

      setFormData({
        bio: updatedProfile.bio || "",
        location: updatedProfile.location || "",
        profileImage: updatedProfile.profileImage || "",
        skillsToTeach: updatedProfile.skillsToTeach || [],
        skillsToLearn: updatedProfile.skillsToLearn || [],
        experience: updatedProfile.experience || "",
        availability: updatedProfile.availability || "",
      });

      setSelectedImage(null);
      setImagePreview("");

      setTeachSkill("");
      setLearnSkill("");

      setTeachCategory("All");
      setLearnCategory("All");

      setMessage(response.data.message || "Profile updated successfully.");

      setEditing(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Save profile error:", error);

      setError(error.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-72 rounded-3xl bg-white shadow-sm" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="h-96 rounded-3xl bg-white" />
            <div className="h-96 rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     VIEW MODE
  ======================================================= */

  if (!editing) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          {/* PAGE HEADER */}

          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 sm:text-xs">
                <Sparkles size={16} />
                SkillSwap Profile
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your learning identity
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Showcase what you know, what you want to learn, and connect with
                people who complement your skills.
              </p>
            </div>

            {/* RESPONSIVE EDIT BUTTON */}

            <button
              type="button"
              onClick={handleEdit}
              aria-label="Edit Profile"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 sm:px-5 sm:py-3"
            >
              <Pencil size={16} />

              <span className="hidden sm:inline">Edit Profile</span>
            </button>
          </div>

          {/* ALERTS */}

          {message && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
              <Check size={18} className="shrink-0" />

              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* BLUE HERO */}

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.22),_transparent_38%)]" />

            <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />

            <div className="absolute -right-20 top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                {/* USER */}

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={user?.name || "Profile"}
                      className="h-28 w-28 rounded-3xl border-4 border-white/20 object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10">
                      <User size={48} className="text-white/80" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-blue-100">
                      SkillSwap member
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                      {user?.name}
                    </h2>

                    <p className="mt-1 text-sm text-blue-100/80">
                      {user?.email}
                    </p>

                    {profile?.location && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                        <MapPin size={16} />
                        {profile.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* STATS */}

                <div className="grid grid-cols-2 gap-3 sm:flex">
                  <div className="min-w-[120px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center backdrop-blur">
                    <p className="text-2xl font-bold text-white">
                      {profile?.skillsToTeach?.length || 0}
                    </p>

                    <p className="mt-1 text-xs font-medium text-blue-100/80">
                      Skills teaching
                    </p>
                  </div>

                  <div className="min-w-[120px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center backdrop-blur">
                    <p className="text-2xl font-bold text-white">
                      {profile?.skillsToLearn?.length || 0}
                    </p>

                    <p className="mt-1 text-xs font-medium text-blue-100/80">
                      Skills learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MAIN LAYOUT */}

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* LEFT SIDEBAR */}

            <aside className="space-y-5">
              {/* EXPERIENCE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Briefcase size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Experience
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                      {profile?.experience || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              {/* AVAILABILITY */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Availability
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                      {profile?.availability || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* PROFILE TIP */}
              <div className="hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg sm:block">
                <Sparkles size={20} />

                <h3 className="mt-4 font-semibold">Build a stronger profile</h3>

                <p className="mt-2 text-sm leading-6 text-blue-100">
                  Add more relevant skills and a thoughtful bio to improve your
                  chances of finding useful matches.
                </p>

                <button
                  type="button"
                  onClick={handleEdit}
                  className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Improve profile
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT */}

            <main className="space-y-6">
              {/* ABOUT */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-950">About me</h3>

                    <p className="text-xs text-slate-400">Your introduction</p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {profile?.bio ||
                    "You have not added a bio yet. Add one to help other SkillSwap members get to know you."}
                </p>
              </section>

              {/* TEACHING SKILLS */}

              <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <GraduationCap size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        Skills I Can Teach
                      </h3>

                      <p className="text-xs text-slate-400">
                        What you can share with others
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {profile?.skillsToTeach?.length || 0} skills
                  </span>
                </div>

                {profile?.skillsToTeach?.length > 0 ? (
                  <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {profile.skillsToTeach.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                          <Check size={15} />
                        </div>

                        <span className="text-sm font-semibold text-blue-800">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                    <p className="text-sm text-slate-400">
                      No teaching skills added yet.
                    </p>
                  </div>
                )}
              </section>

              {/* LEARNING SKILLS */}

              <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <BookOpen size={21} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-950">
                        Skills I Want to Learn
                      </h3>

                      <p className="text-xs text-slate-400">
                        What you want to discover next
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {profile?.skillsToLearn?.length || 0} skills
                  </span>
                </div>

                {profile?.skillsToLearn?.length > 0 ? (
                  <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {profile.skillsToLearn.map((skill) => (
                      <div
                        key={skill._id}
                        className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                          <BookOpen size={15} />
                        </div>

                        <span className="text-sm font-semibold text-emerald-800">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                    <p className="text-sm text-slate-400">
                      No learning skills added yet.
                    </p>
                  </div>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     EDIT MODE
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* EDIT HEADER */}

        <div className="mb-6 flex items-start gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <X size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Pencil size={15} />
              Profile settings
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Edit your profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your profile updated so SkillSwap can find better connections
              for you.
            </p>
          </div>
        </div>

        {/* ALERTS */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
            <Check size={18} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE PHOTO */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <h2 className="font-semibold text-slate-950">Profile photo</h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a clear image that represents you.
              </p>
            </div>

            <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:px-7">
              <div className="relative">
                {imagePreview || formData.profileImage ? (
                  <img
                    src={imagePreview || formData.profileImage}
                    alt="Profile preview"
                    className="h-28 w-28 rounded-3xl object-cover shadow-md ring-4 ring-slate-100"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-50 ring-4 ring-slate-100">
                    <User size={42} className="text-blue-600" />
                  </div>
                )}

                <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition hover:bg-blue-700">
                  <Camera size={18} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <p className="font-medium text-slate-800">
                  Upload a new profile photo
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  JPG, JPEG, PNG or WEBP.
                  <br />
                  Maximum size: 5MB.
                </p>

                {selectedImage && (
                  <p className="mt-2 break-all text-xs font-semibold text-blue-600">
                    {selectedImage.name}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ABOUT */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">About you</h2>

              <p className="mt-1 text-sm text-slate-500">
                Give other members some context about you.
              </p>
            </div>

            <div className="space-y-5">
              {/* BIO */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    Bio
                  </label>

                  <span className="text-xs text-slate-400">
                    {formData.bio.length}/500
                  </span>
                </div>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="5"
                  maxLength="500"
                  placeholder="Tell people about yourself, your interests, experience, and what you enjoy learning..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Kathmandu, Nepal"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SKILLS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">
                Skills & learning goals
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Search the SkillSwap catalog and select the skills you want to
                teach or learn.
              </p>
            </div>

            <div className="space-y-5">
              <SkillPicker
                type="teach"
                value={teachSkill}
                onChange={setTeachSkill}
                category={teachCategory}
                onCategoryChange={setTeachCategory}
                selectedSkills={formData.skillsToTeach}
                availableSkills={availableSkills}
                categories={categories}
                onAdd={addTeachSkill}
                onRemove={removeTeachSkill}
              />

              <SkillPicker
                type="learn"
                value={learnSkill}
                onChange={setLearnSkill}
                category={learnCategory}
                onCategoryChange={setLearnCategory}
                selectedSkills={formData.skillsToLearn}
                availableSkills={availableSkills}
                categories={categories}
                onAdd={addLearnSkill}
                onRemove={removeLearnSkill}
              />
            </div>
          </section>

          {/* EXPERIENCE */}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="font-semibold text-slate-950">
                Experience & availability
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Help potential matches understand your experience level and
                schedule.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* EXPERIENCE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Experience
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. Beginner, Intermediate, 3 years"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              {/* AVAILABILITY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Availability
                </label>

                <div className="relative">
                  <Clock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="e.g. Evenings and weekends"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SAVE BAR */}

          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur sm:p-4">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Save size={17} />

                {saving ? "Saving changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
