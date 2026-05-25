import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import type { Product } from '../types'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category', selectedCategory)
      const { data } = await api.get(`/api/products?${params}`)
      setProducts(data.products)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api.get('/api/products/categories').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, search])

  return (
    <div className="home-page">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Big Sale!</h1>
          <p>Up to 40% off on selected items</p>
          <Link to="/register" className="btn-primary">Shop Now</Link>
        </div>
      </div>

      <div className="shop-header">
        <h2>{selectedCategory || 'All Products'}</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={fetchProducts}>🔍</button>
        </div>
      </div>

      <div className="filter-row">
        <button
          className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`}>
                <div className="product-image">
                  <img src={product.image} alt={product.title} loading="lazy" />
                  {product.discountPercent > 0 && (
                    <span className="discount-badge">-{product.discountPercent}%</span>
                  )}
                </div>
              </Link>
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <Link to={`/product/${product._id}`} className="product-title">{product.title}</Link>
                <div className="product-meta">
                  <span className="rating">⭐ {product.ratings}</span>
                  <span className="sold">{product.soldCount} sold</span>
                </div>
                <div className="product-price">
                  <span className="current-price">₱{product.discountedPrice.toLocaleString()}</span>
                  {product.originalPrice > product.discountedPrice && (
                    <span className="original-price">₱{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <button
                  className="btn-cart-add"
                  disabled={product.stock === 0 || adding === product._id}
                  onClick={async () => {
                    setAdding(product._id)
                    try {
                      const token = localStorage.getItem('user')
                      if (!token) { window.location.href = '/login'; return }
                      const { default: api } = await import('../api/axios')
                      await api.post('/api/cart/add', { productId: product._id })
                      window.dispatchEvent(new Event('cart-updated'))
                    } finally {
                      setAdding(null)
                    }
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : adding === product._id ? 'Adding...' : '🛒 Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
