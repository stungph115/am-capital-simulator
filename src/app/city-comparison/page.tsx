import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ErrorMessage from "@/components/ErrorMessage";
import CityComparisonChart from "@/components/CityComparisonChart";

export default async function CityComparisonPage() {
    let cityData: { city: string; apartment: number | null; house: number | null }[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    try {
        const res = await fetch(`${baseUrl}/api/rent-data`);
        const data = await res.json();
        cityData = data.results;
    } catch (err) {
        console.error(err);
        return <ErrorMessage message="Impossible de récupérer les données des villes." />;
    }

    // Filter out cities without data
    const validCities = cityData.filter(c => c.apartment || c.house);

    const chartData = validCities.map(c => ({
        name: c.city,
        Apartment: c.apartment,
        House: c.house,
    }));

    return (
        <div className="max-w-6xl mx-auto py-20 space-y-6 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-4">Comparaison des loyers par ville</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Comparaison des loyers</CardTitle>
                </CardHeader>
                <CardContent>
                    <CityComparisonChart data={chartData} />
                </CardContent>
            </Card>
        </div>
    );
}
