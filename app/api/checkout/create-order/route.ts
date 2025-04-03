// app/api/checkout/create-order/route.ts
import { NextResponse } from "next/server"
import { fetchAnonymousCart } from "@/app/actions/fetchAnonymousCart"
import { createCommercetoolsOrder } from "@/app/actions/createCommercetoolsOrder"
import { createStandardCartFromAnonymous } from "@/app/actions/createStandardCartFromAnonymous"
import { clearAnonymousCart } from "@/app/actions/clearAnonymousCart"

export async function POST(request: Request) {
  try {
    console.log("Starting order creation process")

    const body = await request.json()
    const { shippingInfo, paymentInfo, anonymousId } = body

    console.log("Request body received:", {
      hasShippingInfo: !!shippingInfo,
      hasPaymentInfo: !!paymentInfo,
      anonymousId: anonymousId?.substring(0, 5) + "...", // Log partial ID for privacy
    })

    if (!anonymousId) {
      return NextResponse.json({ error: "Anonymous ID is required" }, { status: 400 })
    }

    try {
      // Step 1: Fetch anonymous cart
      console.log("Fetching anonymous cart")
      const anonymousCartObj = await fetchAnonymousCart(anonymousId)

      if (!anonymousCartObj || !anonymousCartObj.value) {
        console.log("Cart not found for anonymousId:", anonymousId?.substring(0, 5) + "...")
        return NextResponse.json({ error: "Cart not found" }, { status: 404 })
      }

      console.log("Anonymous cart found with items:", anonymousCartObj.value.length)
      const cartItems = anonymousCartObj.value

      // Step 2: Create standard cart
      console.log("Creating standard cart from anonymous cart")
      const standardCart = await createStandardCartFromAnonymous(cartItems, anonymousId, shippingInfo)
      console.log("Standard cart created with ID:", standardCart.id)

      // Step 3: Create the order
      console.log("Creating Commercetools order")
      const commercetoolsOrder = await createCommercetoolsOrder(standardCart.id, standardCart.version, paymentInfo)
      console.log("Order created with ID:", commercetoolsOrder.id)

      // Step 4: Clear anonymous cart
      console.log("Clearing anonymous cart")
      await clearAnonymousCart(anonymousId)
      console.log("Anonymous cart cleared")

      return NextResponse.json({
        success: true,
        orderId: commercetoolsOrder.id,
        orderNumber: commercetoolsOrder.orderNumber || `ORD-${Date.now()}`,
        message: "Order created successfully",
      })
    } catch (specificError: any) {
      // Catch specific errors from the order creation process
      console.error("Specific error in order creation process:", specificError)
      console.error("Error details:", specificError.message)
      console.error("Error stack:", specificError.stack)

      // Return more detailed error information
      return NextResponse.json(
        {
          error: "Failed to create order",
          message: specificError.message,
          step: specificError.step || "unknown",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    // Catch any other errors in the route handler
    console.error("General error in route handler:", error)
    console.error("Error details:", error.message)
    console.error("Error stack:", error.stack)

    return NextResponse.json(
      {
        error: "Failed to process order request",
        message: error.message,
      },
      { status: 500 },
    )
  }
}

