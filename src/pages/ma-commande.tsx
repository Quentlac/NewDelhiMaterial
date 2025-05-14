import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import db from "@/lib/db";

type Commande = {
  type: string;
  quantity: number;
  pricePerKg: number;
};

const PRICES: Record<string, number> = {
  plastique: 1.4,
  metal: 2.6,
  textile: 4.3,
};


type Material = "Plastic" | "Metal" | "Textile";

const LAMBDAS: Record<Material, number> = {
  Plastic: 1.135,
  Metal: 0.151,
  Textile: 3.95,
};

const STOCK: Record<Material, number> = {
  Plastic: 12,
  Metal: 3,
  Textile: 25,
};

const LEVELS: Record<"50" | "75" | "100", number> = {
  "50": 0.5,
  "75": 0.75,
  "100": 1,
};

/* ------------------------------------------------------------------
   Fonctions statistiques (Poisson homogène)
------------------------------------------------------------------ */

function poissonCdf(k: number, mean: number): number {
  let sum = 0;
  let term = Math.exp(-mean);
  for (let i = 0; i <= k; i++) {
    if (i > 0) term *= mean / i;
    sum += term;
  }
  return sum;
}

function daysForQuantile(qKg: number, lambda: number, q: number): number {
  if (q === 1) return qKg / lambda;
  let low = 0;
  let high = (qKg / lambda) * 5 + 1;
  const tol = 0.01;
  while (high - low > tol) {
    const mid = (low + high) / 2;
    const mean = lambda * mid;
    const p = 1 - poissonCdf(Math.floor(qKg) - 1, mean);
    p >= q ? (high = mid) : (low = mid);
  }
  return high;
}

function etaDate(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}

/* ------------------------------------------------------------------
   Fonction principale : estimate()
------------------------------------------------------------------ */

/**
 * Calcule la date estimée à laquelle la quantité demandée sera disponible.
 * @param material   "Plastic" | "Metal" | "Textile"
 * @param requestedKg Quantité souhaitée (kg)
 * @param level      "50" | "75" | "100" (pour 50 %, 75 %, 100 %)
 */
function estimate(material: Material, requestedKg: number, level: "50" | "75" | "100") {
  const lambda = LAMBDAS[material];
  const current = STOCK[material] ?? 0;
  const missing = Math.max(requestedKg - current, 0);
  const q = LEVELS[level];

  const days = missing > 0 ? daysForQuantile(missing, lambda, q) : 0;
  const date = etaDate(days);

  return {
    material,
    level: `${level}%`,
    requestedKg,
    stockKg: current,
    missingKg: missing,
    eta: date,
    etaString: date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    lambda,
  };
}

/* ------------------------------------------------------------------
   EXEMPLES DE TEST
------------------------------------------------------------------ */

console.log(estimate("Plastic", 50, "50"));
console.log(estimate("Plastic", 50, "75"));
console.log(estimate("Plastic", 50, "100"));

console.log(estimate("Metal", 80, "75"));

export default function MaCommande() {
  const [commande, setCommande] = useState<Commande[]>([]);
  const search = useSearchParams();
  const id = search.get("id");
  
  useEffect(() => {

    // Simuler récupération d'une commande (ici juste un exemple)
    console.log("Commande ID :", id);        // ← appears in DevTools
    const example = [
      { type: "plastique", quantity: 12, pricePerKg: PRICES.plastique },
      { type: "metal", quantity: 5, pricePerKg: PRICES.metal },
      { type: "textile", quantity: 7, pricePerKg: PRICES.textile },
    ];
    setCommande(example);
  }, [id]);

  const total = commande.reduce((sum, item) => sum + item.quantity * item.pricePerKg, 0);
  return (
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Ma commande</h1>
      <div className="overflow-x-auto">
        <table className="table w-full bg-base-200 rounded-box shadow">
          <thead>
            <tr>
              <th>Matériau</th>
              <th>Quantité (kg)</th>
              <th>Prix unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {commande.map((item, index) => (
              <tr key={index}>
                <td className="capitalize">{item.type}</td>
                <td>{item.quantity}</td>
                <td>${item.pricePerKg.toFixed(2)}</td>
                <td>${(item.quantity * item.pricePerKg).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={3}>Total</th>
              <th>${total.toFixed(2)}</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-6 text-center">
        <a href="/test" className="btn btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  );
}
