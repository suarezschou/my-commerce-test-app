import { Cart } from '@commercetools/platform-sdk';
import { apiRoot } from '../lib/commercetools';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || "";

export async function createCart(): Promise<Cart> {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: PROJECT_KEY })
      .carts()
      .post({
        body: {
          currency: 'EUR',
          country: 'DE', 
          inventoryMode: 'ReserveOnOrder',
          taxMode: 'Platform',
          lineItems: [], //empty line items
          shippingAddress: undefined, 
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}
export async function createNewCart() { //added createNewCart function to return the cart
  return await createCart();
}