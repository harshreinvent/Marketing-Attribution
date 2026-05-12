"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ChartData } from "@repo/types";

type Props = { data: ChartData[] };

export function CTRLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
        <Tooltip formatter={(v: number) => `${(v * 100).toFixed(2)}%`} />
        <Line type="monotone" dataKey="ctr" stroke="#f59e0b" name="CTR" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
