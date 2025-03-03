// app/actions/cart.ts
'use server'
import { createCart } from '../components/createCart';

export async function createNewCart(currency: string = 'EUR') {
  try {
    const cart = await createCart(currency);
    return { success: true, cart };
  } catch (error) {
    console.error('Failed to create cart:', error);
    return { success: false, error: 'Failed to create cart' };
  }
}