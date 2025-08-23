import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { cities, type City } from "../cities";
import { promises as fs } from "fs";
import path from "path";
type CityRentData = {
    city: string;
    city_id: string;
    apartment: number | null;
    house: number | null;
};

const DATA_FILE = path.join(process.cwd(), "src/app/api/rent-data/data-rent.json");

async function readLocalDB() {
    try {
        const file = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(file);
    } catch {
        return { results: [], updatedAt: null };
    }
}

async function writeLocalDB(results: CityRentData[]) {
    const db = {
        updatedAt: new Date().toISOString(),
        results,
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
    return db;
}

async function fetchCityRent(city: City) {
    try {
        const url = `https://www.meilleursagents.com${city.url}`;
        const { data: html } = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
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

export async function POST() {
    const localDB = await readLocalDB();
    const results: CityRentData[] = [];

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const data = await fetchCityRent(city);
        // fallback giữ dữ liệu cũ nếu scrape lỗi
        const fallback = localDB.results[i];
        results.push({
            city: data.city,
            city_id: data.city_id,
            apartment: data.apartment ?? fallback?.apartment ?? null,
            house: data.house ?? fallback?.house ?? null,
        });
    }

    const updatedDB = await writeLocalDB(results);
    return NextResponse.json({
        message: "Database updated successfully",
        ...updatedDB,
    });
}
