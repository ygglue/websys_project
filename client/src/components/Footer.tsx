import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>7-Evelyn</h4>
          <p>Your convenient online neighborhood store.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@7-evelyn.com</p>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 7-Evelyn. All rights reserved.</p>
      </div>
    </footer>
  )
}
