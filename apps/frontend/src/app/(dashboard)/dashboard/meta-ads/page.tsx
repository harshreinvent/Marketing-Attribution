import { KpiSection } from "@/components/screens/MetaAds/KpiSection";
import { TrendSection } from "@/components/screens/MetaAds/TrendSection";
import { CampaignTableSection } from "@/components/screens/MetaAds/CampaignTableSection";
import { LocationTableSection } from "@/components/screens/MetaAds/LocationTableSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function MetaAdsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Meta Ads" description="Facebook and Instagram campaign performance" />
      <KpiSection />
      <TrendSection />
      <CampaignTableSection />
      <LocationTableSection />
    </div>
  );
}
