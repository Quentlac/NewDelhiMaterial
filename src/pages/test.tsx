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
  <div className="flex-1 flex items-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 512 512">
<path fill="#497336" d="M7.9,256C7.9,119,119,7.9,256,7.9C393,7.9,504.1,119,504.1,256c0,137-111.1,248.1-248.1,248.1C119,504.1,7.9,393,7.9,256z"></path><path fill="#FFF" d="M186,284.7c-6.2-23.9-12.4-47.9-18.6-71.9c-1-3.9-5.1-6.2-9-5.2c-23.9,6.2-47.9,12.4-71.8,18.6c-6.3,1.6-7.2,10.2-1.8,13.5c7.6,4.5,15.3,9,22.9,13.5l-26.9,46.7c-2.7,4.7-2.7,12.7,0,17.4l26.1,45.2c0.4-2.5,1.4-5,2.9-7.6l43.4-74.9c7.2,4.2,14.3,8.4,21.5,12.6c0.4,0.3,0.8,0.5,1.2,0.6c3,1.5,5.8,0.7,7.8-1.2C185.7,290.4,186.9,287.9,186,284.7z"></path><path fill="#FFF" d="M235.6 347.6c.1-15.6-12.6-29-28.1-29.5v-.1h-68l-22.4 38.5c-1.8 3.2-2.7 6.1-2.7 8.8-.1 4 1.7 7.3 5.2 9.3 2 1 4 1.7 6 2 .4.1.8.1 1.2.1l4.2.1h70.5c0 0 .1 0 .1 0 1.5 0 2.9 0 4.4 0 0 0 .1 0 .1 0h1.3v-.1C222.8 375.9 235.5 363.2 235.6 347.6zM349.3 106.3c-7.7 4.4-15.4 8.8-23 13.2l-27.1-46.6c-2.7-4.7-9.7-8.6-15.1-8.6l-52.2.2c1.9 1.6 3.7 3.7 5.2 6.3l43.4 74.9c-7.4 4.2-14.9 8.5-22.3 12.7 0 0 0 0 0 0 0 0-.1.1-.1.1-3 1.8-3.8 4.7-3.2 7.4.3 2.6 1.9 5 5.1 5.9 23.9 6.5 47.7 13 71.6 19.5 3.9 1 8-1.3 9-5.1 6.5-23.9 13-47.7 19.5-71.6C361.8 108.3 354.8 103.1 349.3 106.3z"></path><path fill="#FFF" d="M225.7 69.7c-3.4-2.1-7.2-2.1-10.7-.2-1.8 1.2-3.4 2.6-4.8 4.2-.2.3-.5.6-.7 1l-2.2 3.6-38 66.4.1 0c-7 13.7-2.1 31.1 11.4 38.9 13.5 7.8 31.3 3.3 39.5-9.8l.1.1 33.8-59L232 76.4C230.2 73.3 228 71.1 225.7 69.7zM419.9 319.6l-86.6.2c0-8.3.1-16.6.1-24.9 0-.5 0-1-.1-1.5-.3-3.1-2.2-5.1-4.7-5.9-2.3-1-5-.9-7.3 1.1-.2.1-.3.2-.5.4 0 0 0 0 0 0-17.6 17.4-35.1 34.9-52.7 52.3-2.9 2.8-2.7 7.6.1 10.4 17.4 17.5 34.9 35.1 52.3 52.6 4.5 4.5 12.5 1.2 12.5-5.2 0-8.9.1-17.8.1-26.7l53.9-.3c5.4 0 12.3-4.1 15-8.8l25.9-45.4C425.6 319.1 422.9 319.5 419.9 319.6z"></path><path fill="#FFF" d="M430.6,295c-0.1-0.4-0.3-0.7-0.5-1.1l-2-3.7l-35.7-61.1c0,0,0-0.1-0.1-0.1c-0.7-1.3-1.5-2.5-2.2-3.8c0,0-0.1-0.1-0.1-0.1l-0.5-0.9l0,0c-8.4-13-26.1-17.4-39.6-9.5c-13.4,7.9-18.2,25.4-11.1,39l-0.1,0.1l34.3,58.7l44.5-0.1c3.6,0,6.7-0.8,9-2.1c3.5-1.9,5.4-5.2,5.5-9.2C431.8,299,431.3,296.9,430.6,295z"></path>
</svg>
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
                <button className="btn btn-primary">Commençons</button>
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
 
      {/* Footer */}
      <footer className="footer sm:footer-horizontal items-center p-4">
  <aside className="grid-flow-col items-center gap-4">
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 26 26" className="fill-current">
      <path d="M 18.03125 1.0625 L 11.5 1.09375 C 11.714844 1.152344 12.207031 1.25 12.5625 1.84375 L 15.78125 7.46875 L 14.03125 8.5 L 19.78125 8.46875 L 22.59375 3.53125 L 20.84375 4.5625 L 19.15625 1.625 C 18.976563 1.25 18.703125 1 18.03125 1.0625 Z M 10.28125 1.28125 C 9.410156 1.226563 8.40625 1.53125 7.65625 2.5625 L 7.59375 2.65625 L 5.1875 6.8125 L 10.1875 9.71875 L 13.34375 4.25 L 12.125 2.15625 C 11.886719 1.761719 11.152344 1.335938 10.28125 1.28125 Z M 23 8.3125 L 18 11.21875 L 21.125 16.65625 L 23.5625 16.65625 C 24.46875 16.636719 26.480469 14.917969 25.4375 12.59375 L 25.40625 12.46875 Z M 1.21875 9.5 L 2.96875 10.53125 L 1.28125 13.4375 C 1.066406 13.773438 0.96875 14.132813 1.34375 14.6875 L 4.65625 20.375 C 4.597656 20.140625 4.445313 19.652344 4.78125 19.0625 L 8.03125 13.4375 L 9.8125 14.46875 L 6.90625 9.5 Z M 16.96875 15.15625 L 14.125 20.125 L 16.9375 25.0625 L 16.96875 23 L 20.34375 23 C 20.738281 23.039063 21.101563 22.953125 21.375 22.34375 L 24.65625 16.65625 C 24.5 16.8125 24.125 17.167969 23.4375 17.1875 L 16.96875 17.1875 Z M 6.46875 17.1875 L 5.25 19.28125 C 4.816406 20.089844 5.300781 22.679688 7.84375 22.9375 L 7.96875 22.96875 L 12.78125 22.96875 L 12.78125 17.1875 Z"></path>
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