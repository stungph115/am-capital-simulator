"use client";

import Spinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";

type CityData = {
  city: string;
  apartment: number | null;
  house: number | null;
};

export default function Home() {
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rent-data")
      .then((res) => res.json())
      .then((data) => {
        setCitiesData(data.results.slice(0, 8)); // top 8 villes
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 px-4 text-center max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        Simulez la rentabilité de votre bien
      </h2>
      <p className="text-gray-600 mb-8 dark:text-gray-300">
        Location longue ou courte durée, avec données de marché en temps réel.
      </p>


      <h3 className="text-2xl font-semibold mb-6">Exemples de loyers moyens</h3>

      {loading ? (
        <Spinner message="Chargement des donées..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {citiesData.map((city) => (
            <div
              key={city.city}
              className="p-4  bg-[#2c395c] dark:bg-gray-50 rounded-lg shadow flex flex-col gap-2 text-white dark:text-[#1a233a]"
            >
              <h4 className="font-bold text-lg">{city.city}</h4>
              <div className="flex justify-between text-sm">
                <span>Appartement:</span>
                <span>{city.apartment ? city.apartment.toLocaleString() + " €/m²" : "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Maison:</span>
                <span>{city.house ? city.house.toLocaleString() + " €/m²" : "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/simulation"
        className="inline-block bg-[#142344] dark:bg-white text-white dark:text-[#142344] text-xl font-bold px-12 py-3 rounded-full shadow hover:bg-[#1d315e] mb-12 m-10"
      >
        Commencer la simulation
      </Link>
    </section>
  );
}
