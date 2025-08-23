"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CityComparisonChart from "@/components/CityComparisonChart";
import Spinner from "@/components/LoadingSpinner";
import RefreshingSpinner from "@/components/RefreshingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

type CityData = {
    city: string;
    apartment: number | null;
    house: number | null;
};

type RentDataAPI = {
    results: CityData[];
    updatedAt: string | null;
};

export default function CityComparisonPage() {
    const [cityData, setCityData] = useState<CityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedAt, setUpdatedAt] = useState<string | null>(null);

    const fetchLocalData = async () => {
        try {
            const res = await axios.get<RentDataAPI>("/api/rent-data");
            setCityData(res.data.results);
            setUpdatedAt(res.data.updatedAt);
        } catch (err) {
            console.error("Erreur fetch rent-data:", err);
            setError("Impossible de récupérer les données des villes.");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        try {
            setRefreshing(true);
            const res = await axios.post<RentDataAPI>("/api/rent-data/refresh");
            setCityData(res.data.results);
            setUpdatedAt(res.data.updatedAt);
        } catch (err) {
            console.error("Erreur refresh rent-data:", err);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchLocalData();
        refreshData();

        const interval = setInterval(() => {
            refreshData();
        }, 2 * 60 * 1000); // refresh every 2 minutes

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <Spinner message="Chargement des données..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
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
            <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
                Comparaison des loyers par ville
            </h1>
            {refreshing && <RefreshingSpinner />}

            <Card>
                <CardHeader >
                    <CardTitle className="text-center">Comparaison des loyers</CardTitle>
                </CardHeader>
                <CardContent>
                    <CityComparisonChart data={chartData} />
                </CardContent>
            </Card>

            <div className="mt-8 text-sm text-gray-500 border-t pt-4">
                <strong>Sources des données :</strong>{" "}
                <span className="font-medium">Location courte durée :</span> API{" "}
                <a
                    href="https://www.airdna.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                >
                    AirDNA
                </a>
                {updatedAt && (
                    <span className="ml-2 text-gray-400 dark:text-gray-500">
                        (Dernière mise à jour : {new Date(updatedAt).toLocaleString()})
                    </span>
                )}
            </div>
        </div>
    );
}
