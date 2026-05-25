import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { dark, toggle } = useTheme()

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏪</span> 7-Evelyn
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                🛒 Cart{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="nav-link">Orders</Link>
              <span className="nav-user">Hi, {user.name}</span>
              {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
              <button onClick={logout} className="btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
            </>
          )}
          <button onClick={toggle} className="theme-toggle" title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}
