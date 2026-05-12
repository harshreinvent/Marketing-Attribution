import { KpiSection } from "@/components/screens/FunnelRoi/KpiSection";
import { FunnelBarSection } from "@/components/screens/FunnelRoi/FunnelBarSection";
import { SourceTableSection } from "@/components/screens/FunnelRoi/SourceTableSection";
import { CampaignTableSection } from "@/components/screens/FunnelRoi/CampaignTableSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function FunnelRoiPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Funnel & ROI" description="Lead-to-close funnel and return on investment" />
      <KpiSection />
      <FunnelBarSection />
      <SourceTableSection />
      <CampaignTableSection />
    </div>
  );
}
