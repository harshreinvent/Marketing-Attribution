"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFilterStore } from "@/stores/filterStore";
import { UserRole } from "@repo/types";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export function TopBar() {
  const { session } = useAuth();
  const setActiveClient = useFilterStore((s) => s.setActiveClient);
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push(ROUTES.LOGIN);
  }

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-6">
      <div>
        {session?.role === UserRole.AGENCY_ADMIN && (
          <select
            className="text-sm border rounded px-2 py-1"
            onChange={(e) => setActiveClient(e.target.value || undefined)}
          >
            <option value="">All clients</option>
          </select>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{session?.role}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
