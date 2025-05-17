"use client"
import { useEffect, useState } from "react";
import { getTimeToOrder } from "./actions/core";
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from "@/components/Layout";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Test() {
  const { data: materials, error } = useSWR('/api/materials', fetcher);

  const [time, setTime] = useState<number>(0);
  const [metalQty, setMetalQty] = useState<number>(0);
  const [textileQty, setTextileQty] = useState<number>(0);
  const [plasticQty, setPlasticQty] = useState<number>(0);
  const [cart, setCart] = useState({ count: 0, subtotal: 0 });
  const [available, setAvailable] = useState({ Plastic: 0, Metal: 0, Textile: 0 });

  const router = useRouter();
  const handlePayNow = async () => {
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plastic: plasticQty,
          metal: metalQty,
          textile: textileQty
        }),
      });

      if (!res.ok) {
        console.error('Erreur lors de la commande');
        return;
      }

      const data = await res.json();
      if (data?.id) {
        router.push(`/commande-confirmee?id=${data.id}`);
      } else {
        console.error('ID de commande manquant dans la réponse');
      }
    } catch (error) {
      console.error('Erreur de requête :', error);
    }
  };

  useEffect(() => {
    getTimeToOrder(metalQty, textileQty, plasticQty).then(q => setTime(q));
  }, [metalQty, textileQty, plasticQty]);

  useEffect(() => {
    if (!materials) return;

    const stock = { Plastic: 0, Metal: 0, Textile: 0 };
    for (const m of materials) {
      const cat = m.material_category;
      const weight = parseFloat(m.item_weight);
      if (!cat || isNaN(weight)) continue;
      if (cat === "Plastic" || cat === "Metal" || cat === "Textile") {
        stock[cat] += weight;
      }
    }
    setAvailable(stock);
  }, [materials]);

  const handleAddToCart = () => {
    const newSubtotal = (
      plasticQty * 1.4 +
      metalQty * 2.6 +
      textileQty * 4.3
    );
    const newCount = [plasticQty, metalQty, textileQty].filter(q => q > 0).length;
    setCart({ count: newCount, subtotal: newSubtotal });
  };

  if (error) return <div>Erreur de chargement des matériaux</div>;
  if (!materials) return <div>Chargement des matériaux...</div>;

  return (
    <Layout cart={cart} handlePayNow={handlePayNow}>
      {/* Contenu principal réorganisé */}
      <main className="flex-grow px-6 flex">
        {/* Hero Section à gauche */}
        <div className="w-1/2">
          <div
            className="hero h-full"
            style={{
              backgroundImage: "url('https://ckinetics.com/fileupload/GIZ2.JPG')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/20 opacity-90 z-0"></div>
            <div className="hero-content text-center relative z-10">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">La révolution du recyclage industriel</h1>
                <p className="py-6">
                  PureDelhiMaterials propose des matières recyclées de haute qualité — plastiques, métaux et textiles — en gros pour les professionnels.
                  Grâce à notre méthode de tri et traitement automatisée, nous offrons des matériaux fiables, écoresponsables et immédiatement disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interface utilisateur à droite */}
        <div className="w-1/2 flex flex-col gap-6 pl-5">
          <div className="grid grid-cols-3 gap-4">
            {/* Plastique */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Plastique</h2>
                <p className="text-sm opacity-60">$1.40 / kg</p>
                <p className="text-xs opacity-60">{available.Plastic.toFixed(1)} kg disponibles</p>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => setPlasticQty(q => Math.max(0, q - 1))}>-</button>
                  <input type="range" min={0} max="100" value={plasticQty} className="range" onChange={e => setPlasticQty(Number.parseInt(e.target.value))} />
                  <button className="btn btn-sm" onClick={() => setPlasticQty(q => Math.min(100, q + 1))}>+</button>
                </div>
                <p>{plasticQty} kg</p>
                <p className="text-sm text-gray-500">${(plasticQty * 1.4).toFixed(2)}</p>
              </div>
            </div>

            {/* Métal */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Métal</h2>
                <p className="text-sm opacity-60">$2.60 / kg</p>
                <p className="text-xs opacity-60">{available.Metal.toFixed(1)} kg disponibles</p>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => setMetalQty(q => Math.max(0, q - 1))}>-</button>
                  <input type="range" min={0} max="100" value={metalQty} className="range" onChange={e => setMetalQty(Number.parseInt(e.target.value))} />
                  <button className="btn btn-sm" onClick={() => setMetalQty(q => Math.min(100, q + 1))}>+</button>
                </div>
                <p>{metalQty} kg</p>
                <p className="text-sm text-gray-500">${(metalQty * 2.6).toFixed(2)}</p>
              </div>
            </div>

            {/* Textile */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Textile</h2>
                <p className="text-sm opacity-60">$4.30 / kg</p>
                <p className="text-xs opacity-60">{available.Textile.toFixed(1)} kg disponibles</p>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm" onClick={() => setTextileQty(q => Math.max(0, q - 1))}>-</button>
                  <input type="range" min={0} max="100" value={textileQty} className="range" onChange={e => setTextileQty(Number.parseInt(e.target.value))} />
                  <button className="btn btn-sm" onClick={() => setTextileQty(q => Math.min(100, q + 1))}>+</button>
                </div>
                <p>{textileQty} kg</p>
                <p className="text-sm text-gray-500">${(textileQty * 4.3).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-outline btn-accent" onClick={handleAddToCart}>Ajouter au panier</button>
          </div>

          <div className="mt-6">
            <ul className="list bg-base-100 rounded-box shadow-md max-w-2xl mx-auto">
              <h2 className="p-4 pb-2 text-xl font-bold">Stocks</h2>
              <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">20 derniers objets collectés</li>
              {materials
                .sort((a: any, b: any) => {
                  const dateA = new Date(`${a.receiving_date} ${a.receiving_time}`);
                  const dateB = new Date(`${b.receiving_date} ${b.receiving_time}`);
                  return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 10)
                .map((item: any, index: number) => (
                  <li key={index} className="list-row">
                    <div>
                      <img
                        className="size-15 rounded-box object-cover"
                        src={`/image/${Math.floor(Math.random() * 3) + 1}.jpg`}
                        alt={item.item_name}
                      />
                    </div>
                    <div className="place-content-between">
                      <div>
                        <div className="font-semibold">{item.item_name}</div>
                        <div className="text-xs uppercase font-semibold opacity-60">{item.material_category}</div>
                      </div>
                        <p className="list-col-wrap text-xs">
                        {item.description.charAt(0).toUpperCase() + item.description.slice(1).toLowerCase()}
                        </p>
                    </div>
                    
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}