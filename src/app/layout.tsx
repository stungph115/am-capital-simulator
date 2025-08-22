import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";

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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-[#121f3e] dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Header avec badges de confiance */}
          <header className="flex flex-col md:flex-row justify-between items-center p-4 shadow bg-white dark:bg-[#1a233a] sticky top-0 z-50">
            <Link href="/">
              <Image
                src="/logo AM capital.svg"
                alt="A&M Capital"
                width={32}
                height={32}
                className="filter invert-[0.9] dark:invert-[0.1]"
              />
            </Link>
            <div className="flex gap-2 mt-2 md:mt-0">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✔ Fiabilité</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">✔ Transparence</span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">✔ Expertise</span>
            </div>
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </header>

          {/* Navigation par onglets */}
          <nav className="flex justify-center gap-3 bg-white dark:bg-[#1a233a] shadow-sm py-3 sticky top-16 z-40">
            <Link
              href="/"
              className="px-4 py-2 rounded-full  bg-[#142344] text-white hover:bg-[#1d315e] transition font-medium dark:bg-white dark:text-[#142344] dark:hover:bg-gray-200"
            >
              Accueil
            </Link>
            <Link
              href="/simulation"
              className="px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-[#22305a] transition text-gray-700 dark:text-white font-medium"
            >
              Simulation
            </Link>
            <Link
              href="/city-comparison"
              className="px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-[#22305a] transition text-gray-700 dark:text-white font-medium"
            >
              Comparaison villes
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-[#22305a] transition text-gray-700 dark:text-white font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Main content */}
          <main className="max-w-6xl mx-auto p-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}