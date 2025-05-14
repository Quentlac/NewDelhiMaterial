import { useEffect, useState } from "react";

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

export default function MaCommande() {
  const [commande, setCommande] = useState<Commande[]>([]);

  useEffect(() => {
    // Simuler récupération d'une commande (ici juste un exemple)
    const example = [
      { type: "plastique", quantity: 12, pricePerKg: PRICES.plastique },
      { type: "metal", quantity: 5, pricePerKg: PRICES.metal },
      { type: "textile", quantity: 7, pricePerKg: PRICES.textile },
    ];
    setCommande(example);
  }, []);

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
        <a href="/" className="btn btn-primary">Retour à l'accueil</a>
      </div>
    </div>
  );
}
