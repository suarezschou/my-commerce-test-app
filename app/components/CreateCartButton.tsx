"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createNewCart } from "@/app/actions/cart"
import { useCart } from "../context/CartContext"

export default function CreateCartButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setCartId, clearAnonymousId } = useCart()

  const handleCreateCart = async () => {
    setIsLoading(true)
    try {
      // Clear the anonymousId first to prevent race conditions
      clearAnonymousId()

      const result = await createNewCart()
      if (result.success) {
        console.log("New cart created:", result.cart)
        if (result.cart) {
          const cartId = result.cart.id
          setCartId(cartId) // Set the cartId in the context

          // Wait a small amount of time to ensure state changes are processed
          setTimeout(() => {
            router.push(`/cart/${cartId}`)
            router.refresh()
          }, 100)
        } else {
          console.error("Cart is undefined")
        }
      } else {
        console.error("Failed to create cart:", result.error)
      }
    } catch (error) {
      console.error("Error creating cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button className="bg-orange-400" onClick={handleCreateCart} disabled={isLoading}>
      {isLoading ? "Creating Cart..." : "Create New Cart"}
    </button>
  )
}

