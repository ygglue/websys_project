import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ fullName: '', phone: '', address: '', city: '', postalCode: '' })
  const [loading, setLoading] = useState(false)

  const selectedItems = cart?.items?.filter((i) => i.selected) || []
  const subtotal = selectedItems.reduce((sum, i) => sum + i.productId.discountedPrice * i.quantity, 0)
  const shipping = subtotal >= 500 ? 0 : 40
  const total = subtotal + shipping

  if (selectedItems.length === 0) {
    navigate('/cart')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/orders', { shippingAddress: address })
      navigate('/orders?success=true')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Address</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input required value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input required value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Processing...' : `Place Order - ₱${total.toLocaleString()}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {selectedItems.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={item.productId.image} alt={item.productId.title} />
              <div>
                <p className="checkout-item-title">{item.productId.title}</p>
                <p>x{item.quantity}</p>
              </div>
              <span>₱{(item.productId.discountedPrice * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>₱{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₱${shipping}`}</span></div>
          <div className="summary-row total"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
          <p className="payment-method">💳 Payment: Cash on Delivery</p>
        </div>
      </div>
    </div>
  )
}
