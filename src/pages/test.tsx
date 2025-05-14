"use client"
import { useEffect, useState } from "react";
import { getTimeToOrder } from "./actions/core";

export default function Test() {
  const [time, setTime] = useState<number>(0);
  const [metalQty, setMetalQty] = useState<number>(0);
  const [textileQty, setTextileQty] = useState<number>(0);


   useEffect(() => {
    getTimeToOrder(metalQty, textileQty).then(q => setTime(q));
   }, [metalQty, textileQty]);

  return (<div className="h-full w-full">
    <p className="text-2xl">{time}</p>

    <span className="flex text-2xl align-center">
      <p>Métal</p>
      <input type="range" min={0} max="100" value={metalQty} className="range" onChange={e => setMetalQty(Number.parseInt(e.target.value))} />
      <p>{metalQty} kg</p>
    </span>

    <span className="flex text-2xl align-center">
      <p>Textile</p>
      <input type="range" min={0} max="100" value={textileQty} className="range" onChange={e => setTextileQty(Number.parseInt(e.target.value))} />
      <p>{textileQty} kg</p>
    </span>
    </div>
  );
}