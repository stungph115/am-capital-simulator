"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  "Loyer mensuel brut": number;
  "Rendement brut annuel (%)": number;
};

export default function RentChart({ data }: { data: ChartData[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(val) => val.toFixed(0)}
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="Loyer mensuel brut" fill="#3b82f6" />
          <Bar yAxisId="right" dataKey="Rendement brut annuel (%)" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
