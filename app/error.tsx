"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("EventHub route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="max-w-lg text-center">
        <p className="font-semibold text-red-600">Something went wrong</p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          We could not complete your request
        </h1>

        <p className="mt-4 text-gray-600">
          Please try again. If the issue continues, return to the EventHub home
          page.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
