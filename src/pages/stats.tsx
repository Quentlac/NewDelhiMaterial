import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const fakeForecast = (start: number, days: number, lambda: number) => {
  const values = [];
  let current = start;
  for (let i = 0; i < days; i++) {
    const arrival = Math.floor(Math.random() * lambda);
    current += arrival;
    values.push(current);
  }
  return values;
};

export default function Stats() {
  const [cart] = useState({ count: 0, subtotal: 0 });
  const handlePayNow = () => {};

  const forecastDays = 10;
  const forecast = {
    plastic: fakeForecast(320, forecastDays, 6),
    metal: fakeForecast(210, forecastDays, 4),
    textile: fakeForecast(120, forecastDays, 3),
  };

  const labels = Array.from({ length: forecastDays }, (_, i) => `Jour ${i + 1}`);

  const chartData = (label: string, data: number[], color: string) => ({
    labels,
    datasets: [
      {
        label,
        data,
        fill: false,
        borderColor: color,
        tension: 0.1,
      },
    ],
  });

  return (
    <Layout cart={cart} handlePayNow={handlePayNow}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Statistiques sur les matériaux</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Disponibilités actuelles estimées</h2>
          <ul className="space-y-2">
            <li>Plastique : 320 kg</li>
            <li>Métal : 210 kg</li>
            <li>Textile : 120 kg</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Prévisions sur les 10 prochains jours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-200 p-4 rounded-box shadow">
              <Line data={chartData("Plastique (kg)", forecast.plastic, "#60A5FA")} />
            </div>
            <div className="bg-base-200 p-4 rounded-box shadow">
              <Line data={chartData("Métal (kg)", forecast.metal, "#34D399")} />
            </div>
            <div className="bg-base-200 p-4 rounded-box shadow">
              <Line data={chartData("Textile (kg)", forecast.textile, "#F472B6")} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Méthode de prévision</h2>
          <p className="text-sm opacity-80">
            Les prévisions sont simulées à partir d’un modèle stochastique inspiré d’un processus de Poisson :
            on suppose que les arrivées de matériaux suivent une distribution aléatoire avec une intensité constante λ
            (plastique : 6, métal : 4, textile : 3). Ces graphiques sont des exemples visuels pour comprendre l’évolution
            possible des stocks dans le temps.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Historique des commandes</h2>
          <div className="bg-base-200 p-4 rounded-box shadow mb-2">
            <Line data={chartData("Commandes / jour", fakeForecast(5, forecastDays, 2), "#FBBF24")} />
          </div>
          <p className="text-sm opacity-60">Ce graphique montre une estimation du nombre de commandes passées chaque jour sur les 10 derniers jours.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Cumul des matériaux commandés</h2>
          <div className="bg-base-200 p-4 rounded-box shadow mb-2">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Plastique",
                    data: fakeForecast(100, forecastDays, 5),
                    borderColor: "#3B82F6",
                    tension: 0.1,
                  },
                  {
                    label: "Métal",
                    data: fakeForecast(80, forecastDays, 3),
                    borderColor: "#10B981",
                    tension: 0.1,
                  },
                  {
                    label: "Textile",
                    data: fakeForecast(60, forecastDays, 2),
                    borderColor: "#EC4899",
                    tension: 0.1,
                  },
                ],
              }}
            />
          </div>
          <p className="text-sm opacity-60">Volume cumulé estimé des matériaux commandés depuis le début de la semaine.</p>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Prévision des délais moyens</h2>
          <div className="bg-base-200 p-4 rounded-box shadow mb-2">
            <Line
              data={{
                labels,
                datasets: [
                  {
                    label: "Délais moyens (jours)",
                    data: fakeForecast(2, forecastDays, 1),
                    borderColor: "#F97316",
                    tension: 0.1,
                  },
                ],
              }}
            />
          </div>
          <p className="text-sm opacity-60">Prévision de la durée moyenne estimée avant que les commandes soient livrées, en fonction de la disponibilité des matériaux.</p>
        </section>
      </div>
    </Layout>
  );
}