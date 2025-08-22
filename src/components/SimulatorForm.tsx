"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cities } from "@/app/api/rent-data/cities";

const roomsOptions = ["Studio", "T2", "T3", "T4"];
const typeOptions = [
  { value: "longue", label: "🏢 Longue durée" },
  { value: "courte", label: "🏠 Courte durée" },
];
const propertyTypeOptions = [
  { value: "apartment", label: "Appartement 🏢" },
  { value: "house", label: "Maison 🏠" },
];

export default function SimulatorForm() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<"apartment" | "house">("apartment");
  const [price, setPrice] = useState(250000);
  const [surface, setSurface] = useState(60);
  const [rooms, setRooms] = useState<"Studio" | "T2" | "T3" | "T4">("T2");
  const [type, setType] = useState<"longue" | "courte">("longue");
  const [city, setCity] = useState("Paris");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/results?price=${price}&surface=${surface}&rooms=${rooms}&type=${type}&city=${encodeURIComponent(
        city
      )}&propertyType=${propertyType}`
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center text-[#121f3e] mb-4">Simulateur Immobilier</h2>

      {/* Prix */}
      <div className="space-y-2">
        <Label htmlFor="price" className="font-semibold text-[#121f3e]">Prix du bien (€)</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mb-2 border-[#121f3e] focus:ring-[#121f3e]"
        />
        <Slider
          min={50000}
          max={1000000}
          step={1000}
          value={[price]}
          onValueChange={(val) => setPrice(val[0])}
          className="accent-[#121f3e]"
        />
      </div>

      {/* Surface */}
      <div className="space-y-2">
        <Label htmlFor="surface" className="font-semibold text-[#121f3e]">Surface (m²)</Label>
        <Input
          id="surface"
          type="number"
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
          className="mb-2 border-[#121f3e] focus:ring-[#121f3e]"
        />
        <Slider
          min={10}
          max={200}
          step={1}
          value={[surface]}
          onValueChange={(val) => setSurface(val[0])}
          className="accent-[#121f3e]"
        />
      </div>

      {/* Type de bien */}
      <div className="space-y-2">
        <Label className="font-semibold text-[#121f3e]">Type de bien</Label>
        <RadioGroup
          value={propertyType}
          onValueChange={(val) => setPropertyType(val as "apartment" | "house")}
          className="flex gap-6 mt-2"
        >
          {propertyTypeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={opt.value} className="border-[#121f3e] checked:bg-[#121f3e]" />
              <Label htmlFor={opt.value}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Nombre de pièces */}
      <div className="space-y-2">
        <Label className="font-semibold text-[#121f3e]">Nombre de pièces</Label>
        <RadioGroup
          value={rooms}
          onValueChange={(val) => setRooms(val as "Studio" | "T2" | "T3" | "T4")}
          className="flex gap-4 mt-2"
        >
          {roomsOptions.map((r) => (
            <div key={r} className="flex items-center space-x-2">
              <RadioGroupItem value={r} id={r} className="border-[#121f3e] checked:bg-[#121f3e]" />
              <Label htmlFor={r}>{r}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Type d’exploitation */}
      <div className="space-y-2">
        <Label className="font-semibold text-[#121f3e]">Type d’exploitation</Label>
        <RadioGroup
          value={type}
          onValueChange={(val) => setType(val as "longue" | "courte")}
          className="flex gap-6 mt-2"
        >
          {typeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={opt.value} className="border-[#121f3e] checked:bg-[#121f3e]" />
              <Label htmlFor={opt.value}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Ville */}
      <div className="space-y-2">
        <Label htmlFor="city" className="font-semibold text-[#121f3e]">Ville</Label>
        <Input
          id="city"
          type="text"
          placeholder="Paris"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          list="cities-list"
          className="border-[#121f3e] focus:ring-[#121f3e]"
        />
        <datalist id="cities-list">
          {cities.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full py-3 text-lg font-semibold bg-[#121f3e] hover:bg-[#1b2b50] text-white rounded-lg shadow"
      >
        Voir les résultats
      </Button>
    </form>
  );
}
