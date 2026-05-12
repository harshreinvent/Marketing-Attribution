import { PageHeader } from "@/components/common/PageHeader";

// [FIX 5] Source mapping, location mapping, pipeline stage mapping, campaign mapping, currency/locale per client
export default function AdminMappingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mappings"
        description="Configure source, location, stage, and campaign mapping rules per client"
      />
    </div>
  );
}
