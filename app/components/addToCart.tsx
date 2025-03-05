"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { addProductToCart, createNewCart } from "@/app/actions/cart"
import { fetchCart } from "@/app/actions/fetchCart"
import { useCart } from "@/app/context/CartContext"
import type { ProductProjection } from "@commercetools/platform-sdk"

interface AddToCartProps {
  product: ProductProjection | null
}

const AddToCart: React.FC<AddToCartProps> = ({ product }) => {
  const [addingToCart, setAddingToCart] = useState(false)
  const router = useRouter()
  const { cartId, setCartId } = useCart()

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    try {
      let currentCartId = cartId
      let currentCartVersion: number

      if (currentCartId) {
        try {
          const currentCart = await fetchCart(currentCartId)
          currentCartVersion = currentCart.version
          console.log("Current cart version:", currentCartVersion)
        } catch (error) {
          console.error("Failed to fetch current cart, creating a new one:", error)
          const newCart = await createNewCart()
          if (newCart.cart) {
            currentCartId = newCart.cart.id
            currentCartVersion = newCart.cart.version
            setCartId(currentCartId)
          } else {
            throw new Error("Failed to create a new cart")
          }
        }
      } else {
        const newCart = await createNewCart()
        if (newCart.cart) {
          currentCartId = newCart.cart.id
          currentCartVersion = newCart.cart.version
          setCartId(currentCartId)
        } else {
          throw new Error("Failed to create a new cart")
        }
      }

      await addProductToCart(currentCartId, currentCartVersion, product.id, product.masterVariant.id, 1)

      console.log("Product added to cart successfully")
      router.push(`/cart/${currentCartId}`)
    } catch (error) {
      console.error("Failed to add product to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <Button className="font-thin text-3xl flex flex-row p-10" onClick={handleAddToCart} disabled={addingToCart}>
      {addingToCart ? "Adding to Cart..." : "Tilføj til kurv"}
    </Button>
  )
}

export default AddToCart

