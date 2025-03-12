// app/context/CartContext.tsx
"use client"
import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import Cookies from "js-cookie"

interface CartContextType {
  cartId: string | null
  setCartId: (cartId: string | null) => void
  anonymousId: string | null
  clearAnonymousId: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartId, setCartId] = useState<string | null>(null)
  const [anonymousId, setAnonymousId] = useState<string | null>(null)

  // Initialize state from cookies on mount
  useEffect(() => {
    const storedCartId = Cookies.get("cartId")
    const storedAnonymousId = Cookies.get("anonymousId")

    if (storedCartId) setCartId(storedCartId)
    if (storedAnonymousId) setAnonymousId(storedAnonymousId)
  }, [])

  // Update cookies when cartId changes
  useEffect(() => {
    if (cartId) {
      Cookies.set("cartId", cartId, { expires: 30 })
    } else {
      Cookies.remove("cartId")
    }
  }, [cartId])

  // Function to clear anonymousId from both state and cookie
  const clearAnonymousId = () => {
    setAnonymousId(null)
    Cookies.remove("anonymousId")
    console.log("Cleared anonymousId from context and cookie")
  }

  return (
    <CartContext.Provider value={{ cartId, setCartId, anonymousId, clearAnonymousId }}>{children}</CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

