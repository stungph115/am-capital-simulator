"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type BreakevenChartProps = {
  data: { month: number; "Longue durée": number; "Courte durée": number }[];
};

export default function BreakevenChart({ data }: BreakevenChartProps) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-[600px] h-100">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="month"
              label={{ value: "Mois", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              label={{ value: "Profit cumulé (€)", angle: -90, position: "outsideLeft", offset: -5 }}
            />
            <Tooltip formatter={(val: number) => val.toFixed(0) + " €"} />
            <Legend />
            <Line type="monotone" dataKey="Longue durée" stroke="#3b82f6" dot={false} />
            <Line type="monotone" dataKey="Courte durée" stroke="#f59e0b" dot={false} />
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#6b6b6bff"
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
