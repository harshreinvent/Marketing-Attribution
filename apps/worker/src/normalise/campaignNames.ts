import { normaliseCampaignName } from "@repo/utils";
import { auditLog } from "./auditLog";

export async function normaliseCampaign(clientId: string, original: string) {
  const normalised = normaliseCampaignName(original);
  if (normalised !== original) {
    await auditLog({ clientId, table: "campaigns", original, normalised });
  }
  return normalised;
}
