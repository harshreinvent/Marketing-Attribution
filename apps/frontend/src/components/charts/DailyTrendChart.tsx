"use client";

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ChartData } from "@repo/types";

type Props = { data: ChartData[]; spendKey?: string; leadsKey?: string };

export function DailyTrendChart({ data, spendKey = "spend", leadsKey = "leads" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey={spendKey} fill="#3b82f6" name="Spend" />
        <Line yAxisId="right" type="monotone" dataKey={leadsKey} stroke="#10b981" name="Leads" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
