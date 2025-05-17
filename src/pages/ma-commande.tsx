import Layout from "@/components/Layout";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
function estimate(material: Material, requestedKg: number, level: "50" | "75" | "100", lambdas: Record<Material, number>) {
  const lambda = lambdas[material];
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

console.log(estimate("Plastic", 50, "50", {Plastic:1, Metal:1, Textile:1}));
console.log(estimate("Plastic", 50, "75", {Plastic:1, Metal:1, Textile:1}));
console.log(estimate("Plastic", 50, "100", {Plastic:1, Metal:1, Textile:1}));

console.log(estimate("Metal", 80, "75", {Plastic:1, Metal:1, Textile:1}));

export default function MaCommande() {
  const [commande, setCommande] = useState<Commande[]>([]);
  const [lambdas, setLambdas] = useState<Record<Material, number>>({
    Plastic: 1,
    Metal: 1,
    Textile: 1,
  });
  const search = useSearchParams();
  const id = search.get("id");

  useEffect(() => {
    fetch("/api/materials")
      .then(res => res.json())
      .then((data: any[]) => {
        const grouped: Record<Material, { totalWeight: number; dates: string[] }> = {
          Plastic: { totalWeight: 0, dates: [] },
          Metal: { totalWeight: 0, dates: [] },
          Textile: { totalWeight: 0, dates: [] },
        };

        for (const item of data) {
          const cat = item.material_category;
          const weight = parseFloat(item.item_weight);
          const date = item.receiving_date;
          if (!cat || isNaN(weight)) continue;

          if (cat === "Plastic" || cat === "Metal" || cat === "Textile") {
            grouped[cat].totalWeight += weight;
            grouped[cat].dates.push(date);
          }
        }

        const result: Record<Material, number> = { Plastic: 1, Metal: 1, Textile: 1 };
        for (const mat of ["Plastic", "Metal", "Textile"] as Material[]) {
          const { totalWeight, dates } = grouped[mat];
          const sortedDates = dates.map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
          const first = sortedDates[0];
          const last = sortedDates[sortedDates.length - 1];
          const days = (last.getTime() - first.getTime()) / 86400000 || 1;
          result[mat] = Math.max(0.01, totalWeight / days);
        }

        setLambdas(result);
      });
  }, []);
  
  useEffect(() => {
    if (!id) return;

    fetch(`/api/get-order?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data) return;
        const result = [
          { type: "plastique", quantity: data.plastic_qty, pricePerKg: PRICES.plastique },
          { type: "metal", quantity: data.metal_qty, pricePerKg: PRICES.metal },
          { type: "textile", quantity: data.textile_qty, pricePerKg: PRICES.textile },
        ];
        setCommande(result);
      });
  }, [id]);

  const total = commande.reduce((sum, item) => sum + item.quantity * item.pricePerKg, 0);

  // Prepare data for charts per material
  const chartData = (item: Commande) => {
    const mat = item.type === "plastique" ? "Plastic" : item.type === "metal" ? "Metal" : "Textile";
    const levels: ("50" | "75" | "100")[] = ["50", "75", "100"];
    const estimations = levels.map((lvl) => estimate(mat, item.quantity, lvl, lambdas));

    const labels = levels.map(lvl => `${lvl}%`);
    const daysData = estimations.map(e => {
      const diff = (e.eta.getTime() - Date.now()) / 86400000; // days difference
      return Math.round(diff * 100) / 100;
    });

    return {
      labels,
      datasets: [
        {
          label: "Jours estimés avant disponibilité",
          data: daysData,
          backgroundColor: ["#3b82f6", "#2563eb", "#1e40af"],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        title: {
          display: true,
          text: "Jours",
        },
      },
      x: {
        title: {
          display: true,
          text: "Niveau de certitude (%)",
        },
      },
    },
  };

  const cart = { count: 0, subtotal: 0 };
  const handlePayNow = () => {};

  return (
    <Layout cart={cart} handlePayNow={handlePayNow}>
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

        {commande.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Suivi de commande</h2>
            {/* Section supprimée : cartes individuelles de disponibilité par matériau déplacées dans le modal global */}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 text-center">Date estimée de disponibilité complète</h2>
              <div className="max-w-2xl mx-auto bg-base-200 p-6 rounded-box shadow">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Certitude</th>
                      <th>Date estimée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["50", "75", "100"].map(level => {
                      const maxEta = commande.reduce((latest, item) => {
                        const mat = item.type === "plastique" ? "Plastic" : item.type === "metal" ? "Metal" : "Textile";
                        const eta = estimate(mat, item.quantity, level as "50" | "75" | "100", lambdas).eta;
                        return eta > latest ? eta : latest;
                      }, new Date(0));
                      return (
                        <tr key={level}>
                          <td>{level}%</td>
                          <td>{maxEta.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="mt-4 text-sm opacity-60">
                  Cette estimation utilise un modèle de processus de Poisson pour chaque matériau : l’estimation la plus lointaine parmi tous les matériaux est retenue pour chaque niveau de certitude.
                </p>
                <div className="text-center mt-4">
                  <button className="btn btn-outline" onClick={() => document.getElementById('global_modal').showModal()}>
                    En savoir plus
                  </button>
                </div>
                <dialog id="global_modal" className="modal">
                  <div className="modal-box w-full max-w-6xl max-h-[80vh] overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Détail de disponibilité par matériau</h3>
                    <div className="flex flex-col gap-6">
                      {commande.map((item) => {
                        const mat = item.type === "plastique" ? "Plastic" : item.type === "metal" ? "Metal" : "Textile";
                        const levels: ("50" | "75" | "100")[] = ["50", "75", "100"];
                        const estimations = levels.map((lvl) => estimate(mat, item.quantity, lvl, lambdas));
                        return (
                          <div key={item.type} className="card bg-base-200 p-4 shadow">
                            <h3 className="text-lg font-semibold mb-2 capitalize">{item.type}</h3>
                            <ul className="text-sm space-y-1">
                              {estimations.map((e, i) => (
                                <li key={i}>
                                  {e.level} de chance d'avoir {e.requestedKg} kg → {e.etaString}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4 text-xs opacity-60">
                              Estimé via un processus de Poisson avec λ = {lambdas[mat]}.
                            </div>
                            <div className="mt-4 text-center">
                              <Bar options={chartOptions} data={chartData(item)} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <form method="dialog" className="modal-backdrop">
                    <button>Fermer</button>
                  </form>
                </dialog>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="btn btn-primary">Retour à l'accueil</a>
        </div>
      </div>
    </Layout>
  );
}
