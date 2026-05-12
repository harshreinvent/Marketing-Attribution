import { KpiSection } from "@/components/screens/Gmb/KpiSection";
import { DailyTrendSection } from "@/components/screens/Gmb/DailyTrendSection";
import { LocationTableSection } from "@/components/screens/Gmb/LocationTableSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function GmbPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Google My Business" description="Local presence and engagement metrics" />
      <KpiSection />
      <DailyTrendSection />
      <LocationTableSection />
    </div>
  );
}
