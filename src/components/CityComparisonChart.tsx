"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CityData = {
  name: string;
  Apartment?: number | null;
  House?: number | null;
};

type Props = {
  data: CityData[];
};

export default function CityComparisonChart({ data }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to prevent mismatch during SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Define colors based on theme
  const colors = {
    grid: theme === "dark" ? "#374151" : "#e5e7eb", // Tailwind gray-700 / gray-200
    axis: theme === "dark" ? "#d1d5db" : "#1f2937", // gray-300 / gray-800
    apartmentBar: "#dd4600ff",
    houseBar: "#55bd00ff",
    tooltipBg: theme === "dark" ? "#1f2937" : "#ffffff",
    tooltipColor: theme === "dark" ? "#f9fafb" : "#111827",
    legendColor: theme === "dark" ? "#f9fafb" : "#111827",
  };

  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-[600px]">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={colors.axis} />
            <YAxis stroke={colors.axis} />
            <Tooltip
              wrapperStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipColor }}
              formatter={(value: number) => `${value?.toLocaleString()} €`}
            />
            <Legend
              formatter={(value) =>
                value === "Apartment"
                  ? "Appartement"
                  : value === "House"
                    ? "Maison"
                    : value
              }
              wrapperStyle={{ color: colors.legendColor }}
            />
            <Bar dataKey="Apartment" fill={colors.apartmentBar} />
            <Bar dataKey="House" fill={colors.houseBar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
