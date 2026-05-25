import { Router } from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  toggleSelectItem,
  toggleSelectAll,
  clearCart,
} from '../controllers/cartController.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)
router.get('/', getCart)
router.post('/add', addToCart)
router.put('/update/:productId', updateCartItem)
router.delete('/remove/:productId', removeCartItem)
router.put('/select/:productId', toggleSelectItem)
router.put('/select-all', toggleSelectAll)
router.delete('/clear', clearCart)

export default router
