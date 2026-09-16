import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { token, user } = response.data;

      login(token, user);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="absolute left-[12%] top-[18%] h-16 w-16 rotate-12 rounded-2xl border border-blue-200 bg-white/50" />

        <div className="absolute right-[12%] top-[16%] h-24 w-24 rounded-full border border-indigo-200/70 bg-white/40" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Login Card - LEFT SIDE */}
          <div className="order-1 w-full max-w-lg justify-self-center lg:order-1">

            <div className="rounded-[30px] border border-white bg-white/95 p-5 shadow-2xl shadow-blue-900/10 backdrop-blur-xl sm:p-8">
              {/* Card Header */}
              <div className="mb-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <Lock size={22} />
                  </div>

                  <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
                    Secure login
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to continue your SkillSwap
                  journey.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />

                    <p className="text-sm leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="group relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600"
                    />

                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600"
                    />

                    <input
                      id="login-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-full rounded-full bg-blue-500" />
                    </div>

                    <span className="text-[11px] text-gray-400">
                      Your password is private
                    </span>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Security */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    Secure and private
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-gray-400">
                    Your login information is protected by
                    secure authentication.
                  </p>
                </div>
              </div>

              {/* Register */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Create your SkillSwap account
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Bottom Message */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Sparkles size={13} />

              <span>
                Learn. Share. Connect.
              </span>
            </div>
          </div>

          {/* Introduction - RIGHT SIDE */}
          <div className="order-2 hidden lg:block">

            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm">
                <Sparkles size={15} />
                Welcome back
              </div>

              <h2 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-950">
                Continue your
                <span className="block text-blue-600">
                  skill journey.
                </span>
              </h2>

              <p className="mt-5 text-base leading-7 text-gray-500">
                Sign in to reconnect with your learning
                community, discover new matches, and keep
                exchanging valuable skills.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-gray-100">
                    <Users size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Find your skill matches
                    </p>

                    <p className="text-xs text-gray-400">
                      Connect with people who complement your
                      skills.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-gray-100">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Continue learning
                    </p>

                    <p className="text-xs text-gray-400">
                      Pick up where you left off.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-gray-100">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Your account stays protected
                    </p>

                    <p className="text-xs text-gray-400">
                      Secure authentication keeps your data
                      private.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;