import { NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, anonymousId } = body

    if (!anonymousId) {
      return NextResponse.json({ error: "Anonymous ID is required" }, { status: 400 })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: "usd",
      // Store the anonymousId in the metadata for reference
      metadata: {
        anonymousId,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}

