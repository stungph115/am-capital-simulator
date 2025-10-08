export type ComputedResult = {
    monthlyBase: number; // base rent €/mois
    netMonthly: number;  // net monthly ~95%
    grossYield: number;  // annual gross yield approx
    fees: { notary: number; commission: number; architect: number };
    totalInvestment: number;
};

export type CalcInput = {
    price: number;
    surface: number;
    rooms: 'Studio' | 'T2' | 'T3' | 'T4';
    type: 'longue' | 'courte';
    rentPerM2: number;       // €/m²/mois pour location longue durée
    nightlyPrice?: number | null; // €/nuit pour courte durée via AirDNA
};
// Coefficients par nombre de pièces
const roomCoefficients: Record<'Studio' | 'T2' | 'T3' | 'T4', number> = {
    Studio: 1.39,
    T2: 1.0,
    T3: 0.81,
    T4: 0.80,
};
export function computeAll({ price, surface, rooms, type, rentPerM2, nightlyPrice }: CalcInput): ComputedResult {
    console.log("input for computing", { price, surface, rooms, type, rentPerM2, nightlyPrice });

    let monthlyBase = 0;

    if (type === 'longue') {

        monthlyBase = rentPerM2 * surface * roomCoefficients[rooms];
    } else {
        // Courte durée
        if (nightlyPrice) {
            // monthlyBase = nightlyPrice * 30 jours * taux de remplissage 70%
            monthlyBase = nightlyPrice * 30 * 0.7;
        } else {
            // fallback placeholder: 3x loyer longue durée
            monthlyBase = rentPerM2 * surface * 3 * roomCoefficients[rooms];
        }
    }

    // Frais
    const notary = price * 0.09; //frais de notaire 9% 
    const commission = price * 0.085; // frais agence 8.5%
    const architect = surface * (type === 'longue' ? 90 : 120); // frais travaux 90€/m² (longue) ou 120€/m² (courte)
    const totalInvestment = price + notary + commission + architect;

    const netMonthly = monthlyBase * 0.95;
    const grossYield = (monthlyBase * 12) / totalInvestment; // rendement brut annuel

    return { monthlyBase, netMonthly, grossYield, fees: { notary, commission, architect }, totalInvestment };
}
