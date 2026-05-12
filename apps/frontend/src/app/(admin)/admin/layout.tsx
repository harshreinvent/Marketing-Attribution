"use client";

import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@repo/types";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (session && session.role !== UserRole.AGENCY_ADMIN) {
    redirect(ROUTES.EXECUTIVE_SUMMARY);
  }

  return <div className="min-h-screen p-6">{children}</div>;
}
