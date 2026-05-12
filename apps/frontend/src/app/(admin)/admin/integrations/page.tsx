import { PageHeader } from "@/components/common/PageHeader";

// [FIX 5] Per-client integration config: Google Ads ID, Meta account ID, GA4 property ID, GMB location IDs, CRM config
export default function AdminIntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Configure per-client API credentials and platform IDs"
      />
    </div>
  );
}
