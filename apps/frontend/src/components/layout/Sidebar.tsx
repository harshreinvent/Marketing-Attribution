"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@repo/types";
import { ROUTES } from "@/constants/routes";
import { CHANNEL_LABELS } from "@/constants/channels";

const NAV_LINKS = [
  { href: ROUTES.EXECUTIVE_SUMMARY, label: "Executive Summary" },
  { href: ROUTES.GOOGLE_ADS, label: CHANNEL_LABELS.google_ads },
  { href: ROUTES.META_ADS, label: CHANNEL_LABELS.meta_ads },
  { href: ROUTES.WEBSITE_ORGANIC, label: "Website & Organic" },
  { href: ROUTES.FUNNEL_ROI, label: "Funnel & ROI" },
  { href: ROUTES.GMB, label: CHANNEL_LABELS.gmb },
];

export function Sidebar() {
  const pathname = usePathname();
  const { session } = useAuth();
  const isAgencyAdmin = session?.role === UserRole.AGENCY_ADMIN;

  return (
    <aside className="w-56 shrink-0 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <img src="/logo.svg" alt="Logo" className="h-8" />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {isAgencyAdmin && (
        <div className="p-3 border-t space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Admin
          </p>
          {[
            { href: ROUTES.ADMIN_CLIENTS, label: "Clients" },
            { href: ROUTES.ADMIN_USERS, label: "Users" },
            { href: ROUTES.ADMIN_SYNC_STATUS, label: "Sync Status" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}
