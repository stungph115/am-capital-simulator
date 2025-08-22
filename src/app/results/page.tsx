import { computeAll } from "@/lib/calculation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RentChart from "@/components/RentChart";
import BreakevenChart from "@/components/BreakEvenChart";
import ExportPDFButton from "@/components/ExportPDFButton";
import Link from "next/link";

type SearchParams = {
  price?: string;
  surface?: string;
  rooms?: "Studio" | "T2" | "T3" | "T4";
  type?: "longue" | "courte";
  city?: string;
  propertyType?: "apartment" | "house";
};

type CityDataAPI = {
  city: string;
  city_id: string;
  apartment: number | null;
  house: number | null;
};

async function getCityData(city: string): Promise<CityDataAPI | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/rent-data`);
    const data = await res.json();
    return data.results.find(
      (c: CityDataAPI) => c.city.toLowerCase() === city.toLowerCase()
    ) || null;
  } catch (err) {
    console.error("Erreur fetch rent-data:", err);
    return null;
  }
}

async function getResults(
  price: number,
  surface: number,
  rooms: string,
  rentPerM2: number,
  nightlyPrice: number | null
) {
  const longue = computeAll({ price, surface, rooms: rooms as any, type: "longue", rentPerM2 });
  const courte = computeAll({ price, surface, rooms: rooms as any, type: "courte", rentPerM2, nightlyPrice });
  return { longue, courte };
}

export default async function ResultatsPage({ searchParams }: { searchParams: SearchParams }) {
  // Vérification des params requis
  const requiredParams: Array<keyof SearchParams> = ["price", "surface", "rooms", "type", "city", "propertyType"];
  const missingParams = requiredParams.filter(param => !searchParams[param]);

  if (missingParams.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-50 text-center space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Paramètres manquants</h1>
        <p className="text-gray-700">
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

  // Extraction des params déjà validés
  const price = Number(searchParams.price);
  const surface = Number(searchParams.surface);
  const rooms = searchParams.rooms!;
  const type = searchParams.type!;
  const city = searchParams.city!;
  const propertyType = searchParams.propertyType!;

  const cityData = await getCityData(city);
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

  // Appel AirDNA
  let nightlyPrice: number | null = null;
  try {
    const now = new Date();
    let startYear = now.getFullYear();
    let startMonth = now.getMonth();
    if (startMonth === 0) {
      startMonth = 12;
      startYear -= 1;
    }
    const AIRDNA_API_KEY = process.env.AIRDNA_API_KEY;
    const response = await fetch(
      `https://api.airdna.co/client/v1/market/revenue/monthly?access_token=${AIRDNA_API_KEY}&start_year=${startYear}&start_month=${startMonth}&number_of_months=1&city_id=${cityData.city_id}&room_types=entire_place&bedrooms=2&currency=eur&percentiles=0.5`
    );
    const data = await response.json();
    nightlyPrice = data?.monthlyRevenue ? data.monthlyRevenue / 30 : null;
  } catch {
    nightlyPrice = null;
  }

  const { longue, courte } = await getResults(price, surface, rooms, rentPerM2, nightlyPrice);

  const mainResult = type === "longue" ? longue : courte;
  const compareResult = type === "longue" ? courte : longue;
  const mainLabel = type === "longue" ? "Longue durée" : "Courte durée";
  const compareLabel = type === "longue" ? "Courte durée" : "Longue durée";

  const chartData = [
    { name: mainLabel, "Loyer mensuel brut": mainResult.monthlyBase, "Rendement brut annuel (%)": mainResult.grossYield * 100 },
    { name: compareLabel, "Loyer mensuel brut": compareResult.monthlyBase, "Rendement brut annuel (%)": compareResult.grossYield * 100 },
  ];

  const months = 120; // 10 ans
  const profitData = Array.from({ length: months }, (_, i) => ({
    month: i + 1,
    "Longue durée": longue.netMonthly * (i + 1) - longue.totalInvestment,
    "Courte durée": courte.netMonthly * (i + 1) - courte.totalInvestment,
  }));

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6" id="results-page">
      <h1 className="text-3xl font-bold">Résultats de la simulation</h1>

      {/* Nút chức năng */}
      <div className="flex gap-4 mb-6">
        <Link href="/simulation" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
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
        {/* Dữ liệu, charts giống trước */}
        <Card>
          <CardHeader><CardTitle>Données saisies</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>🏙️ Ville : <b>{city}</b></li>
              <li>💰 Prix : <b>{price.toLocaleString()} €</b></li>
              <li>📏 Surface : <b>{surface} m²</b></li>
              <li>🛋️ Pièces : <b>{rooms}</b></li>
              <li>📌 Type sélectionné : <b>{mainLabel}</b></li>
              <li>🏠 Type de bien : <b>{propertyType === "apartment" ? "Appartement" : "Maison"}</b></li>
            </ul>
          </CardContent>
        </Card>

        {/* Frais annexes */}
        <Card>
          <CardHeader><CardTitle>Frais annexes</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>⚖️ Notaire : <b>{mainResult.fees.notary.toLocaleString()} €</b></li>
              <li>🤝 Commission : <b>{mainResult.fees.commission.toLocaleString()} €</b></li>
              <li>📐 Architecte : <b>{mainResult.fees.architect.toLocaleString()} €</b></li>
            </ul>
          </CardContent>
        </Card>

        {/* Résultats financiers + chart */}
        <Card>
          <CardHeader><CardTitle>Résultats financiers pour la location {mainLabel}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div>
              <ul className="space-y-2 text-lg">
                <li>📦 Investissement total : <b>{mainResult.totalInvestment.toLocaleString()} €</b></li>
                <li>📈 Loyer mensuel brut : <b>{mainResult.monthlyBase.toFixed(0)} €</b></li>
                <li>💸 Loyer mensuel net (~95%) : <b>{mainResult.netMonthly.toFixed(0)} €</b></li>
                <li>📊 Rendement brut annuel : <b>{(mainResult.grossYield * 100).toFixed(2)} %</b></li>
              </ul>

              <div className="mt-4 p-4 rounded bg-gray-50 text-sm">
                <h3 className="font-semibold mb-2">Comparaison avec {compareLabel}</h3>
                <ul className="space-y-1">
                  <li>📦 Investissement total : <b>{compareResult.totalInvestment.toLocaleString()} €</b></li>
                  <li>📈 Loyer mensuel brut : <b>{compareResult.monthlyBase.toFixed(0)} €</b></li>
                  <li>💸 Loyer mensuel net (~95%) : <b>{compareResult.netMonthly.toFixed(0)} €</b></li>
                  <li>📊 Rendement brut annuel : <b>{(compareResult.grossYield * 100).toFixed(2)} %</b></li>
                </ul>
              </div>
            </div>

            <RentChart data={chartData} />
          </CardContent>
        </Card>

        {/* Breakeven chart */}
        <Card>
          <CardHeader><CardTitle>Graphiques de rentabilité</CardTitle></CardHeader>
          <CardContent>
            <BreakevenChart data={profitData} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
