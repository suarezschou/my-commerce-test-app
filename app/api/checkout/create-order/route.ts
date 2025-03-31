import { NextResponse } from "next/server"
import { fetchAnonymousCart } from "@/app/actions/fetchAnonymousCart"
import { createCommercetoolsOrder } from "@/app/actions/createCommercetoolsOrder"


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shippingInfo, paymentInfo, anonymousId } = body

    if (!anonymousId) {
      return NextResponse.json({ error: "Anonymous ID is required" }, { status: 400 })
    }

    const anonymousCartObj = await fetchAnonymousCart(anonymousId)

    if (!anonymousCartObj || !anonymousCartObj.value) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    const cartItems = anonymousCartObj.value.items; // Extract cart items

    // Create the order in Commercetools
    const order = await createCommercetoolsOrder(cartItems, shippingInfo, paymentInfo);


    // Implement clearing => await clearAnonymousCart(anonymousId);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful order creation
    const orderId = `ORD-${Date.now()}`

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order created successfully",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

