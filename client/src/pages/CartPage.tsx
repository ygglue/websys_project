import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, toggleSelect, toggleSelectAll, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Please log in to view your cart</h2>
        <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
      </div>
    )
  }

  if (loading) return <div className="loading-spinner">Loading...</div>

  const items = cart?.items || []
  const allSelected = items.length > 0 && items.every((i) => i.selected)
  const selectedItems = items.filter((i) => i.selected)
  const subtotal = selectedItems.reduce((sum, i) => sum + i.productId.discountedPrice * i.quantity, 0)
  const shipping = subtotal >= 500 ? 0 : 40

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart ({cart?.totalItems || 0} items)</h1>
        {items.length > 0 && (
          <button onClick={clearCart} className="btn-danger btn-sm">🗑️ Clear All</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add items you love!</p>
          <button onClick={() => navigate('/')} className="btn-primary">Start Shopping</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-select-all">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => toggleSelectAll(!allSelected)}
                />
                Select All ({items.length} items)
              </label>
            </div>

            {items.map((item) => (
              <div key={item._id} className={`cart-item ${!item.selected ? 'dimmed' : ''}`}>
                <input
                  type="checkbox"
                  className="item-checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.productId._id)}
                />
                <img src={item.productId.image} alt={item.productId.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.productId.title}</h3>
                  <p className="cart-item-price">₱{item.productId.discountedPrice.toLocaleString()}</p>
                  {item.productId.originalPrice > item.productId.discountedPrice && (
                    <p className="cart-item-original">₱{item.productId.originalPrice.toLocaleString()}</p>
                  )}
                </div>
                <div className="cart-item-qty">
                  <button
                    className="qty-btn"
                    onClick={() => {
                      if (item.quantity <= 1) removeItem(item.productId._id)
                      else updateQuantity(item.productId._id, item.quantity - 1)
                    }}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                    disabled={item.quantity >= item.productId.stock}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  ₱{(item.productId.discountedPrice * item.quantity).toLocaleString()}
                </div>
                <button
                  className="btn-remove"
                  onClick={() => removeItem(item.productId._id)}
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({selectedItems.length} items)</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₱${shipping}`}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₱{(subtotal + shipping).toLocaleString()}</span>
            </div>
            <button
              className="btn-primary btn-full"
              disabled={selectedItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Checkout ({selectedItems.length} items)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
