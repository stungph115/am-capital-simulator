'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="text-center py-50 ">
      <h2 className="text-3xl font-bold mb-4">Simulez la rentabilité de votre bien</h2>
      <p className="text-gray-600 mb-8">
        Location longue ou courte durée, avec données de marché en temps réel.
      </p>
      <Link
        href="/simulation"
        className="inline-block bg-[#142344] text-white text-xl font-bold px-12 py-3 rounded-full shadow hover:bg-[#1d315e]"
      >
        Commencer la simulation
      </Link>
    </section>
  );
}
