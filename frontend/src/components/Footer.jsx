import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:gap-10 sm:py-14 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
            >
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 group-hover:scale-105">
                <span className="relative z-10">
                  S
                </span>

                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Skill
                <span className="text-blue-400">
                  Swap
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
              A skill-sharing platform that helps people
              discover meaningful learning connections,
              exchange knowledge, and grow together.
            </p>

            <a
              href="mailto:sushantrana1121@email.com"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-blue-500 hover:bg-gray-800 hover:text-blue-400"
            >
              <Mail size={16} />
              Contact me
            </a>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Get Started
              </Link>

              <Link
                to="/dashboard"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/matches"
                className="flex items-center gap-1 text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Find Matches
                <ArrowUpRight size={13} />
              </Link>

              <Link
                to="/profile"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                My Profile
              </Link>

              <Link
                to="/requests"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Requests
              </Link>

              <Link
                to="/chat"
                className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
              >
                Messages
              </Link>
            </div>
          </div>

          {/* My Accounts */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              My Accounts
            </h3>

            <p className="mt-5 text-sm leading-6 text-gray-400">
              Connect with me or get in touch about
              SkillSwap.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {/* GitHub */}
              <a
                href="https://github.com/sushantrana1"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="group flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:-translate-y-1 hover:border-gray-500 hover:bg-gray-800 hover:text-white"
              >
                <FaGithub
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                GitHub
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/YOUR_USERNAME"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="group flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <FaLinkedinIn
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                LinkedIn
              </a>

              {/* Email */}
              <a
                href="mailto:sushantrana1121@email.com"
                aria-label="Email"
                className="group flex items-center justify-center gap-1.5 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Mail
                  size={14}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                Email
              </a>

              {/* Contact */}
              <a
                href="tel:+977-9814631275"
                aria-label="Contact"
                className="group flex items-center justify-center gap-1.5 rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <MessageCircle
                  size={14}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                Contact
              </a>
            </div>

            <p className="mt-4 break-all text-xs text-gray-500">
              sushantrana1121@email.com
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-gray-800 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-500 sm:text-sm">
            © {currentYear} SkillSwap. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 sm:text-sm">
            Learn from others. Share what you know.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;