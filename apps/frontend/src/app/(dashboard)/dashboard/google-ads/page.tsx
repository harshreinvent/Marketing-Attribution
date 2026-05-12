import { KpiSection } from "@/components/screens/GoogleAds/KpiSection";
import { TrendSection } from "@/components/screens/GoogleAds/TrendSection";
import { CampaignTableSection } from "@/components/screens/GoogleAds/CampaignTableSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function GoogleAdsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Google Ads" description="Search and display campaign performance" />
      <KpiSection />
      <TrendSection />
      <CampaignTableSection />
    </div>
  );
}
