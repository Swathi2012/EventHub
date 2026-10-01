import Link from "next/link";

export default function EventsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <p className="font-semibold tracking-wide text-blue-700">
        EVENT DISCOVERY
      </p>

      <h1 className="mt-3 text-4xl font-bold text-gray-900">Explore events</h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        Event search, filtering, categories, and event details will be
        implemented in a later development story.
      </p>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Event discovery is coming soon
        </h2>

        <p className="mt-3 text-gray-600">
          The current page establishes the public EventHub route. No event data
          is loaded yet.
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
