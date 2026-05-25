import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import api from '../api/axios'
import type { Cart } from '../types'
import { useAuth } from './AuthContext'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  toggleSelect: (productId: string) => Promise<void>
  toggleSelectAll: (selected: boolean) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCart = useCallback(async () => {
    if (!user) { setCart(null); return }
    try {
      setLoading(true)
      const { data } = await api.get('/api/cart')
      setCart(data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId: string, quantity = 1) => {
    const { data } = await api.post('/api/cart/add', { productId, quantity })
    setCart(data)
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const { data } = await api.put(`/api/cart/update/${productId}`, { quantity })
    setCart(data)
  }

  const removeItem = async (productId: string) => {
    const { data } = await api.delete(`/api/cart/remove/${productId}`)
    setCart(data)
  }

  const toggleSelect = async (productId: string) => {
    const { data } = await api.put(`/api/cart/select/${productId}`)
    setCart(data)
  }

  const toggleSelectAll = async (selected: boolean) => {
    const { data } = await api.put('/api/cart/select-all', { selected })
    setCart(data)
  }

  const clearCart = async () => {
    const { data } = await api.delete('/api/cart/clear')
    setCart(data)
  }

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeItem, toggleSelect, toggleSelectAll, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
