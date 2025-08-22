import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { City } from "./cities";

export async function fetchRentPrice(city: City): Promise<{ city: string; pricePerM2: number }> {
    try {
        const res = await fetch(`https://www.meilleursagents.com${city.url}`);
        if (!res.ok) throw new Error("Failed to fetch page");
        const html = await res.text();
        console.log(`html`, html);
        const $ = cheerio.load(html);

        // Prix moyen appartement
        const priceText = $('.prices-summary__apartment-prices .prices-summary__price-range .big-number')
            .first()
            .text()
            .replace(/\s/g, '') // supprimer les espaces insécables
            .replace('€', '');

        const pricePerM2 = parseInt(priceText, 10);

        return { city: city.name, pricePerM2 };
    } catch (err) {
        console.error(`Scraping failed for ${city.name}`, err);
        return { city: city.name, pricePerM2: 0 }; // fallback temporaire
    }
}


export function applyCoefficients(pricePerM2: number) {
    return {
        studio: pricePerM2 * 1.0,
        twoRooms: pricePerM2 * 1.05,
        threeRooms: pricePerM2 * 1.1,
        fourRooms: pricePerM2 * 1.15,
        fivePlus: pricePerM2 * 1.2,
    };
}

