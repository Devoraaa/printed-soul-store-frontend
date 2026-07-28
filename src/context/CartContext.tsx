import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { cartApi } from "../lib/api"
import { useAuth } from "./AuthContext"

interface CartItem {
  product: { _id: string; name: string; price: number; images: string[]; slug: string; stock: number }
  quantity: number
  price: number
}

interface CartContextType {
  items: CartItem[]
  totalAmount: number
  totalItems: number
  isLoading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const refreshCart = async () => {
    if (!isAuthenticated) { setItems([]); return }
    try {
      const { data } = await cartApi.get()
      setItems(data.data?.items || [])
      setTotalAmount(data.data?.totalAmount || 0)
    } catch { setItems([]) }
  }

  useEffect(() => { refreshCart() }, [isAuthenticated])

  const addToCart = async (productId: string, quantity = 1) => {
    setIsLoading(true)
    await cartApi.add(productId, quantity)
    await refreshCart()
    setIsLoading(false)
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true)
    await cartApi.update(productId, quantity)
    await refreshCart()
    setIsLoading(false)
  }

  const removeFromCart = async (productId: string) => {
    setIsLoading(true)
    await cartApi.remove(productId)
    await refreshCart()
    setIsLoading(false)
  }

  const clearCart = async () => {
    setIsLoading(true)
    await cartApi.clear()
    setItems([])
    setTotalAmount(0)
    setIsLoading(false)
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, totalAmount, totalItems, isLoading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
