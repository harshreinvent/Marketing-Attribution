"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Props = { data: { name: string; value: number }[]; label?: string };

export function CampaignBarChart({ data, label = "Value" }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" name={label} />
      </BarChart>
    </ResponsiveContainer>
  );
}
