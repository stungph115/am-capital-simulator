"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation"; // 👈 hook pour récupérer le path actuel

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const pathname = usePathname(); // 👈 chemin actuel

    const navLinks = [
        { href: "/", label: "Accueil" },
        { href: "/simulation", label: "Simulation" },
        { href: "/city-comparison", label: "Comparaison villes" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-center p-4 shadow bg-white dark:bg-[#1a233a] sticky top-0 z-50">
                <Link href="/">
                    <Image
                        src="/logo AM capital.svg"
                        alt="A&M Capital"
                        width={50}
                        height={50}
                        className="filter invert-[0.9] dark:invert-[0.1]"
                    />
                </Link>
                <div className="flex gap-2 mt-2 md:mt-0">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded">✔ Fiabilité</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">✔ Transparence</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">✔ Expertise</span>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <ThemeToggle />
                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-[#2a3755]"
                        onClick={toggleMenu}
                    >
                        {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            <nav className="bg-white dark:bg-[#1a233a] py-2 shadow-sm sticky top-[81px] z-40">
                <ul
                    className={`flex flex-col md:flex-row md:justify-center gap-3 p-4 md:p-0 transition-all ${
                        menuOpen ? "block" : "hidden md:flex"
                    }`}
                >
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href; // 👈 vérifie si le lien est actif
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`block px-4 md:py-2 rounded-full transition font-medium min-h-[48px] ${
                                        isActive
                                            ? "bg-[#142344] text-white dark:bg-white dark:text-[#142344]"
                                            : "hover:bg-blue-50 dark:hover:bg-[#22305a] text-gray-700 dark:text-white"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
