'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f1e3d] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/Logo_AM-Capital-02.svg"
            alt="A&M Capital"
            width={120}
            height={120}
            className="mb-4"
          />
        </div>

        {/* Col 1 */}
        <div className="space-y-2">
          <p className="font-semibold">Qui sommes-nous</p>
          <p className="font-semibold">Notre expertise</p>
          <p className="font-semibold">Nos secteurs</p>
          <p className="font-semibold">Nos réalisations</p>
        </div>

        {/* Col 2 */}
        <div className="space-y-2">
          <p className="font-semibold">Nous rejoindre</p>
          <p className="font-semibold">Rénovation</p>
          <p className="font-semibold">Glossaire</p>
          <p className="font-semibold">Honoraires</p>
        </div>

        {/* Col 3 */}
        <div className="space-y-2">
          <p className="font-semibold">Commencer mon projet</p>
          <p className="font-semibold">Nous contacter</p>
          <p className="font-semibold">FAQ</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 my-8"></div>

      {/* Contact */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm gap-4">
        <div className="flex flex-col md:flex-row md:gap-12 gap-4">
          <div>
            <p className="font-semibold">Mail</p>
            <p>contact@am-capital.fr</p>
          </div>
          <div>
            <p className="font-semibold">Adresse</p>
            <p>20 Rue Ampère, 91300 Massy</p>
          </div>
        </div>

        {/* Socials */}
        <div className="flex gap-4 text-xl">
          <Link href="https://linkedin.com" target="_blank">in</Link>
          <Link href="https://instagram.com" target="_blank">ig</Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/20 my-6"></div>

      {/* Mentions */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center md:justify-start gap-6 text-xs text-gray-300">
        <Link href="#">Mentions légales</Link>
        <Link href="#">Politique de confidentialité</Link>
        <Link href="#">Conditions générales de vente</Link>
      </div>
    </footer>
  );
}
