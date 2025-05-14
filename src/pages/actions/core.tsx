"use server"
export async function getTimeToOrder(metalQty: number, textileQty: number) : Promise<number> {

    return metalQty + textileQty;

}