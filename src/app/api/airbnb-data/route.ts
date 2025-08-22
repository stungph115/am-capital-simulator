import { NextResponse } from "next/server";
import axios from "axios";
import { cities } from "../rent-data/cities";


export async function GET() {
  const results: any[] = [];

  // Parcours toutes les villes
  for (const city of cities) {
    // Exemple : utiliser le code postal comme city_id fictif pour AirDNA
    const cityId = city.slug.split("-")[1]; // ex: "paris-75000" -> "75000"

    // Calcul du mois dernier
    const now = new Date();
    let startYear = now.getFullYear();
    let startMonth = now.getMonth();
    if (startMonth === 0) {
      startMonth = 12;
      startYear -= 1;
    }

    // Appel AirDNA (POC avec clé fake)
    const AIRDNA_API_KEY = process.env.AIRDNA_API_KEY

    let nightlyPrice = null;

    try {
      const response = await axios.get(
        `https://api.airdna.co/client/v1/market/revenue/monthly`,
        {
          params: {
            access_token: AIRDNA_API_KEY,
            start_year: startYear,
            start_month: startMonth,
            number_of_months: 1,
            city_id: cityId,
            room_types: "entire_place",
            bedrooms: 2,
            currency: "eur",
            percentiles: 0.5,
          },
          timeout: 5000,
        }
      );
      // ici normalement response.data contiendrait le revenu mensuel, on calcule prix/nuit
      nightlyPrice = response.data?.monthlyRevenue / 30 || null;
    } catch (err) {
      // return err;
      
    }

    results.push({
      city: city.name,
      city_id: cityId,
      nightlyPrice,
    });
  }

  return NextResponse.json({ results });
}
