export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  token: string
}

export interface Product {
  _id: string
  title: string
  description: string
  category: string
  image: string
  stock: number
  soldCount: number
  ratings: number
  originalPrice: number
  discountedPrice: number
  discountPercent: number
  createdAt: string
}

export interface CartItem {
  productId: Product
  quantity: number
  selected: boolean
  _id: string
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export interface OrderItem {
  productId: string
  title: string
  image: string
  quantity: number
  price: number
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  totalAmount: number
  shippingFee: number
  orderStatus: string
  createdAt: string
}

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode: string
}
