"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/Textarea";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //empêche le formulaire de recharger la page.
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Erreur serveur");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8 animate-fadeIn">
      <h1 className="text-4xl font-bold text-[#121f3e] text-center dark:text-white" >📬 Contactez-nous</h1>

      {status === "success" && (
        <div className="p-4 bg-green-100 text-green-800 rounded shadow">
          ✅ Message envoyé avec succès !
        </div>
      )}
      {status === "error" && (
        <div className="p-4 bg-red-100 text-red-800 rounded shadow">
          ❌ Une erreur est survenue, veuillez réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md dark:text-[#1a233a]">
        <div>
          <Label htmlFor="name" className="px-1 ">Nom</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
            <Input
              id="name"
              className="pl-10"
              placeholder="Votre nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="px-1">Email</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
            <Input
              id="email"
              type="email"
              className="pl-10"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="px-1">Message</Label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📝</span>
            <Textarea
              id="message"
              className="pl-10 pt-5"
              placeholder="Votre message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="bg-[#121f3e] hover:bg-[#2c5282] text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          {status === "sending" ? "Envoi..." : "📩 Envoyer"}
        </Button>
      </form>
    </div>
  );
}
