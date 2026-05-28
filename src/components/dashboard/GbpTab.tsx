"use client";
import { useState } from "react";
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LoadingState,
  ErrorState,
  NoIntegration,
  Th,
  Td,
} from "@/components/ui";
import { ExportButton } from "@/components/common/ExportButton";
import { useGbp } from "@/hooks/useDashboard";
import { formatNumber, formatPercent, formatExact } from "@/lib/utils";
import { Phone, Globe, Navigation, Eye, TrendingUp, Users } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import type { DateRange } from "@/types";

// ─── Chart 1: Calls + Directions — keep as is (blue + orange) ────────
const CALLS_COLOR = "#3b82f6";
const DIRECTIONS_COLOR = "#f97316";

// ─── Chart 2: Profile Views Maps vs Search — teal + gold ─────────────
const MAP_COLOR = "#0d9488"; // teal
const SEARCH_COLOR = "#f59e0b"; // gold/amber

// ─── Chart 3: Daily Trend — slate + rose + violet ────────────────────
const TREND_CALLS_COLOR = "#64748b"; // slate
const TREND_DIR_COLOR = "#f43f5e"; // rose
const TREND_WEB_COLOR = "#8b5cf6"; // violet

// ─── Chart 4: Impressions Breakdown stacked — like reference image ───
// dark teal base → purple → pink → gold top
const IMP_COLORS = {
  desktopMaps: "#1B4E6B", // dark teal   (bottom)
  desktopSearch: "#5C63A1", // purple
  mobileMaps: "#C068A7", // pink
  mobileSearch: "#EB7175", // gold        (top)
};

// ─── Section title ────────────────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm font-semibold text-brand-600 text-center mb-4">
    {children}
  </p>
);

// ─── Pagination ───────────────────────────────────────────────────────
const Pagination = ({
  page,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-2 border-t border-slate-100 text-xs text-slate-500">
      <span>
        {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} /{" "}
        {total}
      </span>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
      >
        ‹
      </button>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
};

// ─── Impressions stacked bar (like reference image) ───────────────────
const ImpressionStackedBar = ({
  data,
}: {
  data: {
    location: string;
    desktopMaps: number;
    desktopSearch: number;
    mobileMaps: number;
    mobileSearch: number;
  }[];
}) => {
  const chartData = data.map((d) => ({
    location:
      d.location.length > 10 ? d.location.slice(0, 10) + "…" : d.location,
    "Desktop Maps": d.desktopMaps,
    "Desktop Search": d.desktopSearch,
    "Mobile Maps": d.mobileMaps,
    "Mobile Search": d.mobileSearch,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="location" tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #f1f5f9",
            fontSize: 12,
          }}
          formatter={(v: number) => formatExact(v)}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
        <Bar
          dataKey="Desktop Maps"
          stackId="a"
          fill={IMP_COLORS.desktopMaps}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Desktop Search"
          stackId="a"
          fill={IMP_COLORS.desktopSearch}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Mobile Maps"
          stackId="a"
          fill={IMP_COLORS.mobileMaps}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="Mobile Search"
          stackId="a"
          fill={IMP_COLORS.mobileSearch}
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ─── Main GBP tab ─────────────────────────────────────────────────────
export const GbpTab = ({
  clientId,
  dateRange,
}: {
  clientId: string;
  dateRange: DateRange;
}) => {
  const { data, isLoading, error, refetch } = useGbp(clientId, dateRange);
  const [locPage, setLocPage] = useState(1);
  const LOC_PAGE_SIZE = 5;

  if (isLoading) return <LoadingState message="Loading GBP data..." />;
  if (error)
    return <ErrorState message={(error as Error).message} onRetry={refetch} />;
  if (!data) return null;
  if (!data.hasIntegration)
    return <NoIntegration service="Google Business Profile" />;

  const pagedLocations = data.locations.slice(
    (locPage - 1) * LOC_PAGE_SIZE,
    locPage * LOC_PAGE_SIZE,
  );

  const callDirChartData = data.locations.map((l) => ({
    location: l.name.length > 10 ? l.name.slice(0, 10) + "…" : l.name,
    "Call Clicks": l.callClicks,
    "Direction Requests": l.directionRequests,
  }));

  const profileViewsChartData = data.impressionBreakdown.map((d) => ({
    location:
      d.location.length > 10 ? d.location.slice(0, 10) + "…" : d.location,
    "Maps Impressions": d.desktopMaps + d.mobileMaps,
    "Search Impressions": d.desktopSearch + d.mobileSearch,
  }));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="GBP Call Clicks"
          value={formatExact(data.callClicks)}
          color="text-brand-600"
          icon={<Phone size={16} />}
        />
        <StatCard
          label="Total Profile Views"
          value={formatExact(data.totalProfileViews)}
          color="text-blue-600"
          icon={<Eye size={16} />}
        />
        <StatCard
          label="Direction Requests"
          value={formatExact(data.directionRequests)}
          color="text-purple-600"
          icon={<Navigation size={16} />}
        />
        <StatCard
          label="Website Clicks (GBP)"
          value={formatExact(data.websiteClicks)}
          color="text-emerald-600"
          icon={<Globe size={16} />}
        />
        <StatCard
          label="Call CTR %"
          value={formatPercent(data.callCtr, 2)}
          color="text-amber-600"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Total Engagement"
          value={formatExact(data.totalEngagement)}
          color="text-rose-600"
          icon={<Users size={16} />}
        />
      </div>

      {/* ── Location Performance Table ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Location Performance Table</CardTitle>
            <ExportButton
              data={data.locations}
              filename="gbp-location-performance"
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-slate-100">
                <Th>#</Th>
                <Th>Locations</Th>
                <Th>Call Clicks ↓</Th>
                <Th>Website Clicks</Th>
                <Th>Direction Requests</Th>
                <Th>Profile Views</Th>
                <Th>Call CTR %</Th>
                <Th>Website CTR %</Th>
                <Th>Total Engagement</Th>
              </tr>
            </thead>
            <tbody>
              {pagedLocations.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-sm text-slate-400"
                  >
                    No GBP data for this period
                  </td>
                </tr>
              ) : (
                pagedLocations.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-50"
                  >
                    <Td className="text-slate-400 text-xs">
                      {(locPage - 1) * LOC_PAGE_SIZE + i + 1}.
                    </Td>
                    <Td className="font-medium text-slate-800">{row.name}</Td>
                    <Td className="font-semibold text-brand-600">
                      {formatExact(row.callClicks)}
                    </Td>
                    <Td>{formatExact(row.websiteClicks)}</Td>
                    <Td>{formatExact(row.directionRequests)}</Td>
                    <Td>{formatExact(row.profileViews)}</Td>
                    <Td>{formatPercent(row.callCtr, 2)}</Td>
                    <Td>{formatPercent(row.websiteCtr, 2)}</Td>
                    <Td className="font-medium">
                      {formatExact(row.totalEngagement)}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={locPage}
          total={data.locations.length}
          pageSize={LOC_PAGE_SIZE}
          onPage={setLocPage}
        />
      </Card>

      {/* ── Bar charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Calls + Directions — blue + orange (unchanged) */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>Calls + Directions by Branch</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={callDirChartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="location"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="Call Clicks"
                  fill={CALLS_COLOR}
                  radius={[3, 3, 0, 0]}
                  label={{ position: "top", fontSize: 10, fill: "#1e40af" }}
                />
                <Bar
                  dataKey="Direction Requests"
                  fill={DIRECTIONS_COLOR}
                  radius={[3, 3, 0, 0]}
                  label={{ position: "top", fontSize: 10, fill: "#c2410c" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Profile Views — teal + gold */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>
              Profile Views — Maps vs Search by Branch
            </SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={profileViewsChartData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="location"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="Maps Impressions"
                  fill={MAP_COLOR}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="Search Impressions"
                  fill={SEARCH_COLOR}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Daily trend + Impressions breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 3: Daily Trend — slate + rose + violet */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>Daily GBP Activity Trend</SectionTitle>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart
                data={data.dailyTrend}
                margin={{ top: 5, right: 15, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  interval="preserveStartEnd"
                  tickFormatter={(d) => {
                    const dt = new Date(d);
                    return `${dt.toLocaleString("default", { month: "short" })} ${dt.getDate()}`;
                  }}
                />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #f1f5f9",
                    fontSize: 12,
                  }}
                  labelFormatter={(l) =>
                    new Date(l).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
                <Line
                  type="monotone"
                  dataKey="calls"
                  name="Calls"
                  stroke={TREND_CALLS_COLOR}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="directions"
                  name="Directions"
                  stroke={TREND_DIR_COLOR}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="websiteClicks"
                  name="Website Clicks"
                  stroke={TREND_WEB_COLOR}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Impressions Breakdown — dark teal + purple + pink + gold */}
        <Card>
          <CardContent className="pt-4">
            <SectionTitle>Impressions Breakdown by Location</SectionTitle>
            {data.impressionBreakdown.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-slate-400">
                No impression data for this period
              </div>
            ) : (
              <ImpressionStackedBar data={data.impressionBreakdown} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
