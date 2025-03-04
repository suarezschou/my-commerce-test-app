import { apiRoot } from "../lib/commercetools"
import type { Cart } from "@commercetools/platform-sdk"

const PROJECT_KEY = process.env.CTP_PROJECT_KEY || ""

export async function addProductToCart(
  cartId: string,
  version: number,
  productId: string,
  variantId: number,
  quantity: number,
  router: any, // Add router parameter
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
              action: "addLineItem",
              productId: productId,
              variantId: variantId,
              quantity: quantity,
            },
          ],
        },
      })
      .execute()

    const updatedCart: Cart = response.body // Extract the cart from the response.
    console.log("cart id being passed to url", updatedCart.id)

    // Navigate to the cart page using route parameters instead of query parameters
    router.push(`/cart/${updatedCart.id}`)

    return response
  } catch (error) {
    console.error("Error adding product to cart:", error)
    throw error
  }
}

