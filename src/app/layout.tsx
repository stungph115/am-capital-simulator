import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A&M Capital - Comparaison des villes",
  description: "Comparaison des loyers par ville - A&M Capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* Header avec badges de confiance */}
        <header className="flex flex-col md:flex-row justify-between items-center p-4 shadow bg-white sticky top-0 z-50">
          <a href="/">
            <img
              src="/logo AM capital.svg"
              alt="A&M Capital"
              className="h-10 md:h-12"
              style={{ filter: "invert(1)" }}
            />
          </a>
          <div className="flex gap-2 mt-2 md:mt-0">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✔ Fiabilité</span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">✔ Transparence</span>
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">✔ Expertise</span>
          </div>
        </header>

        {/* Navigation par onglets */}
        <nav className="flex justify-center gap-3 bg-white shadow-sm py-3 sticky top-16 z-40">
          <a
            href="/simulation"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 font-medium"
          >
            Simulation
          </a>
          <a
            href="/city-comparison"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 font-medium"
          >
            Comparaison villes
          </a>
          <a
            href="/contact"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 font-medium"
          >
            Contact
          </a>
        </nav>

        {/* Main content */}
        <main className="max-w-6xl mx-auto p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
