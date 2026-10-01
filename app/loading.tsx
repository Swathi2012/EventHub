export default function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          aria-hidden="true"
        />

        <p className="mt-4 font-medium text-gray-700">Loading EventHub...</p>
      </div>
    </main>
  );
}
