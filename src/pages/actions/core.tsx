"use server"
export async function getTimeToOrder(metalQty: number, textileQty: number, plasticQty: number) : Promise<number> {

    return metalQty + textileQty + plasticQty;

}