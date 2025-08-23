"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type BreakevenChartProps = {
  data: { month: number; "Longue durée": number; "Courte durée": number }[];
};

export default function BreakevenChart({ data }: BreakevenChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const colors = {
    grid: theme === "dark" ? "#374151" : "#e5e7eb",
    axis: theme === "dark" ? "#d1d5db" : "#1f2937",
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipColor: theme === "dark" ? "#f9fafb" : "#111827",
    longLine: "#3b82f6",
    shortLine: "#f59e0b",
    breakEven: theme === "dark" ? "#d1d5db" : "#1f2937",
    legendLong: "#60a5fa",
    legendShort: "#fbbf24",
  };

  return (
    <div className="overflow-auto py-4">
      <div className="min-w-[700px] h-120">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 40, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              stroke={colors.axis}
              label={{ value: "Mois", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              stroke={colors.axis}
              width={80}
              tickFormatter={(val) => val.toLocaleString()}
              label={{
                value: "Profit cumulé (€)",
                angle: 0,
                position: "insideTopLeft",
                offset: -25,
                style: { textAnchor: "start" },
              }}
            />
            <Tooltip
              wrapperStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipColor }}
              formatter={(val: number) => val.toLocaleString() + " €"}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              formatter={(val) =>
                val === "Longue durée" ? (
                  <span style={{ color: colors.legendLong }}>{val}</span>
                ) : val === "Courte durée" ? (
                  <span style={{ color: colors.legendShort }}>{val}</span>
                ) : (
                  val
                )
              }
            />
            <Line type="monotone" dataKey="Longue durée" stroke={colors.longLine} dot={false} />
            <Line type="monotone" dataKey="Courte durée" stroke={colors.shortLine} dot={false} />
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke={colors.breakEven}
              strokeDasharray="5 5"
              name="Break-even"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
