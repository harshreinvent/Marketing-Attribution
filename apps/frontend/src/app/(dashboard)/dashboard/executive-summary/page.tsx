import { KpiSection } from "@/components/screens/ExecutiveSummary/KpiSection";
import { ChannelMixSection } from "@/components/screens/ExecutiveSummary/ChannelMixSection";
import { DailyTrendSection } from "@/components/screens/ExecutiveSummary/DailyTrendSection";
import { ChannelTableSection } from "@/components/screens/ExecutiveSummary/ChannelTableSection";
import { FunnelSnapshotSection } from "@/components/screens/ExecutiveSummary/FunnelSnapshotSection";
import { PageHeader } from "@/components/common/PageHeader";

export default function ExecutiveSummaryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Executive Summary" description="High-level performance across all channels" />
      <KpiSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelMixSection />
        <FunnelSnapshotSection />
      </div>
      <DailyTrendSection />
      <ChannelTableSection />
    </div>
  );
}
