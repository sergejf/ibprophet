import { logout, useAuth } from "wasp/client/auth";
import { Link } from "wasp/client/router";
import { Button, ButtonLink } from "./Button";

export function Header() {
  const { data: user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex justify-center border-b border-dark-600 bg-dark-900/80 backdrop-blur-sm">
      <div className="flex w-full max-w-(--breakpoint-lg) items-center justify-between p-4 px-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🔮</span>
          <h1 className="text-2xl font-bold text-primary-500">IB Prophet</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 font-semibold">
            {user ? (
              <li>
                <Button onClick={logout} size="sm">Log out</Button>
              </li>
            ) : (
              <>
                <li>
                  <ButtonLink to="/signup" size="sm">Sign up</ButtonLink>
                </li>
                <li>
                  <ButtonLink to="/login" size="sm" variant="ghost">
                    Login
                  </ButtonLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
