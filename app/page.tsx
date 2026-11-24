import Link from "next/link";

const FEATURES = [
  {
    title: "Discover",
    description:
      "Find technology, music, business, sports, and community events.",
  },
  {
    title: "Book",
    description:
      "Reserve your place through a secure and simple experience.",
  },
  {
    title: "Experience",
    description:
      "Keep upcoming events and bookings organised in one place.",
  },
] as const;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.30),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(124,58,237,0.26),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(251,113,133,0.15),transparent_40%)]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 py-6">
          <Link
            href="/"
            aria-label="Go to the EventHub home page"
            className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black shadow-lg">
              E
            </span>

            <span className="text-xl font-black tracking-tight">
              EventHub
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="flex items-center gap-2 sm:gap-3"
          >
            <Link
              href="/events"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4"
            >
              Explore events
            </Link>

            <Link
              href="/sign-in"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="hidden rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-bold shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:inline-flex"
            >
              Create account
            </Link>
          </nav>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20 lg:py-28">
          <p className="inline-flex w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            Discover. Book. Experience.
          </p>

          <h1 className="mt-8 max-w-5xl text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Find experiences

            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-rose-300 bg-clip-text text-transparent">
              worth remembering.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore technology, music, business,
            sports, workshops, and community events
            through one secure platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/events"
              className="rounded-xl bg-white px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#07111f]"
            >
              Explore events
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Create free account
            </Link>
          </div>

          <ul className="mt-16 grid gap-4 sm:grid-cols-3">
            {FEATURES.map(
              (feature, index) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur transition hover:-translate-y-1 hover:border-blue-400/30"
                >
                  <span className="text-xs font-black text-blue-400">
                    0{index + 1}
                  </span>

                  <h2 className="mt-4 text-xl font-black">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </li>
              ),
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
