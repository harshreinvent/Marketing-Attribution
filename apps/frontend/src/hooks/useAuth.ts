"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@repo/types";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const meta = data.session.user.user_metadata;
        setSession({
          userId: data.session.user.id,
          clientId: meta.client_id,
          role: meta.role,
          locationIds: meta.location_ids ?? [],
        });
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => {
      if (s) {
        const meta = s.user.user_metadata;
        setSession({
          userId: s.user.id,
          clientId: meta.client_id,
          role: meta.role,
          locationIds: meta.location_ids ?? [],
        });
      } else {
        setSession(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, loading };
}
