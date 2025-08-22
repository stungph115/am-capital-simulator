import { NextResponse } from "next/server";
import axios from "axios";
import { cities } from "../rent-data/cities";

type CityResult = {
  city: string;
  city_id: string;
  nightlyPrice: number | null;
};

export async function GET() {
  const results: CityResult[] = [];

  for (const city of cities) {
    const cityId = city.slug.split("-")[1]; // ex: "paris-75000" -> "75000"

    const now = new Date();
    let startYear = now.getFullYear();
    let startMonth = now.getMonth();
    if (startMonth === 0) {
      startMonth = 12;
      startYear -= 1;
    }

    const AIRDNA_API_KEY = process.env.AIRDNA_API_KEY || "FAKE_TOKEN";

    let nightlyPrice: number | null = null;

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
      nightlyPrice = response.data?.monthlyRevenue
        ? response.data.monthlyRevenue / 30
        : null;
    } catch (_err) {
      // erreur ignorée volontairement
    }

    results.push({
      city: city.name,
      city_id: cityId,
      nightlyPrice,
    });
  }

  return NextResponse.json({ results });
}
