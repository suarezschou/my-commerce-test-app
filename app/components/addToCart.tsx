import { apiRoot } from '../lib/commercetools';

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || '';

export async function addProductToCart( 
  cartId: string,
  version: number,
  productId: string,
  variantId: number,
  quantity: number
) {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: PROJECT_KEY })
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: version,
          actions: [
            {
              action: 'addLineItem',
              productId: productId,
              variantId: variantId,
              quantity: quantity,
            },
          ],
        },
      })
      .execute();
    return response;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
}