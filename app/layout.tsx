import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Montserrat, Playfair_Display } from "next/font/google"
import { CartProvider } from "./context/CartContext"
import { AnonymousIdHandler } from "./components/AnonymousIdHandler"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair_display.variable} ${montserrat.variable} antialiased`}>
        <CartProvider>
          <AnonymousIdHandler />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

