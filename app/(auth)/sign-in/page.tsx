import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  SignInForm,
} from "../../../features/auth/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | EventHub",

  description:
    "Sign in securely to your EventHub account.",
};

const BENEFITS = [
  {
    title: "Discover",
    description:
      "Find events chosen around your interests.",
  },
  {
    title: "Manage",
    description:
      "Keep bookings and upcoming experiences together.",
  },
  {
    title: "Return",
    description:
      "Continue where your EventHub journey paused.",
  },
] as const;

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.30),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(124,58,237,0.27),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(251,113,133,0.14),transparent_40%)]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-28 top-40 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Go to the EventHub home page"
            className="group inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-4 focus:ring-offset-[#07111f]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black shadow-lg shadow-blue-950/40 transition-transform group-hover:-translate-y-0.5">
              E
            </span>

            <span className="text-xl font-black tracking-tight">
              EventHub
            </span>
          </Link>

          <nav
            aria-label="Sign-in navigation"
            className="flex items-center gap-3"
          >
            <Link
              href="/events"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:inline-flex"
            >
              Explore events
            </Link>

            <Link
              href="/register"
              className="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create account
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200 backdrop-blur">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#fb7185]"
              />

              Welcome back to EventHub
            </div>

            <h1
              aria-label="Step back into experiences worth remembering."
              className="mt-7 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              Step back into

              <span
                aria-hidden="true"
                className="block bg-gradient-to-r from-blue-400 via-violet-400 to-rose-300 bg-clip-text text-transparent"
              >
                experiences worth remembering.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Sign in to manage bookings,
              revisit saved experiences, and
              discover what comes next.
            </p>

            <ul className="mt-9 grid gap-4 sm:grid-cols-3">
              {BENEFITS.map(
                (
                  benefit,
                  index,
                ) => (
                  <li
                    key={
                      benefit.title
                    }
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur"
                  >
                    <span className="text-xs font-black text-blue-300">
                      0{index + 1}
                    </span>

                    <h2 className="mt-3 font-black text-white">
                      {
                        benefit.title
                      }
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {
                        benefit.description
                      }
                    </p>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="text-emerald-400"
                >
                  ✓
                </span>

                HttpOnly session cookie
              </span>

              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="text-emerald-400"
                >
                  ✓
                </span>

                Revocable database session
              </span>
            </div>
          </section>

          <section
            aria-labelledby="sign-in-heading"
            className="relative mx-auto w-full max-w-lg"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-500/40 via-violet-500/25 to-rose-400/25 blur-xl"
            />

            <div className="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-1 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-950 sm:p-8">
                <header className="mb-7">
                  <p className="text-sm font-black text-blue-700">
                    EventHub account
                  </p>

                  <h2
                    id="sign-in-heading"
                    className="mt-2 text-3xl font-black tracking-tight text-slate-950"
                  >
                    Sign in
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Use your registered
                    email address and
                    password.
                  </p>
                </header>

                <SignInForm />

                <p className="mt-7 text-center text-sm text-slate-600">
                  New to EventHub?{" "}

                  <Link
                    href="/register"
                    className="font-black text-blue-700 transition hover:text-violet-700 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Create an account
                  </Link>
                </p>

                <p className="mt-5 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-500">
                  EventHub protects
                  account sessions with
                  secure, server-managed
                  controls.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 EventHub. Your next
            experience is waiting.
          </p>

          <div className="flex gap-5">
            <span>
              Privacy-first
            </span>

            <span>
              Secure by design
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
