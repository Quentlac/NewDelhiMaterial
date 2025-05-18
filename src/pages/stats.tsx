import { useEffect, useState } from "react";
import useSWR from 'swr';
import Layout from "@/components/Layout";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Stats() {
  const [cart] = useState({ count: 0, subtotal: 0 });
  const handlePayNow = () => {};

  const forecastDays = 10;

  const { data: orders } = useSWR('/api/orders', fetcher);

  const plasticCumul: number[] = [];
  const metalCumul: number[] = [];
  const textileCumul: number[] = [];

  let p = 0, m = 0, t = 0;
  if (orders && Array.isArray(orders)) {
    for (const order of orders) {
      p += order.plastic_qty ?? 0;
      m += order.metal_qty ?? 0;
      t += order.textile_qty ?? 0;
      plasticCumul.push(p);
      metalCumul.push(m);
      textileCumul.push(t);
    }
  }

  const labelsOrders = orders && Array.isArray(orders) ? orders.map((_: any, i: number) => `Commande ${i + 1}`) : [];

  const initialStock = { Plastic: 906.8, Metal: 120.5, Textile: 3266.7 };

  const remaining = {
    Plastic: initialStock.Plastic - (plasticCumul[plasticCumul.length - 1] ?? 0),
    Metal: initialStock.Metal - (metalCumul[metalCumul.length - 1] ?? 0),
    Textile: initialStock.Textile - (textileCumul[textileCumul.length - 1] ?? 0),
  };

  return (
    <Layout cart={cart} handlePayNow={handlePayNow}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Statistiques sur les matériaux</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Disponibilités actuelles estimées</h2>
          <ul className="space-y-2 text-sm opacity-80">
            <li>
              Plastique : {remaining.Plastic >= 0
                ? `${remaining.Plastic.toFixed(1)} kg restants`
                : `À court de stock, en cours de réapprovisionnement (${Math.abs(remaining.Plastic).toFixed(1)} kg manquants)`}
            </li>
            <li>
              Métal : {remaining.Metal >= 0
                ? `${remaining.Metal.toFixed(1)} kg restants`
                : `À court de stock, en cours de réapprovisionnement (${Math.abs(remaining.Metal).toFixed(1)} kg manquants)`}
            </li>
            <li>
              Textile : {remaining.Textile >= 0
                ? `${remaining.Textile.toFixed(1)} kg restants`
                : `À court de stock, en cours de réapprovisionnement (${Math.abs(remaining.Textile).toFixed(1)} kg manquants)`}
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Cumul des matériaux commandés</h2>
          <div className="bg-base-200 p-4 rounded-box shadow mb-2">
            <Line
              data={{
                labels: labelsOrders,
                datasets: [
                  {
                    label: "Plastique",
                    data: plasticCumul,
                    borderColor: "#3B82F6",
                    tension: 0.1,
                  },
                  {
                    label: "Métal",
                    data: metalCumul,
                    borderColor: "#10B981",
                    tension: 0.1,
                  },
                  {
                    label: "Textile",
                    data: textileCumul,
                    borderColor: "#EC4899",
                    tension: 0.1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Commandes",
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Quantité commandée (kg)",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <p className="text-sm opacity-60">Volume cumulé réel ou simulé des matériaux commandés pour les 10 dernières commandes.</p>
          <p className="text-sm mt-4">Total vendu :</p>
          <ul className="text-sm opacity-70 mb-6">
            <li>Plastique : {plasticCumul[plasticCumul.length - 1] ?? 0} kg</li>
            <li>Métal : {metalCumul[metalCumul.length - 1] ?? 0} kg</li>
            <li>Textile : {textileCumul[textileCumul.length - 1] ?? 0} kg</li>
          </ul>
        </section>

        {/* Coût moyen par commande */}
        {(() => {
          const costs = orders?.map((o: any) => o.total_price ?? 0) ?? [];
          return (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Coût total par commande</h2>
              <div className="bg-base-200 p-4 rounded-box shadow mb-2">
                <Line
                  data={{
                    labels: labelsOrders,
                    datasets: [
                      {
                        label: "Coût total ($)",
                        data: costs,
                        borderColor: "#F59E0B",
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: {
                        callbacks: {
                          label: function (context: any) {
                            return `${context.dataset.label}: $${context.formattedValue}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Commandes",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Montant ($)",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
              <p className="text-sm opacity-60">Coût total en dollars pour chaque commande passée.</p>
            </section>
          );
        })()}
      </div>
    </Layout>
  );
}