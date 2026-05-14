import { prisma } from "../db/prisma";
import { ghlContactsResponseSchema } from "@repo/validators";
import type { GhlContact } from "@repo/validators";

const GHL_BASE_URL = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";
const PAGE_LIMIT = 100;

type PageCursor = { startAfterId: string; startAfter: number } | undefined;

async function fetchPage(
  token: string,
  startDate: number,
  endDate: number,
  cursor?: PageCursor
): Promise<{ contacts: GhlContact[]; nextCursor: PageCursor }> {
  const url = new URL(`${GHL_BASE_URL}/contacts/`);
  url.searchParams.set("startDate", String(startDate));
  url.searchParams.set("endDate", String(endDate));
  url.searchParams.set("limit", String(PAGE_LIMIT));
  if (cursor) {
    url.searchParams.set("startAfterId", cursor.startAfterId);
    url.searchParams.set("startAfter", String(cursor.startAfter));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      Version: GHL_API_VERSION,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GHL API ${res.status}: ${body}`);
  }

  const parsed = ghlContactsResponseSchema.parse(await res.json());
  const meta = parsed.meta;

  const nextCursor: PageCursor =
    meta?.startAfterId && meta?.startAfter
      ? { startAfterId: meta.startAfterId, startAfter: meta.startAfter }
      : undefined;

  return { contacts: parsed.contacts, nextCursor };
}

async function fetchDay(token: string, dayStart: Date): Promise<GhlContact[]> {
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const all: GhlContact[] = [];
  let cursor: PageCursor;

  do {
    const { contacts, nextCursor } = await fetchPage(token, dayStart.getTime(), dayEnd.getTime(), cursor);
    all.push(...contacts);
    cursor = nextCursor;
  } while (cursor);

  return all;
}

export const crmIntegration = {
  async fetchContacts(clientId: string, from: Date, to: Date): Promise<GhlContact[]> {
    const integration = await prisma.integration.findUnique({
      where: { client_id_platform: { client_id: clientId, platform: "CRM" } },
    });

    if (!integration) return [];

    const creds = integration.credentials as { api_key?: string };
    const token = creds.api_key;
    if (!token) return [];

    const all: GhlContact[] = [];
    const cursor = new Date(from);

    while (cursor < to) {
      const dayContacts = await fetchDay(token, new Date(cursor));
      all.push(...dayContacts);
      cursor.setDate(cursor.getDate() + 1);
    }

    return all;
  },
};
