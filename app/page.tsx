import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-700">
  EventHub
</h1>
<nav
  aria-label="EventHub primary navigation"
  className="mt-8 flex flex-wrap gap-4"
>
  <Link
    href="/">
    Explore events
  </Link>

  <Link
    href="/">
    Sign in
  </Link>
</nav>
</div>
  );
}
