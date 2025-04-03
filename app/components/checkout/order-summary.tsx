"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Cookies from "js-cookie"

export function OrderSummary() {
  interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
  }

  interface Cart {
    items: CartItem[]
    subtotal: number
    shipping: number
    tax: number
    total: number
  }

  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: 5,
    tax: 0,
    total: 0,
  })

  useEffect(() => {
    // Fetch the cart data from your API
    // using the anonymousId from cookies
    const fetchCart = async () => {
      try {
        // This is a placeholder for the actual API call
        const response = await fetch("/api/cart", {
          headers: {
            "X-Anonymous-ID": Cookies.get("anonymousId") || "",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCart(data)
        }
      } catch (error) {
        console.error("Error fetching cart:", error)

        // Fallback data for demo purposes
        setCart({
          items: [
            { id: 1, name: "Product 1", price: 29.99, quantity: 1 },
            { id: 2, name: "Product 2", price: 49.99, quantity: 2 },
          ],
          subtotal: 129.97,
          shipping: 5.99,
          tax: 10.4,
          total: 146.36,
        })
      }
    }

    fetchCart()
  }, [])

  console.log("Cart Items in OrderSummary:", cart.items);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p>${cart.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p>${cart.shipping.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Tax</p>
              <p>${cart.tax.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-medium text-lg">
            <p>Total</p>
            <p>${cart.total.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

