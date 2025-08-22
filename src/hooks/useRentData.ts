'use client';
import { CityRentData } from '@/lib/types';
import { useEffect, useState } from 'react';

export const useRentData = () => {
  const [data, setData] = useState<CityRentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/rent-data');
        if (!res.ok) throw new Error('Erreur API rent-data');
        const json = await res.json();
        setData(json.results as CityRentData[]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};