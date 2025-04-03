import { apiRoot } from '../lib/commercetools';


export const createStandardCartFromAnonymous = async (
  anonymousCartItems: any[],
  anonymousId: string,
  shippingInfo: any,
) => {

  try {
    // 1. Create a new cart in Commercetools
    const cartResponse = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .carts()
      .post({
        body: {
          currency: "USD", // Set your currency
          anonymousId: anonymousId,
          country: shippingInfo.country || "US",
          shippingAddress: {
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            streetName: shippingInfo.address1,
            additionalStreetInfo: shippingInfo.address2,
            city: shippingInfo.city,
            state: shippingInfo.state,
            postalCode: shippingInfo.postalCode,
            country: shippingInfo.country || "US",
            email: shippingInfo.email,
            phone: shippingInfo.phone,
          },
        },
      })
      .execute()

    const cart = cartResponse.body

    // 2. Add each item from the anonymous cart to the new cart
    let updatedCart = cart

    for (const item of anonymousCartItems) {
      const addLineItemResponse = await apiRoot
        .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: updatedCart.version,
            actions: [
              {
                action: "addLineItem",
                productId: item.productId,
                variantId: item.variantId || 1,
                quantity: item.quantity,
              },
            ],
          },
        })
        .execute()

      updatedCart = addLineItemResponse.body
    }

    // 3. Return the standard cart
    return updatedCart
  } catch (error) {
    console.error("Error creating standard cart from anonymous cart:", error)
    throw error
  }
}

