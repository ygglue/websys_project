import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import type { Product } from '../types'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/api/products/${id}`).then(({ data }) => {
      setProduct(data)
      setLoading(false)
    }).catch(() => { setLoading(false); navigate('/') })
  }, [id, navigate])

  if (loading) return <div className="loading-spinner">Loading...</div>
  if (!product) return null

  const handleAdd = async () => {
    const user = localStorage.getItem('user')
    if (!user) { navigate('/login'); return }
    await addToCart(product._id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="pdp-page">
      <div className="pdp-container">
        <div className="pdp-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="pdp-info">
          <p className="pdp-category">{product.category}</p>
          <h1>{product.title}</h1>
          <div className="pdp-meta">
            <span>⭐ {product.ratings}</span>
            <span>{product.soldCount} sold</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
          <div className="pdp-price">
            <span className="current-price">₱{product.discountedPrice.toLocaleString()}</span>
            {product.originalPrice > product.discountedPrice && (
              <>
                <span className="original-price">₱{product.originalPrice.toLocaleString()}</span>
                <span className="discount">-{product.discountPercent}%</span>
              </>
            )}
          </div>
          <p className="pdp-desc">{product.description}</p>
          <button
            className={`btn-primary btn-lg ${added ? 'btn-success' : ''}`}
            disabled={product.stock === 0}
            onClick={handleAdd}
          >
            {added ? '✓ Added!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
          <Link to="/cart" className="btn-outline btn-lg">View Cart</Link>
        </div>
      </div>
    </div>
  )
}
