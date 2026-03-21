import { Link } from "react-router";
import { AuthLayout } from "../AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-neutral-100">Login</h2>
      <p className="mt-3 text-sm text-neutral-400">
        Accounts are coming soon. In the meantime, you can explore all features
        without logging in.
      </p>
      <Link
        to="/"
        className="text-primary-400 hover:text-primary-300 mt-4 inline-block text-sm font-medium underline"
      >
        Back to explorer
      </Link>
    </AuthLayout>
  );
}
