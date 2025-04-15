"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { fetchCart } from "@/app/actions/fetchCart"
import type { Cart, ProductProjection } from "@commercetools/platform-sdk"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/app/context/CartContext"
import Cookies from "js-cookie"
import { fetchProductProjection } from "@/app/actions/fetchProductProjection"
import { fetchAnonymousCart } from "@/app/actions/fetchAnonymousCart" 

interface EnrichedCartItem {
  productId: string
  variantId: number
  quantity: number
  productProjection?: ProductProjection; 
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [anonymousCartItems, setAnonymousCartItems] = useState<EnrichedCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { cartId } = useCart()
  const anonymousId = Cookies.get("anonymousId")

  useEffect(() => {
    console.log("useEffect: anonymousId =", anonymousId)

    if (anonymousId) {
      // Fetch anonymous cart using fetchAnonymousCart
      fetchAnonymousCart(anonymousId)
        .then(async (cartData) => {
          if (cartData && cartData.value) {
            const enrichedItems = await Promise.all(
              cartData.value.map(async (item: any) => {
                try {
                  console.log("Fetching product projection for productId:", item.productId);
                  const productProjection = await fetchProductProjection(item.productId)
                  return { ...item, productProjection }
                } catch (err) {
                  console.error("Error fetching product projection:", err)
                  return { ...item, productProjection: null }
                }
              }),
            )
            setAnonymousCartItems(enrichedItems)
          }
        })
        .catch((err) => {
          console.error("Error fetching anonymous cart:", err)
          setError(err.message || "Failed to fetch anonymous cart.")
        })
        .finally(() => setLoading(false))
    } else if (cartId) {
      async function fetchCartItems() {
        try {
          const cartData = await fetchCart(cartId as string)
          setCart(cartData)
        } catch (err: any) {
          console.error("Error fetching cart:", err)
          setError(err.message || "Failed to fetch cart.")
        } finally {
          setLoading(false)
        }
      }
      fetchCartItems()
    } else {
      setLoading(false)
    }
  }, [cartId, anonymousId])

  if (loading) {
    return <div>Loading cart...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  let itemsToRender: any[] = []
  if (anonymousCartItems.length > 0) {
    itemsToRender = anonymousCartItems
  } else if (cart && cart.lineItems) {
    itemsToRender = cart.lineItems
  }

  return (
    <div className="flex-col items-center sm:justify-center justify-center w-full p-3">
      <Card className="flex flex-col items-center overflow-hidden">
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl">Your Cart</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {itemsToRender.length > 0 ? (
            itemsToRender.map((item: any) => (
              <div key={item.id || `${item.productId}-${item.variantId}`} className="mb-4">
                {item.productProjection &&
                  item.productProjection.masterData &&
                  item.productProjection.masterData.current &&
                  item.productProjection.masterData.current.masterVariant &&
                  item.productProjection.masterData.current.masterVariant.images &&
                  item.productProjection.masterData.current.masterVariant.images.length > 0 && (
                    <img
                        src={item.productProjection.masterData.current.masterVariant.images[0].url}
                        alt={item.productProjection.name?.["en-US"] || "Product Image"}
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                    />
                )}
                
                <h2 className="text-2xl">
                    {item.productProjection?.masterData?.current?.name?.["en-US"] || item.productId || "Product Name Unavailable"}
                </h2>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button className="text-2xl px-8 py-8" onClick={() => router.push("/checkout")}>
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CartPage

