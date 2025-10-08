"use client";

import Spinner from "@/components/LoadingSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import RefreshingSpinner from "@/components/RefreshingSpinner";

type CityData = {
  city: string;
  apartment: number | null;
  house: number | null;
};

type RentDataAPI = {
  results: CityData[];
  updatedAt: string | null;
};

export default function Home() {
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  //  load direct from localDB
  const loadLocalData = async () => {
    try {
      const res = await axios.get<RentDataAPI>("/api/rent-data");
      setCitiesData(res.data.results.slice(0, 8));
      setUpdatedAt(res.data.updatedAt);
      setLoading(false);
    } catch (err) {
      console.error("Erreur fetch localDB:", err);
      setLoading(false);
    }
  };

  //  refresh in bground
  const refreshData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.post<RentDataAPI & { message?: string }>("/api/rent-data/refresh");
      setCitiesData(res.data.results.slice(0, 8));
      setUpdatedAt(res.data.updatedAt);
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Load localDB directly
    loadLocalData();

    // Refresh first render
    refreshData();

    // Refresh every 2 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 2 * 60 * 1000);

    // Cleanup when unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 text-center max-w-6xl mx-auto fadeInBotom">
      <h2 className="text-3xl font-bold mb-4">
        Simulez la rentabilité de votre bien
      </h2>
      <p className="text-gray-600 mb-8 dark:text-gray-300">
        Location longue ou courte durée, avec données de marché en temps réel.
      </p>

      <h3 className="text-2xl font-semibold mb-6">Exemples de loyers moyens</h3>

      {loading ? (
        <Spinner message="Chargement des données..." />
      ) : (
        <>
          {refreshing && <RefreshingSpinner />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {citiesData.map((city) => (
              <div
                key={city.city}
                className="p-4 bg-[#2c395c] dark:bg-gray-50 rounded-lg shadow flex flex-col gap-2 text-white dark:text-[#1a233a]"
              >
                <h4 className="font-bold text-lg">{city.city}</h4>
                <div className="flex justify-between text-sm">
                  <span>Appartement:</span>
                  <span>
                    {city.apartment
                      ? city.apartment.toLocaleString() + " €/m²"
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Maison:</span>
                  <span>
                    {city.house ? city.house.toLocaleString() + " €/m²" : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-8 text-sm text-gray-500 border-t pt-4">
        <strong>Sources des données :</strong>{" "}
        <span className="font-medium">Location longue durée :</span>{" "}
        <a
          href="https://www.meilleursagents.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          MeilleursAgents
        </a>
        {updatedAt && (
          <span className="ml-2 text-gray-400 dark:text-gray-500">
            (Dernière mise à jour : {new Date(updatedAt).toLocaleString()})
          </span>
        )}
      </div>

      <Link
        href="/simulation"
        className="inline-block bg-[#142344] dark:bg-white text-white dark:text-[#142344] text-xl font-bold px-12 py-3 rounded-full shadow hover:bg-[#1d315e] mb-12 m-10"
      >
        Commencer la simulation
      </Link>
    </section>
  );
}
