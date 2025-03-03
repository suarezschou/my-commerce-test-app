import { apiRoot } from '../lib/commercetools';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || "";

export async function createCart(currency: string = 'EUR'){
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: PROJECT_KEY })
      .carts()
      .post({
        body: {
          currency: currency,
          country: 'US', 
          inventoryMode: 'ReserveOnOrder',
          taxMode: 'Platform',
          lineItems: [], // Start with an empty cart
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