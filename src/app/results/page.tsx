"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { computeAll } from "@/lib/calculation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RentChart from "@/components/RentChart";
import BreakevenChart from "@/components/BreakEvenChart";
import ExportPDFButton from "@/components/ExportPDFButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RefreshingSpinner from "@/components/RefreshingSpinner";

type CityDataAPI = {
  city: string;
  city_id: string;
  apartment: number | null;
  house: number | null;
};

type DBResponse = {
  results: CityDataAPI[];
  updatedAt: string | null;
};

type RoomType = "Studio" | "T2" | "T3" | "T4";

export default function ResultatsPage() {
  const [cityData, setCityData] = useState<CityDataAPI | null>(null);
  const [dbUpdatedAt, setDbUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const searchParams = useSearchParams();

  const price = searchParams.get("price");
  const surface = searchParams.get("surface");
  const rooms = searchParams.get("rooms") as RoomType | null;
  const type = searchParams.get("type");
  const city = searchParams.get("city");
  const propertyType = searchParams.get("propertyType");

  const fetchLocalData = useCallback(async () => {
    try {
      const res = await axios.get<DBResponse>("/api/rent-data");
      const found = res.data.results.find(
        (c) => c.city.toLowerCase() === city!.toLowerCase()
      );
      setCityData(found || null);
      setDbUpdatedAt(res.data.updatedAt);
    } catch (err) {
      console.error("Erreur fetch rent-data:", err);
      setCityData(null);
    }
  }, [city]);

  const refreshData = useCallback(async () => {
    if (!city) return;
    try {
      setRefreshing(true);
      const res = await axios.post<DBResponse>("/api/rent-data/refresh");
      const found = res.data.results.find(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );
      setCityData(found || null);
      setDbUpdatedAt(res.data.updatedAt);
    } catch (err) {
      console.error("Erreur refresh rent-data:", err);
    } finally {
      setRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    setLoading(true);
    fetchLocalData().finally(() => setLoading(false));
    refreshData(); // refresh immediately

    const interval = setInterval(() => {
      refreshData();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [fetchLocalData, refreshData]);

  if (!price || !surface || !rooms || !type || !city || !propertyType) {
    const requiredParams: string[] = ["price", "surface", "rooms", "type", "city", "propertyType"];
    const missingParams = requiredParams.filter((param) => !searchParams.get(param));
    return (
      <div className="max-w-2xl mx-auto py-50 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Paramètres manquants</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Les paramètres suivants sont requis : {missingParams.join(", ")}.
        </p>
        <Link
          href="/simulation"
          className="inline-block mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-blue-700"
        >
          ← Retour au formulaire
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-xl">Chargement des données...</div>;
  }

  if (!cityData) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Résultats</h1>
        <p className="text-red-500">Ville introuvable ou données non disponibles.</p>
      </div>
    );
  }

  const rentPerM2 = propertyType === "apartment" ? cityData.apartment : cityData.house;
  if (rentPerM2 === null) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Résultats</h1>
        <p className="text-red-500">Données de loyer non disponibles pour ce type de bien.</p>
      </div>
    );
  }

  const priceNum = Number(price);
  const surfaceNum = Number(surface);

  const longueResult = computeAll({
    price: priceNum,
    surface: surfaceNum,
    rooms,
    type: "longue",
    rentPerM2,
  });

  const courteResult = computeAll({
    price: priceNum,
    surface: surfaceNum,
    rooms,
    type: "courte",
    rentPerM2,
    //ajouter data Airdna ici plus tard
  });

  const mainResult = type === "longue" ? longueResult : courteResult;
  const compareResult = type === "longue" ? courteResult : longueResult;
  const mainLabel = type === "longue" ? "Longue durée" : "Courte durée";
  const compareLabel = type === "longue" ? "Courte durée" : "Longue durée";

  const chartData = [
    {
      name: mainLabel,
      "Loyer mensuel brut": mainResult.monthlyBase,
      "Rendement brut annuel (%)": mainResult.grossYield * 100,
    },
    {
      name: compareLabel,
      "Loyer mensuel brut": compareResult.monthlyBase,
      "Rendement brut annuel (%)": compareResult.grossYield * 100,
    },
  ];

  const months = 240; // 20 ans
  const profitData: { month: number; "Longue durée": number; "Courte durée": number }[] = Array.from(
    { length: months },
    (_, i) => ({
      month: i + 1,
      "Longue durée": longueResult.netMonthly * (i + 1) - longueResult.totalInvestment,
      "Courte durée": courteResult.netMonthly * (i + 1) - courteResult.totalInvestment,
    })
  );

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold flex items-center gap-2">Résultats de la simulation</h1>
      {refreshing && <RefreshingSpinner />}
      {/* button group */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/simulation"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:text-[#121f3e]"
        >
          ← Retour au formulaire
        </Link>
        <ExportPDFButton />
        <Link
          href="/contact"
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📩 <span>Contactez-nous</span>
        </Link>
      </div>

      <div id="to-print" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Données saisies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>🏙️ Ville : <b>{city}</b></li>
              <li>💰 Prix : <b>{priceNum.toLocaleString()} €</b></li>
              <li>📏 Surface : <b>{surfaceNum} m²</b></li>
              <li>🛋️ Pièces : <b>{rooms}</b></li>
              <li>📌 Type sélectionné : <b>{mainLabel}</b></li>
              <li>
                🏠 Type de bien : <b>{propertyType === "apartment" ? "Appartement" : "Maison"}</b>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Résultats financiers + chart */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats financiers pour la location {mainLabel}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-lg">
                <li>
                  📦 Investissement total : <b>{mainResult.totalInvestment.toLocaleString()} €</b>
                </li>
                <li>
                  📈 Loyer mensuel brut : <b>{mainResult.monthlyBase.toFixed(0)} €</b>
                </li>
                <li>
                  💸 Loyer mensuel net (~95%) : <b>{mainResult.netMonthly.toFixed(0)} €</b>
                </li>
                <li>
                  📊 Rendement brut annuel : <b>{(mainResult.grossYield * 100).toFixed(2)} %</b>
                </li>
              </ul>

              <div className="mt-4 p-4 rounded bg-gray-50 text-sm dark:text-[#1a233a]">
                <h3 className="font-semibold mb-2">Comparaison avec {compareLabel}</h3>
                <ul className="space-y-1">
                  <li>
                    📦 Investissement total : <b>{compareResult.totalInvestment.toLocaleString()} €</b>
                  </li>
                  <li>
                    📈 Loyer mensuel brut : <b>{compareResult.monthlyBase.toFixed(0)} €</b>
                  </li>
                  <li>
                    💸 Loyer mensuel net (~95%) : <b>{compareResult.netMonthly.toFixed(0)} €</b>
                  </li>
                  <li>
                    📊 Rendement brut annuel : <b>{(compareResult.grossYield * 100).toFixed(2)} %</b>
                  </li>
                </ul>
              </div>
            </div>

            <RentChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Graphiques de rentabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakevenChart data={profitData} />
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-gray-500 border-t pt-4">
          <strong>Sources des données :</strong>
          <ul className="list-disc ml-5 mt-2">
            <li>
              <span className="font-medium">Location courte durée :</span> API{" "}
              <a
                href="https://www.airdna.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                AirDNA
              </a>
            </li>
            <li>
              <span className="font-medium">Location longue durée :</span>{" "}
              <a
                href="https://www.meilleursagents.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                MeilleursAgents
              </a>
            </li>
          </ul>
          {dbUpdatedAt && (
            <p className="mt-1 text-xs text-gray-400">
              Dernière mise à jour : {new Date(dbUpdatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
