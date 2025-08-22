// src/lib/types.ts

export type RoomType = 'Studio' | 'T2' | 'T3' | 'T4';

export type ExploitationType = 'longue' | 'courte';

export interface CityData {
  city: string;
  apartment?: Record<'T1' | 'T2' | 'T3' | 'T4', number | null>;
  house?: Record<'T1' | 'T2' | 'T3' | 'T4', number | null>;
}

export interface AirDNAData {
  adr: number; // average daily rate (€/night)
}

export interface SimulationInput {
  price: number;           // Prix du bien (€)
  surface: number;         // Surface m²
  rooms: RoomType;         // Studio, T2, T3, T4
  type: ExploitationType;  // longue / courte
  cityData: CityData;      // données du rent long terme
  airDNAData?: AirDNAData; // données Airbnb si disponibles
}
