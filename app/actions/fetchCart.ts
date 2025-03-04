import { Cart } from '@commercetools/platform-sdk';
import { apiRoot } from '../lib/commercetools';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';

export async function fetchCart(cartId: string): Promise<Cart> {
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