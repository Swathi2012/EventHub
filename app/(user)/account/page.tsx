import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <p className="font-semibold text-blue-700">USER AREA</p>

      <h1 className="mt-3 text-4xl font-bold text-gray-900">My account</h1>

      <p className="mt-4 max-w-2xl leading-7 text-gray-600">
        Profile management and booking history will be implemented after
        authentication and database configuration are complete.
      </p>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Protected access pending
        </h2>

        <p className="mt-3 text-gray-600">
          Server-side user authentication and authorization are not part of the
          current foundation story.
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
