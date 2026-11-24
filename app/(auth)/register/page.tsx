import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  RegistrationForm,
} from "../../../features/auth/components/registration-form";

export const metadata: Metadata = {
  title: "Create account | EventHub",

  description:
    "Create your EventHub account and discover unforgettable experiences.",
};

const BENEFITS = [
  {
    title: "Discover",
    description:
      "Find technology, music, business, sports, and community events.",
  },
  {
    title: "Book",
    description:
      "Reserve event tickets through one simple and secure experience.",
  },
  {
    title: "Experience",
    description:
      "Keep every upcoming event and booking organised in one place.",
  },
] as const;

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.28),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(124,58,237,0.28),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(251,113,133,0.16),transparent_38%)]"
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

            <span className="text-xl font-bold tracking-tight">
              EventHub
            </span>
          </Link>

          <nav
            aria-label="Registration navigation"
            className="flex items-center gap-3"
          >
            <Link
              href="/events"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:inline-flex"
            >
              Explore events
            </Link>

            <Link
              href="/sign-in"
              aria-label="Sign in to an existing EventHub account"
              className="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign in
            </Link>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#fb7185]" />

              Your next experience starts here
            </div>

            <h1
              aria-label="Discover moments worth remembering."
              className="mt-7 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              Discover moments

              <span
                aria-hidden="true"
                className="block bg-gradient-to-r from-blue-400 via-violet-400 to-rose-300 bg-clip-text text-transparent"
              >
                worth remembering.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Create an EventHub account to
              discover remarkable events, secure
              tickets, and keep every experience
              together.
            </p>

            <ul className="mt-9 grid gap-4 sm:grid-cols-3">
              {BENEFITS.map(
                (benefit, index) => (
                  <li
                    key={benefit.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur"
                  >
                    <span className="text-xs font-bold text-blue-300">
                      0{index + 1}
                    </span>

                    <h2 className="mt-3 font-bold text-white">
                      {benefit.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {benefit.description}
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

                Secure password storage
              </span>

              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="text-emerald-400"
                >
                  ✓
                </span>

                Accessible experience
              </span>
            </div>
          </section>

          <section
            aria-labelledby="registration-heading"
            className="relative mx-auto w-full max-w-lg"
          >
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-500/40 via-violet-500/25 to-rose-400/25 blur-xl"
            />

            <div className="relative rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-1 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="rounded-[1.5rem] bg-white p-6 text-slate-950 sm:p-8">
                <header className="mb-7">
                  <p className="text-sm font-bold text-blue-700">
                    Join EventHub
                  </p>

                  <h2
                    id="registration-heading"
                    className="mt-2 text-3xl font-black tracking-tight text-slate-950"
                  >
                    Create your account
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Register to discover events
                    and manage your bookings.
                  </p>
                </header>

                <RegistrationForm />

                <p className="mt-7 text-center text-sm text-slate-600">
                  Already have an account?{" "}

                  <Link
                    href="/sign-in"
                    aria-label="Sign in from the EventHub registration page"
                    className="font-bold text-blue-700 transition hover:text-violet-700 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="mt-5 border-t border-slate-200 pt-5 text-center text-xs leading-5 text-slate-500">
                  By creating an account, you
                  agree to follow EventHub&apos;s
                  platform guidelines.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 EventHub. Experiences
            begin with a single click.
          </p>

          <div className="flex gap-5">
            <span>Privacy-first</span>
            <span>Secure by design</span>
          </div>
        </footer>
      </div>
    </main>
  );
}


