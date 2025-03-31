// /app/lib/commercetools/createCommercetoolsOrder.ts

import { apiRoot } from '../lib/commercetools';

export async function createCommercetoolsOrder(cartId: string, shippingInfo: any, paymentInfo: any) {
    try {
        const cartResponse = await apiRoot
            .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
            .carts()
            .withId({ ID: cartId })
            .get()
            .execute();

const cart = cartResponse.body; 
        if (!cart || !cart.lineItems) {
            throw new Error('Cart not found');
        }

        const orderData = {
            lineItems: cart.lineItems.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            shippingAddress: {
                firstName: shippingInfo.firstName,
                lastName: shippingInfo.lastName,
                streetName: shippingInfo.streetName,
                postalCode: shippingInfo.postalCode,
                city: shippingInfo.city,
                country: shippingInfo.country,
            },
            custom: {
                type: {
                    typeId: 'type',
                    id: process.env.CTP_PAYMENT_CUSTOM_TYPE_ID,
                },
                fields: {
                    stripePaymentIntentId: paymentInfo.id,
                },
            },
        };

        // Create the order from the cart
        const order = await apiRoot
            .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
            .orders()
            .post({
                body: {
                    cart: {
                        typeId: 'cart',
                        id: cartId,
                    },
                    version: cart.version, 
                },
            })
            .execute();

        return order.body;
    } catch (error) {
        console.error('Error creating Commercetools order:', error);
        throw error;
    }
}