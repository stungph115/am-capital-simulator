import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/app/api/rent-data/data-rent.json");

async function readLocalDB() {
  try {
    const file = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(file);
  } catch {
    return { results: [], updatedAt: null };
  }
}

export async function GET() {
  const localDB = await readLocalDB();
  return NextResponse.json(localDB);
}
