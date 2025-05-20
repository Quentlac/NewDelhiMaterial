import { useEffect, useState } from "react";
import useSWR from 'swr';
import Layout from "@/components/Layout";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement);

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Stats() {
  const [cart] = useState({ count: 0, subtotal: 0 });
  const handlePayNow = () => {};

  const forecastDays = 10;

  const { data: orders } = useSWR('/api/orders', fetcher);
  const { data: materials } = useSWR('/api/materials', fetcher);

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
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        return `${context.dataset.label}: ${context.formattedValue} kg`;
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
                      text: "Quantité commandée (kg)",
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
            <div className="flex gap-6 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#3B82F6" }}></span>
                Plastique
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#10B981" }}></span>
                Métal
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#EC4899" }}></span>
                Textile
              </div>
            </div>
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
              {(() => {
                if (!costs.length) return null;

                const sorted = [...costs].sort((a, b) => a - b);
                const mean = (sorted.reduce((acc, val) => acc + val, 0) / sorted.length).toFixed(2);
                const median = sorted.length % 2 === 0
                  ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(2)
                  : sorted[Math.floor(sorted.length / 2)].toFixed(2);
                const q1 = sorted[Math.floor(sorted.length / 4)].toFixed(2);
                const q3 = sorted[Math.floor((3 * sorted.length) / 4)].toFixed(2);

                return (
                  <div className="mt-4 text-sm opacity-80">
                    <p><strong>Statistiques des coûts :</strong></p>
                    <ul className="list-disc list-inside">
                      <li>Moyenne : ${mean}</li>
                      <li>Médiane : ${median}</li>
                      <li>1er quartile (Q1) : ${q1}</li>
                      <li>3e quartile (Q3) : ${q3}</li>
                    </ul>
                  </div>
                );
              })()}
            </section>
          );
        })()}
      {/* Prévision des arrivées de matériaux (2 ans) */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Prévision des arrivées de matériaux (2 ans)</h2>
        <div className="bg-base-200 p-4 rounded-box shadow mb-2">
          {(() => {
            const monthlyLabels = [];
            const now = new Date();
            for (let i = 0; i < 24; i++) {
              const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
              monthlyLabels.push(date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }));
            }

            const getMonthlyMaterialAverages = (category: string) => {
              const monthlyTotals: number[] = new Array(12).fill(0);
              const monthlyCounts: number[] = new Array(12).fill(0);

              if (!materials) return [];

              for (const item of materials) {
                if (item.material_category !== category) continue;

                const [day, month, year] = item.receiving_date.split("/");
                const parsedDate = new Date(`${year}-${month}-${day}T${item.receiving_time || "00:00"}`);
                const monthIndex = parsedDate.getMonth();

                const quantity = parseFloat(item.item_quantity ?? "0");
                const weightPerItem = parseFloat(item.item_weight ?? "0");
                const totalWeight = quantity * weightPerItem;

                if (!isNaN(totalWeight)) {
                  monthlyTotals[monthIndex] += totalWeight;
                  monthlyCounts[monthIndex] += 1;
                }
              }

              const avgByMonth = monthlyTotals.map((total, i) => total / (monthlyCounts[i] || 1));

              const monthlyAvg: number[] = [];
              const now = new Date();
              for (let i = 0; i < 24; i++) {
                const futureMonth = (now.getMonth() + i) % 12;
                monthlyAvg.push(avgByMonth[futureMonth]);
              }

              return monthlyAvg;
            };

            const plasticPred = getMonthlyMaterialAverages("Plastic");
            const metalPred = getMonthlyMaterialAverages("Metal");
            const textilePred = getMonthlyMaterialAverages("Textile");

            return (
              <>
                <Line
                  data={{
                    labels: monthlyLabels,
                    datasets: [
                      {
                        label: "Plastique",
                        data: plasticPred,
                        borderColor: "#3B82F6",
                        tension: 0.3,
                      },
                      {
                        label: "Métal",
                        data: metalPred,
                        borderColor: "#10B981",
                        tension: 0.3,
                      },
                      {
                        label: "Textile",
                        data: textilePred,
                        borderColor: "#EC4899",
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: {
                        callbacks: {
                          label: function (context: any) {
                            return `${context.dataset.label}: ${context.formattedValue} kg`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Mois (prévision)",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Quantité moyenne estimée (kg)",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                />
                <div className="flex gap-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#3B82F6" }}></span>
                    Plastique
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#10B981" }}></span>
                    Métal
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#EC4899" }}></span>
                    Textile
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <p className="text-sm opacity-60">Estimation mensuelle des quantités reçues de chaque matériau sur les 24 prochains mois, basée sur les moyennes historiques.</p>
      </section>

      {/* Prévision de la demande des matériaux (1 mois) */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Prévision de la demande (1 mois)</h2>
        <div className="bg-base-200 p-4 rounded-box shadow mb-2">
          {(() => {
            if (!orders) return null;

            const lastTwoMonths = [0, 0]; // index 0 = last month, 1 = month before
            const plasticTotals = [0, 0];
            const metalTotals = [0, 0];
            const textileTotals = [0, 0];

            const now = new Date();
            for (const order of orders) {
              const date = new Date(order.date_created);
              const monthDiff = now.getMonth() - date.getMonth() + 12 * (now.getFullYear() - date.getFullYear());

              if (monthDiff === 1 || monthDiff === 0) {
                const index = monthDiff; // 0 for last month, 1 for before
                plasticTotals[index] += order.plastic_qty ?? 0;
                metalTotals[index] += order.metal_qty ?? 0;
                textileTotals[index] += order.textile_qty ?? 0;
                lastTwoMonths[index]++;
              }
            }

            const avgPlastic = (plasticTotals[0] + plasticTotals[1]) / (lastTwoMonths[0] + lastTwoMonths[1] || 1);
            const avgMetal = (metalTotals[0] + metalTotals[1]) / (lastTwoMonths[0] + lastTwoMonths[1] || 1);
            const avgTextile = (textileTotals[0] + textileTotals[1]) / (lastTwoMonths[0] + lastTwoMonths[1] || 1);

            // Générer un seul label et projections pour 1 mois
            const labels = [];
            // projections inutiles, car on n'affiche qu'un seul mois
            for (let i = 1; i <= 1; i++) {
              const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
              labels.push(d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }));
            }

            return (
              <>
                <Bar
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        label: "Plastique",
                        data: [avgPlastic],
                        backgroundColor: "#3B82F6",
                      },
                      {
                        label: "Métal",
                        data: [avgMetal],
                        backgroundColor: "#10B981",
                      },
                      {
                        label: "Textile",
                        data: [avgTextile],
                        backgroundColor: "#EC4899",
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
                            return `${context.dataset.label}: ${context.formattedValue} kg`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Mois à venir",
                        },
                        stacked: false,
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Demande estimée (kg)",
                        },
                        beginAtZero: true,
                        stacked: false,
                      },
                    },
                  }}
                />
                <div className="flex gap-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#3B82F6" }}></span>
                    Plastique
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#10B981" }}></span>
                    Métal
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-2 rounded" style={{ backgroundColor: "#EC4899" }}></span>
                    Textile
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <p className="text-sm opacity-60">Prévision de la demande de matériaux pour le mois à venir, basée sur les commandes récentes.</p>
      </section>
      </div>
    </Layout>
  );
}