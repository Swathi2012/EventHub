import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  SignOutButton,
} from "../../../features/auth/components/sign-out-button";

import {
  requireActiveUser,
} from "../../../server/auth/require-active-user";

export const metadata: Metadata = {
  title: "Your account | EventHub",

  description:
    "Manage your EventHub account and active session.",
};

export default async function AccountPage() {
  let user;

  try {
    user =
      await requireActiveUser();
  } catch {
    redirect(
      "/sign-in",
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] px-5 py-10 text-white sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.26),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(124,58,237,0.23),transparent_35%)]"
      />

      <div className="relative mx-auto max-w-5xl">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.07] p-7 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-300">
              EventHub account
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back,{" "}

              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-rose-300 bg-clip-text text-transparent">
                {user.name}
              </span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your account is protected by
              an active, revocable database
              session.
            </p>
          </div>

          <SignOutButton />
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white p-7 text-slate-950 shadow-xl">
            <p className="text-sm font-black text-blue-700">
              Account details
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Your EventHub identity
            </h2>

            <dl className="mt-7 grid gap-5">
              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Name
                </dt>

                <dd className="mt-2 font-bold text-slate-950">
                  {user.name}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Email address
                </dt>

                <dd className="mt-2 break-all font-bold text-slate-950">
                  {user.email}
                </dd>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <dt className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Role
                  </dt>

                  <dd className="mt-2 font-bold text-slate-950">
                    {user.role}
                  </dd>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5">
                  <dt className="text-xs font-black uppercase tracking-wider text-emerald-700">
                    Status
                  </dt>

                  <dd className="mt-2 font-bold text-emerald-950">
                    {user.status}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/15 to-rose-500/10 p-7 backdrop-blur">
            <p className="text-sm font-black text-blue-300">
              Session security
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Secure by design
            </h2>

            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-black text-emerald-400"
                >
                  ✓
                </span>

                Raw session tokens are kept
                only in an HttpOnly cookie.
              </li>

              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-black text-emerald-400"
                >
                  ✓
                </span>

                Only the session-token digest
                is stored in MySQL.
              </li>

              <li className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-black text-emerald-400"
                >
                  ✓
                </span>

                Signing out invalidates the
                active database session.
              </li>
            </ul>

            <Link
              href="/events"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#07111f]"
            >
              Explore events
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
