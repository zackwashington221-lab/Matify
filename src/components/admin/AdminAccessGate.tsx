import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ApiError, api, getCachedAdminUser, getToken, type AdminUser } from "@/lib/api-client";
import { isAdmin } from "@/routes/admin-login";

type Props = { children: (user: AdminUser) => ReactNode };

export function AdminAccessGate({ children }: Props) {
  const navigate = useNavigate();
  const [state, setState] = useState<{ loading: boolean; user: AdminUser | null }>({ loading: true, user: null });

  useEffect(() => {
    const cachedUser = getCachedAdminUser();
    const token = getToken();

    if (cachedUser && isAdmin(cachedUser.role)) {
      setState({ loading: false, user: cachedUser });
    }

    if (!token && !cachedUser) {
      navigate({ to: "/admin-login", replace: true });
      return;
    }

    // Local storage is the navigation source of truth. Refresh the profile only
    // when a token is also available; this keeps the console open offline.
    if (!token) {
      return;
    }

    api.auth.me()
      .then(({ user }) => {
        if (!isAdmin(user.role)) throw new Error("Admin access required");
        setState({ loading: false, user });
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && [401, 403].includes(error.status)) {
          api.auth.logout();
          toast.error("Session expired", { description: "Please sign in again to continue." });
          navigate({ to: "/admin-login", replace: true });
          return;
        }

        if (cachedUser && isAdmin(cachedUser.role)) {
          toast.warning("Using saved session", { description: "We could not refresh your account from the server." });
          return;
        }

        toast.error("Unable to verify your session", { description: "Please check the API connection and sign in again." });
        navigate({ to: "/admin-login", replace: true });
      });
  }, [navigate]);

  if (state.loading || !state.user) {
    return <main className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Checking your secure session…</main>;
  }

  return <>{children(state.user)}</>;
}
