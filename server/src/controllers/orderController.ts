import { Response } from 'express'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AuthRequest } from '../middleware/auth.js'

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body
    const cart = await Cart.findOne({ userId: req.user!._id }).populate('items.productId')
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
      return
    }

    const selectedItems = cart.items.filter((item) => item.selected)
    if (selectedItems.length === 0) {
      res.status(400).json({ message: 'No items selected for checkout' })
      return
    }

    const orderItems = []
    for (const item of selectedItems) {
      const product = item.productId as unknown as {
        _id: string
        title: string
        image: string
        discountedPrice: number
        stock: number
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ message: `Insufficient stock for ${product.title}` })
        return
      }
      orderItems.push({
        productId: product._id,
        title: product.title,
        image: product.image,
        quantity: item.quantity,
        price: product.discountedPrice,
      })
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = subtotal >= 500 ? 0 : 40
    const totalAmount = subtotal + shippingFee

    const order = await Order.create({
      userId: req.user!._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      shippingFee,
    })

    for (const item of selectedItems) {
      const product = item.productId as unknown as { _id: string; stock: number; soldCount: number }
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      })
    }

    cart.items = []
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user!._id })
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderStatus } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true })
    if (!order) {
      res.status(404).json({ message: 'Order not found' })
      return
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
