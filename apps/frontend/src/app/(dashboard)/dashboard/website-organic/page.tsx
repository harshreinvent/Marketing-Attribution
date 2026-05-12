import { KpiSection } from "@/components/screens/WebsiteOrganic/KpiSection";
import { TrendSection } from "@/components/screens/WebsiteOrganic/TrendSection";
import { LandingPageSection } from "@/components/screens/WebsiteOrganic/LandingPageSection";
import { ChannelSection } from "@/components/screens/WebsiteOrganic/ChannelSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function WebsiteOrganicPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Website & Organic" description="GA4 sessions, users, and channel breakdown" />
      <KpiSection />
      <TrendSection />
      <ChannelSection />
      <LandingPageSection />
    </div>
  );
}
