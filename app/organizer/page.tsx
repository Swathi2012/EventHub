import Link from "next/link";

export default function OrganizerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <p className="font-semibold text-blue-700">ORGANIZER AREA</p>

      <h1 className="mt-3 text-4xl font-bold text-gray-900">
        Organizer workspace
      </h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        Event creation, ticket configuration, booking management, and organizer
        analytics will be implemented in later stories.
      </p>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Organizer authorization pending
        </h2>

        <p className="mt-3 text-gray-600">
          This route is not protected yet. Server-side role and ownership checks
          will be added after Auth.js is configured.
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
