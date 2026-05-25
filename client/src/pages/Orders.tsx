import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import type { Order } from '../types'
import { useAuth } from '../context/AuthContext'

const statusColors: Record<string, string> = {
  Pending: '#f59e0b',
  Processing: '#3b82f6',
  Shipped: '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    api.get('/api/orders').then(({ data }) => {
      setOrders(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const success = searchParams.get('success')

  if (!user) {
    return <div className="empty-state"><h2>Please log in to view orders</h2></div>
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {success && (
        <div className="toast success">
          ✅ Order placed successfully! Your items are on the way.
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-cart-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-status" style={{ color: statusColors[order.orderStatus] || '#111' }}>
                  ● {order.orderStatus}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <img src={item.image} alt={item.title} />
                    <div className="order-item-info">
                      <p>{item.title}</p>
                      <p>x{item.quantity}</p>
                    </div>
                    <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span>Shipping: ₱{order.shippingFee}</span>
                <span className="order-total">Total: ₱{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
