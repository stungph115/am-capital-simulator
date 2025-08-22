"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type CityData = {
  name: string;
  Apartment?: number | null;
  House?: number | null;
};

type Props = {
  data: CityData[];
};

export default function CityComparisonChart({ data }: Props) {
  return (
    <div className="overflow-x-auto py-4">
      <div className="min-w-[600px]">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value?.toLocaleString()} €`} />
            <Legend
              formatter={(value) =>
                value === "Apartment" ? "Appartement" : value === "House" ? "Maison" : value
              }
            />
            <Bar dataKey="Apartment" fill="#121f3e" />
            <Bar dataKey="House" fill="#2c5282" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
