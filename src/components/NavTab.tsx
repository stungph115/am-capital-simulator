"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { name: "Simulation", href: "/simulation" },
  { name: "Résultats", href: "/resultats" },
  { name: "Contact", href: "/contact" },
]

export default function NavTabs() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-4 p-4 border-b">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-3 py-1 rounded ${pathname === tab.href ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  )
}
