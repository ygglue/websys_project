import { Router } from 'express'
import {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', getProducts)
router.get('/categories', getCategories)
router.get('/:id', getProduct)
router.post('/', authMiddleware, adminOnly, createProduct)
router.put('/:id', authMiddleware, adminOnly, updateProduct)
router.delete('/:id', authMiddleware, adminOnly, deleteProduct)

export default router
