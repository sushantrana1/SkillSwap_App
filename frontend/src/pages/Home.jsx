import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Discover Skills",
      description:
        "Explore people who can teach the skills you want to learn and discover new opportunities.",
    },
    {
      icon: Target,
      title: "Find Your Match",
      description:
        "Get connected with people whose skills complement your interests and goals.",
    },
    {
      icon: MessageCircle,
      title: "Learn Together",
      description:
        "Build meaningful connections and exchange knowledge through real-time communication.",
    },
  ];

  const benefits = [
    "Learn practical skills from real people",
    "Share your knowledge and experience",
    "Find skill matches based on your interests",
    "Connect and communicate in one place",
  ];

  const categories = [
    "Programming",
    "Frontend",
    "Backend",
    "Design",
    "AI & Machine Learning",
    "Data Science",
    "Business",
    "Languages",
  ];

  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description:
        "Tell the SkillSwap community what you can teach and what you want to learn.",
    },
    {
      number: "02",
      title: "Discover your matches",
      description:
        "Explore people whose skills align with your learning goals and interests.",
    },
    {
      number: "03",
      title: "Start exchanging",
      description:
        "Connect, chat, share knowledge, and grow together through meaningful skill exchanges.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm sm:text-sm">
              <Sparkles size={15} />
              Learn. Share. Connect.
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your skills can
              <span className="block text-blue-600">
                help someone grow.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              SkillSwap helps you connect with people who have the
              skills you want to learn and want to learn the skills
              you can teach.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Get Started
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-gray-500 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-green-600"
                />
                Skill-based matching
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-green-600"
                />
                Real-time chat
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-green-600"
                />
                Personalized discovery
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-green-600"
                />
                Community-driven learning
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-blue-300/40 blur-2xl" />
            <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-indigo-300/40 blur-2xl" />

            <div className="relative rounded-3xl border border-gray-200 bg-white/95 p-5 shadow-2xl shadow-blue-900/10 sm:p-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">
                    Your Skill Profile
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                    Find your next match
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 sm:h-11 sm:w-11">
                  <Users
                    size={21}
                    className="text-blue-600"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      I can teach
                    </span>

                    <span className="text-xs text-gray-500">
                      3 skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["JavaScript", "React", "Node.js"].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      I want to learn
                    </span>

                    <span className="text-xs text-gray-500">
                      2 skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["TypeScript", "Next.js"].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Sparkles
                        size={18}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        Great match found
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        Someone can teach what you want to learn.
                      </p>
                    </div>

                    <span className="ml-auto shrink-0 text-sm font-bold text-green-600">
                      92%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2
                    size={18}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Mutual learning
                  </p>

                  <p className="text-xs text-gray-500">
                    Skills exchanged
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
              How SkillSwap works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Turn your skills into opportunities
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Share what you know, discover what you want to learn,
              and find people who make the exchange worthwhile.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-12">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition group-hover:bg-blue-100">
                    <Icon
                      size={23}
                      className="text-blue-600"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600">
                    Explore
                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Zap
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why people choose SkillSwap
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                Learning becomes more meaningful when you learn
                directly from people and share your own experience
                along the way.
              </p>

              <div className="mt-7 space-y-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <span className="text-sm leading-6 text-gray-700">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Globe2
                    size={22}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Learn beyond boundaries
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Discover people with different experiences,
                  backgrounds, and perspectives.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <ShieldCheck
                    size={22}
                    className="text-indigo-600"
                  />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Meaningful connections
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Find people based on skills and interests instead
                  of random connections.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:col-span-2">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <MessageCircle
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      One place for your learning journey
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      Discover matches, send requests, chat with
                      connections, and manage your learning goals
                      from one platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 sm:text-sm">
              Explore possibilities
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Skills worth sharing
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              From technology and design to business and languages,
              there is always something new to learn.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <div
                key={category}
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400 sm:text-sm">
              Your journey starts here
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Three steps to start exchanging skills
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base">
              Getting started is simple. Build your profile, find
              your people, and start learning together.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:bg-white/[0.07]"
              >
                <span className="text-sm font-bold text-blue-400">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <BookOpen
              size={26}
              className="text-blue-600"
            />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your knowledge has value.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Whether you want to learn something new, share what you
            already know, or meet people with similar interests,
            SkillSwap gives you a place to start.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Create Your Profile
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

