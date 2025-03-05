// Code to fetch a cart from commercetools
import { apiRoot } from '../lib/commercetools';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';

export async function fetchCart(cartId: string) {
  try {
    const { body } = await apiRoot
      .withProjectKey({ projectKey: PROJECT_KEY })
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();
      
    return body;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}