interface ResultsPanelProps {
  results: number | null;
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  if (results === null) return <p>Entrez les informations pour voir la rentabilité.</p>;
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Rentabilité estimée</h3>
      <p className="text-lg">{results.toLocaleString()} €</p>
    </div>
  );
}
