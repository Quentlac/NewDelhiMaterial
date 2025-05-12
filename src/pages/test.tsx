
import { getTimeToOrder } from "./api/core";

export default async function Test() {
  const qty = await getTimeToOrder(10, 10);

  return (
    <h1>{qty}</h1>
   
  );
}