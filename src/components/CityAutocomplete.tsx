'use client';

import { cities } from "@/app/api/rent-data/cities";

export default function CityAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">Ville</label>
      <input
        type="text"
        list="cities-list"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Ex: Paris"
        aria-autocomplete="list"
      />
      <datalist id="cities-list">
        {cities.map((c) => (
          <option key={c.slug} value={c.name} />
        ))}
      </datalist>
      <p className="text-xs text-gray-500 mt-1">Source: MeilleursAgents / Base locale</p>
    </div>
  );
}