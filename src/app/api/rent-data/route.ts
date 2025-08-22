import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { cities, type City } from "./cities";
import dataDump from "./data-dump.json";


async function fetchCityRent(city: City) {
    try {
        const url = `https://www.meilleursagents.com${city.url}`;
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
                "Cache-Control": "no-cache",
                "Referer": "https://www.meilleursagents.com/prix-immobilier/",
                "Cookie": process.env.HEADER_COOKIE || "",
            },
            timeout: 5000,
        });

        const $ = cheerio.load(html);
        const rentalSection = $("#prices-summary-rental");

        const parsePrice = (text: string) =>
            parseFloat(text.replace(/\s/g, "").replace(",", "."));

        const apartmentText = rentalSection
            .find(".prices-summary__apartment-prices .big-number")
            .first()
            .text()
            .trim();
        const houseText = rentalSection
            .find(".prices-summary__house-prices .big-number")
            .first()
            .text()
            .trim();

        return {
            city: city.name,
            city_id: city.slug.split("-")[1],
            apartment: parsePrice(apartmentText),
            house: parsePrice(houseText),
        };
    } catch (err) {
        console.error(`Erreur pour ${city.name}:`, err);
        return {
            city: city.name,
            city_id: city.slug.split("-")[1],
            apartment: null,
            house: null,
        };
    }
}
export async function GET(req: NextRequest) {
    try {
        const results = await Promise.all(
            cities.map(async (city, i) => {
                try {
                    const data = await fetchCityRent(city);
                    const fallback = dataDump.results[i];
                    return {
                        city: data.city,
                        city_id: data.city_id,
                        apartment: data.apartment ?? fallback.apartment,
                        house: data.house ?? fallback.house,
                    };
                } catch (err) {
                    console.error(`Erreur fetch pour ${city.name}, fallback au dump`, err);
                    const fallback = dataDump.results[i];
                    return {
                        city: city.name,
                        city_id: city.slug.split("-")[1],
                        apartment: fallback.apartment,
                        house: fallback.house,
                    };
                }
            })
        );

        return NextResponse.json({ results });
    } catch (err) {
        console.error("Erreur globale, retour au dump complet", err);
        return NextResponse.json({ results: dataDump.results });
    }
}
