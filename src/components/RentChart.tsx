"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartData = {
  name: string;
  "Loyer mensuel brut": number;
  "Rendement brut annuel (%)": number;
};

export default function RentChart({ data }: { data: ChartData[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const colors = {
    grid: theme === "dark" ? "#374151" : "#e5e7eb",
    axis: theme === "dark" ? "#d1d5db" : "#1f2937",
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipColor: theme === "dark" ? "#f9fafb" : "#111827",
    rentBar: "#3b82f6",
    yieldBar: "#f59e0b",
    legendRent: "#60a5fa",
    legendYield: "#fbbf24",
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 40, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={colors.axis} />
          <YAxis yAxisId="left" orientation="left" stroke={colors.axis} />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.axis}
            tickFormatter={(val) => val.toFixed(0)}
          />
          <Tooltip
            wrapperStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipColor }}
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="top"
            formatter={(val) =>
              val === "Loyer mensuel brut" ? (
                <span style={{ color: colors.legendRent }}>{val}</span>
              ) : val === "Rendement brut annuel (%)" ? (
                <span style={{ color: colors.legendYield }}>{val}</span>
              ) : (
                val
              )
            }
          />
          <Bar yAxisId="left" dataKey="Loyer mensuel brut" fill={colors.rentBar} />
          <Bar yAxisId="right" dataKey="Rendement brut annuel (%)" fill={colors.yieldBar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
