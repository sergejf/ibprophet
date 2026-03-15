import { Link } from "wasp/client/router";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex justify-center border-b border-dark-600 bg-dark-900/80 backdrop-blur-sm">
      <div className="flex w-full max-w-(--breakpoint-lg) items-center justify-between p-4 px-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🔮</span>
          <h1 className="text-2xl font-bold text-primary-500">IB Prophet</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 font-semibold">
            <li>
              <span
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-sm text-neutral-600"
                title="Coming soon"
              >
                Sign up
              </span>
            </li>
            <li>
              <span
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-sm text-neutral-600"
                title="Coming soon"
              >
                Login
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
