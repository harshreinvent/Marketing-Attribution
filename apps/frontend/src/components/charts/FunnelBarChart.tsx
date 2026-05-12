"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FunnelStage } from "@repo/types";

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#c084fc"];

type Props = { stages: FunnelStage[] };

export function FunnelBarChart({ stages }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={stages}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="count" name="Count">
          {stages.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
