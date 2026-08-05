import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminAccessGate } from "@/components/admin/AdminAccessGate";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — Martify" },
      { name: "description", content: "Martify enterprise admin: orders, products, inventory, customers, growth and AI." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAccessGate>
      {(user) => (
        <AdminShell user={user}>
          <Outlet />
        </AdminShell>
      )}
    </AdminAccessGate>
  );
}
