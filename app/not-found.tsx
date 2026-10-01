import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg text-center">
        <p className="text-lg font-semibold text-blue-700">
          404
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-4 text-gray-600">
          The page you requested does not exist or may have been
          moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Return to EventHub
        </Link>
      </section>
    </main>
  );
}