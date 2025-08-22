import SimulatorForm from "@/components/SimulatorForm";

export default function SimulatorPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">Simulation de rentabilité</h1>
      <SimulatorForm />
    </div>
  );
}
