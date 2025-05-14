"use client"
import { useEffect, useState } from "react";
import { getTimeToOrder } from "./actions/core";
import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Test() {
  const { data: materials, error } = useSWR('/api/materials', fetcher);

  const [time, setTime] = useState<number>(0);
  const [metalQty, setMetalQty] = useState<number>(0);
  const [textileQty, setTextileQty] = useState<number>(0);
  const [plasticQty, setPlasticQty] = useState<number>(0);
  const [cart, setCart] = useState({ count: 0, subtotal: 0 });

  const router = useRouter();
  const handlePayNow = async () => {
    await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plastic: plasticQty,
        metal: metalQty,
        textile: textileQty
      }),
    });
    router.push('/commande-confirmee');
  };

  useEffect(() => {
    getTimeToOrder(metalQty, textileQty, plasticQty).then(q => setTime(q));
  }, [metalQty, textileQty, plasticQty]);

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
    <div className="min-h-screen flex flex-col">
  
      {/* Header */}
      <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">PureDelhiMaterials</a>
  </div>
  <div className="flex-none">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
          <span className="badge badge-sm indicator-item">{cart.count}</span>
        </div>
      </div>
      <div
        tabIndex={0}
        className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
        <div className="card-body">
          <span className="text-lg font-bold">{cart.count} Items</span>
          <span className="text-info">Subtotal: ${cart.subtotal.toFixed(2)}</span>
          <div className="card-actions">
            <button className="btn btn-primary btn-block" onClick={handlePayNow}>Pay now</button>
          </div>
        </div>
      </div>
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  
      {/* Contenu principal réorganisé */}
      <main className="flex-grow px-6 flex">
        {/* Hero Section à gauche */}
        <div className="w-1/2">
          <div className="hero bg-base-200 h-full">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Hello there</h1>
                <p className="py-6">
                  Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                  quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
                <button className="btn btn-primary">Get Started</button>
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
                <input type="range" min={0} max="100" value={plasticQty} className="range" onChange={e => setPlasticQty(Number.parseInt(e.target.value))} />
                <p>{plasticQty} kg</p>
                <p className="text-sm text-gray-500">${(plasticQty * 1.4).toFixed(2)}</p>
              </div>
            </div>

            {/* Métal */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Métal</h2>
                <p className="text-sm opacity-60">$2.60 / kg</p>
                <input type="range" min={0} max="100" value={metalQty} className="range" onChange={e => setMetalQty(Number.parseInt(e.target.value))} />
                <p>{metalQty} kg</p>
                <p className="text-sm text-gray-500">${(metalQty * 2.6).toFixed(2)}</p>
              </div>
            </div>

            {/* Textile */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Textile</h2>
                <p className="text-sm opacity-60">$4.30 / kg</p>
                <input type="range" min={0} max="100" value={textileQty} className="range" onChange={e => setTextileQty(Number.parseInt(e.target.value))} />
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
                        className="size-10 rounded-box object-cover"
                        src={`https://media.istockphoto.com/id/1193095410/fr/photo/pollution-des-oc%C3%A9ans-en-plastique-et-microplastiques.jpg?s=612x612&w=0&k=20&c=ekP5cvjwx8iFCXL6-Jgi1VJsX8PezvGpDTBcLvDWt5Q=`}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://source.unsplash.com/40x40/?object";
                        }}
                      />
                    </div>
                    <div>
                      <div>{item.item_name}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">{item.material_category}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer sm:footer-horizontal items-center p-4">
  <aside className="grid-flow-col items-center">
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      className="fill-current">
      <path
        d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
    </svg>
    <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
  </aside>
  <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
      </svg>
    </a>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
      </svg>
    </a>
    <a>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="fill-current">
        <path
          d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
      </svg>
    </a>
  </nav>
</footer>
    </div>
  );
}