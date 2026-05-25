"use client";
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  Table,
  Th,
  Td,
  LoadingState,
  ErrorState,
  NoIntegration,
} from "@/components/ui";
import { LocationBarChart } from "@/components/charts";
import { ExportButton } from "@/components/common/ExportButton";
import { useMetaAds } from "@/hooks/useDashboard";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import {
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";
import type { DateRange } from "@/types";

export const MetaAdsTab = ({
  clientId,
  dateRange,
}: {
  clientId: string;
  dateRange: DateRange;
}) => {
  const { data, isLoading, error, refetch } = useMetaAds(clientId, dateRange);

  if (isLoading) return <LoadingState message="Loading Meta Ads data..." />;
  if (error)
    return <ErrorState message={(error as Error).message} onRetry={refetch} />;
  if (!data) return null;
  if (!data.hasIntegration) return <NoIntegration service="Meta Ads" />;

  const locationChartData = data.locations.map((l) => ({
    location: l.adsetName,
    value: l.spend,
  }));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Meta Spend"
          value={formatCurrency(data.metaSpend)}
          color="text-slate-800"
          icon={<DollarSign size={16} />}
        />
        <StatCard
          label="Impressions"
          value={formatNumber(data.impressions)}
          color="text-blue-600"
          icon={<Eye size={16} />}
        />
        <StatCard
          label="Clicks"
          value={formatNumber(data.clicks)}
          color="text-brand-600"
          icon={<MousePointer size={16} />}
        />
        <StatCard
          label="CTR %"
          value={formatPercent(data.ctr, 2)}
          color="text-purple-600"
          icon={<Target size={16} />}
        />
        <StatCard
          label="CPL"
          value={formatCurrency(data.cpl)}
          color="text-amber-600"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Leads"
          value={formatNumber(data.leads)}
          color="text-emerald-600"
          icon={<Users size={16} />}
        />
      </div>

      {/* Campaigns table */}
<Card className="flex flex-col">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Campaigns Table</CardTitle>
      <ExportButton data={data.campaigns} filename="meta-ads-campaigns" />
    </div>
  </CardHeader>
  <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-x-scrollbar">
    <table className="w-full min-w-[600px] text-sm">
      <thead>
        <tr className="sticky top-0 z-10 bg-slate-50 border-y border-slate-100">
          <Th className="w-10">#</Th>
          <Th className="min-w-[180px]">CAMPAIGN NAME</Th>
          <Th className="min-w-[90px]">SPEND (₹)</Th>
          <Th className="min-w-[100px]">IMPRESSIONS</Th>
          <Th className="min-w-[80px]">CLICKS</Th>
          <Th className="min-w-[90px]">CPC (₹)</Th>
          <Th className="min-w-[90px]">CPL (₹)</Th>
        </tr>
      </thead>
      <tbody>
        {data.campaigns.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-10 text-sm text-slate-400">
              No campaign data
            </td>
          </tr>
        ) : (
          data.campaigns.map((row, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <Td className="text-slate-400 text-xs">{i + 1}</Td>
              <Td className="font-medium max-w-[180px] truncate text-slate-800" title={row.campaignName}>
                {row.campaignName}
              </Td>
              <Td className="font-semibold">{formatCurrency(row.spend)}</Td>
              <Td>{formatNumber(row.impressions)}</Td>
              <Td>{formatNumber(row.clicks)}</Td>
              <Td>{formatCurrency(row.cpc)}</Td>
              <Td>{formatCurrency(row.cpl)}</Td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Location spend chart + table */}
  <Card className="flex flex-col">
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Location Table</CardTitle>
      <ExportButton data={data.locations} filename="meta-ads-locations" />
    </div>
  </CardHeader>
  {locationChartData.length > 0 && (
    <div className="px-5 pt-2">
      <LocationBarChart data={locationChartData} label="Spend (₹)" />
    </div>
  )}
  <div className="overflow-x-auto overflow-y-auto max-h-[280px] hide-x-scrollbar">
    <table className="w-full min-w-[550px] text-sm">
      <thead>
        <tr className="sticky top-0 z-10 bg-slate-50 border-y border-slate-100">
          <Th className="w-10">#</Th>
          <Th className="min-w-[120px]">ADSET / LOCATION</Th>
          <Th className="min-w-[90px]">SPEND</Th>
          <Th className="min-w-[100px]">IMPRESSIONS</Th>
          <Th className="min-w-[80px]">CLICKS</Th>
          <Th className="min-w-[70px]">CTR</Th>
          <Th className="min-w-[90px]">COST/MSG</Th>
        </tr>
      </thead>
      <tbody>
        {data.locations.map((row, i) => (
          <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <Td className="text-slate-400 text-xs">{i + 1}</Td>
            <Td className="font-medium">{row.adsetName}</Td>
            <Td>{formatCurrency(row.spend)}</Td>
            <Td>{formatNumber(row.impressions)}</Td>
            <Td>{formatNumber(row.clicks)}</Td>
            <Td>{formatPercent(row.ctr, 2)}</Td>
            <Td>{formatCurrency(row.costPerMessage)}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</Card>
        {/* Ads table */}
        {/* Ads table — only shown for clients that have ad-level data */}
{data.hasAdsTable && (
  <Card className="flex flex-col">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>Ads Table</CardTitle>
        <ExportButton data={data.ads} filename="meta-ads-creatives" />
      </div>
    </CardHeader>

    <div className="overflow-x-auto overflow-y-auto max-h-[520px] hide-x-scrollbar">
      <table className="w-full min-w-[700px] text-sm">
        <thead>
          <tr className="sticky top-0 z-10 bg-slate-50 border-y border-slate-100">
            <Th className="w-10">#</Th>
            <Th className="min-w-[140px]">AD NAME</Th>
            <Th className="min-w-[90px]">SPEND</Th>
            <Th className="min-w-[100px]">IMPRESSIONS</Th>
            <Th className="min-w-[80px]">CLICKS</Th>
            <Th className="min-w-[70px]">CTR</Th>
            <Th className="min-w-[100px]">COST/CLICK</Th>
            <Th className="min-w-[100px]">ENGAGEMENT</Th>
          </tr>
        </thead>
        <tbody>
          {data.ads.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <Td className="text-xs text-slate-400">{i + 1}</Td>
              <Td className="font-medium max-w-[140px] truncate">{row.adName}</Td>
              <Td>{formatCurrency(row.spend)}</Td>
              <Td>{formatNumber(row.impressions)}</Td>
              <Td>{formatNumber(row.clicks)}</Td>
              <Td>{formatPercent(row.ctr, 2)}</Td>
              <Td>{formatCurrency(row.costPerLinkClick)}</Td>
              <Td>{formatNumber(row.postEngagement)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
)}
      </div>
    </div>
  );
};
