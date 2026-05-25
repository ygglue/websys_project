import { Router } from 'express'
import {
  checkout,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import authMiddleware, { adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(authMiddleware)
router.post('/', checkout)
router.get('/', getOrders)
router.get('/all', adminOnly, getAllOrders)
router.get('/:id', getOrder)
router.put('/:id/status', adminOnly, updateOrderStatus)

export default router
