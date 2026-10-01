import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="font-semibold text-blue-700">EVENTHUB ACCOUNT</p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">Sign in</h1>

        <p className="mt-4 leading-7 text-gray-600">
          Secure authentication will be implemented with Auth.js in a later
          development story.
        </p>

        <div
          className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5"
          role="note"
        >
          <p className="text-sm text-gray-600">
            This is a route placeholder. No credentials are accepted on this
            page yet.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-semibold text-blue-700 underline underline-offset-4"
        >
          Return to EventHub
        </Link>
      </section>
    </main>
  );
}
