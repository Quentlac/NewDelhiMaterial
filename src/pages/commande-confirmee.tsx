import { useRouter } from 'next/router';
import Layout from "@/components/Layout";


export default function CommandeConfirmee() {
  const router = useRouter();
  const { id } = router.query;
  const cart = { count: 0, subtotal: 0 };
  const handlePayNow = () => {};

  return (
    <Layout cart={cart} handlePayNow={handlePayNow}>
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center p-6">
        <h1 className="text-4xl font-bold text-success mb-4">Commande confirmée !</h1>
        <p className="text-lg mb-6">
            Merci pour votre commande. Vos matériaux seront bientôt prêts.
        </p>
        <a
            href={id ? `/ma-commande?id=${id}` : '#'}
            className={`btn btn-primary ${!id ? 'btn-disabled' : ''}`}
        >
            Voir ma commande
        </a>
        </div>
    </Layout>
  );
}