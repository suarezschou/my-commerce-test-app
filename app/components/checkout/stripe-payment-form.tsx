"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/utils/get-stripe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Cookies from "js-cookie"

// Wrapper component that provides Stripe Elements
export function StripePaymentForm({
  amount,
  onSuccess,
}: {
  amount: number
  onSuccess: (paymentInfo: any) => void
}) {
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create a payment intent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/checkout/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            anonymousId: Cookies.get("anonymousId"),
          }),
        })

        const data = await response.json()

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          console.error("Failed to create payment intent:", data.error)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">Unable to initialize payment. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  )
}

// The actual form that uses Stripe Elements
function CheckoutForm({ onSuccess }: { onSuccess: (paymentInfo: any) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)
    setErrorMessage(undefined)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmation`,
      },
      redirect: "if_required",
    })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded, call the onSuccess callback
      onSuccess({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back from cents
        status: paymentIntent.status,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentElement />

          {errorMessage && <div className="text-destructive text-sm mt-2">{errorMessage}</div>}

          <Button type="submit" disabled={!stripe || isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

