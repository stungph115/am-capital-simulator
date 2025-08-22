import puppeteer from "puppeteer";

export async function getDataDomeCookie(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Récupère tous les cookies
  const cookies = await page.cookies();

  await browser.close();

  // Trouve le cookie datadome
  const datadome = cookies.find(c => c.name.toLowerCase().includes("datadome"));

  if (!datadome) {
    throw new Error("Cookie DataDome non trouvé !");
  }

  return `${datadome.name}=${datadome.value}`;
}
