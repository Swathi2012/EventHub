import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <p className="font-semibold text-blue-700">ADMINISTRATION</p>

      <h1 className="mt-3 text-4xl font-bold text-gray-900">Admin workspace</h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        User management, organizer approval, event moderation, and platform
        reporting will be implemented in later stories.
      </p>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Admin authorization pending
        </h2>

        <p className="mt-3 text-gray-600">
          This route is currently a structural placeholder and must not be
          treated as a protected administration interface.
        </p>
      </section>

      <Link
        href="/"
        className="mt-8 inline-block font-semibold text-blue-700 underline underline-offset-4"
      >
        Return to EventHub
      </Link>
    </main>
  );
}
