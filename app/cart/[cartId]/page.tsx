"use client"
import { useState, useEffect } from "react"
import { fetchCart } from "@/app/actions/fetchCart"
import { Cart, LineItem } from "@commercetools/platform-sdk"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/app/context/CartContext" // Import useCart

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { cartId } = useCart() // Get cartId from context

    console.log("cartId from context:", cartId)

    useEffect(() => {
        if (cartId) {
            async function fetchCartItems() {
                try {
                    const cartData = await fetchCart(cartId as string)
                    console.log("cartData:", cartData)
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
    }, [cartId])

    if (loading) {
        return <div>Loading cart...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!cart) {
        return <div>Cart not found.</div>
    }

    return (
        <div className="font-extralight thin flex flex-col items-center min-h">
            <Card>
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-3xl">Your Cart</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {cart.lineItems.length > 0 ? (
                        cart.lineItems.map((item: LineItem) => (
                            <div key={item.id} className="mb-4">
                                <h2 className="text-xl">{item.name["en-US"] || "Product Name Unavailable"}</h2>
                                {item.variant.images && item.variant.images.length > 0 && (
                                    <img
                                        src={item.variant.images[0].url || "/placeholder.svg"}
                                        alt={item.name["en-US"] || "Product Image"}
                                        width={100}
                                    />
                                )}
                                <p>Quantity: {item.quantity}</p>
                                <p>
                                    Price: {item.price.value.centAmount / 100} {item.price.value.currencyCode}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="font-thin text-3xl flex flex-row p-10" onClick={() => router.push("/checkout")}>
                        Proceed to Checkout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CartPage