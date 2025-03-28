import { NextResponse } from "next/server"
import { fetchAnonymousCart } from "../../actions/fetchAnonymousCart"

export async function GET(request: Request) {
  try {
    // Get the anonymous ID from the request headers
    const anonymousId = request.headers.get("X-Anonymous-ID")

    if (!anonymousId) {
      return NextResponse.json({ error: "Anonymous ID is required" }, { status: 400 })
    }

    // Use your existing function to fetch the cart
    const anonymousCartObj = await fetchAnonymousCart(anonymousId)

    // Extract the cart items from your custom object structure
    // Assuming the value property contains the cart items
    const items = anonymousCartObj.value || []

    // Calculate totals based on your cart structure
    // This would need to be adjusted based on your actual data structure
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0)
    const shipping = 5.99
    const tax = subtotal * 0.08 // Example tax calculation
    const total = subtotal + shipping + tax

    // Format the response in the structure expected by the frontend
    const cart = {
      items,
      subtotal,
      shipping,
      tax,
      total,
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

