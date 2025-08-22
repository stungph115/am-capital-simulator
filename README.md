# A&M Capital Simulator

📊 **Simulateur d’investissement locatif** pour comparer loyers et rendements selon la ville et le type de bien.
Démo publique sur : https://am-capital-simulator-4ytt.vercel.app
---

## Stack technique

- **Frontend**
  - Next.js 14 (App Router, Server Components)
  - React 18 & TypeScript
  - TailwindCSS (UI)
  - Recharts (graphiques)

- **Backend / API**
  - Next.js API Routes
  - Récupération des données via Fetch/Axios (villes, AirDNA)
  - Node.js pour les calculs

- **Divers**
  - Déploiement : Vercel
  - Variables d’environnement : `.env` ou Vercel
  - Export PDF : `ExportPDFButton` (React-to-PDF)

---

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/ton-utilisateur/am-capital-simulator.git
   cd am-capital-simulator
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer l’environnement :**
   Créez un fichier `.env` à la racine avec :
   ```env
   AIRDNA_API_KEY=your_airdna_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   HEADER_COOKIE="visitor_uuid=xxx; landing_page_template=xxx; datadome=xxx; session=xxx"
   ```

4. **Lancer le projet :**
   ```bash
   npm run dev
   ```
   Accédez à [http://localhost:3000](http://localhost:3000).

---

## Pages principales

- `/simulation` : Formulaire de simulation (prix, surface, type, ville, location).
- `/results` : Résultats détaillés, graphiques, comparaison longue/courte durée.
- `/city-comparison` : Comparaison des loyers entre villes (bar chart).
- `/contact` : Formulaire de contact/support.

---

## Formules de calcul

- **Loyer mensuel brut**  
  `LoyerMensuelBrut = Surface * LoyerM2`

- **Rendement brut annuel (%)**  
  `RendementBrut = (LoyerMensuelBrut * 12) / InvestissementTotal * 100`

- **Loyer mensuel net (~95%)**  
  `LoyerNet = LoyerMensuelBrut * 0.95`

- **Courbe de rentabilité**  
  `ProfitMensuel = LoyerNet * Mois - InvestissementTotal`

---

## Remarques

- Les loyers proviennent d’une API interne ou d’un fallback statique.
- Les données AirDNA sont simulées (clé réelle requise pour la production).
- Les calculs ne tiennent pas compte des taxes, variations de prix ou frais imprévus.
- Estimations simplifiées, non valables pour un usage légal ou fiscal.

---

## Déploiement

Déployé sur Vercel :  
https://am-capital-simulator-4ytt.vercel.app

Pensez à mettre à jour `NEXT_PUBLIC_BASE_URL` sur Vercel.

---

## Auteur

Pham Son Tung  
📧 tungphamdev95@gmail.com