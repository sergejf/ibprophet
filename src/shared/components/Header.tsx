import { Link } from "wasp/client/router";

export function Header() {
  return (
    <header className="border-dark-600 bg-dark-900/80 sticky top-0 z-10 flex justify-center border-b backdrop-blur-sm">
      <div className="flex w-full max-w-(--breakpoint-lg) items-center justify-between p-4 px-4 sm:px-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🔮</span>
          <h1 className="text-primary-500 text-2xl font-bold">IB Prophet</h1>
        </Link>
        <nav>
          <ul className="flex items-center gap-4 font-semibold">
            <li>
              <a
                href="https://tally.so/r/aQG4gW"
                target="_blank"
                rel="noopener noreferrer"
                className="border-primary-500/40 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10 hover:text-primary-300 rounded-md border px-3 py-1.5 text-sm whitespace-nowrap transition-colors"
              >
                Give feedback
              </a>
            </li>
            <li className="hidden sm:block">
              <span
                className="cursor-not-allowed rounded-md px-3 py-1.5 text-sm text-neutral-600"
                title="Coming soon"
              >
                Sign up
              </span>
            </li>
            <li className="hidden sm:block">
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
