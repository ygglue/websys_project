import { Response } from 'express'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AuthRequest } from '../middleware/auth.js'

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user!._id }).populate('items.productId')
    res.json(cart || { userId: req.user!._id, items: [], totalPrice: 0, totalItems: 0 })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    if (product.stock < 1) {
      res.status(400).json({ message: 'Out of stock' })
      return
    }

    let cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      cart = new Cart({ userId: req.user!._id, items: [] })
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    )
    if (existingItem) {
      existingItem.quantity += quantity
      if (existingItem.quantity > product.stock) {
        existingItem.quantity = product.stock
      }
    } else {
      cart.items.push({ productId, quantity, selected: true })
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
    const populated = await cart.populate('items.productId')
    cart.totalPrice = populated.items.reduce((sum, item) => {
      const p = item.productId as unknown as { discountedPrice: number }
      return sum + (item.selected ? p.discountedPrice * item.quantity : 0)
    }, 0)

    await cart.save()
    const result = await Cart.findById(cart._id).populate('items.productId')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body
    const cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === req.params.productId
    )
    if (!item) {
      res.status(404).json({ message: 'Item not in cart' })
      return
    }

    if (quantity < 1) {
      res.status(400).json({ message: 'Quantity must be at least 1' })
      return
    }

    item.quantity = quantity
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0)
    const populated = await cart.populate('items.productId')
    cart.totalPrice = populated.items.reduce((sum, i) => {
      const p = i.productId as unknown as { discountedPrice: number }
      return sum + (i.selected ? p.discountedPrice * i.quantity : 0)
    }, 0)

    await cart.save()
    const result = await Cart.findById(cart._id).populate('items.productId')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    )
    cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0)
    const populated = await cart.populate('items.productId')
    cart.totalPrice = populated.items.reduce((sum, i) => {
      const p = i.productId as unknown as { discountedPrice: number }
      return sum + (i.selected ? p.discountedPrice * i.quantity : 0)
    }, 0)

    await cart.save()
    const result = await Cart.findById(cart._id).populate('items.productId')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const toggleSelectItem = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === req.params.productId
    )
    if (!item) {
      res.status(404).json({ message: 'Item not in cart' })
      return
    }

    item.selected = !item.selected
    const populated = await cart.populate('items.productId')
    cart.totalPrice = populated.items.reduce((sum, i) => {
      const p = i.productId as unknown as { discountedPrice: number }
      return sum + (i.selected ? p.discountedPrice * i.quantity : 0)
    }, 0)

    await cart.save()
    const result = await Cart.findById(cart._id).populate('items.productId')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const toggleSelectAll = async (req: AuthRequest, res: Response) => {
  try {
    const { selected } = req.body
    const cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    cart.items.forEach((item) => (item.selected = selected))
    const populated = await cart.populate('items.productId')
    cart.totalPrice = populated.items.reduce((sum, i) => {
      const p = i.productId as unknown as { discountedPrice: number }
      return sum + (i.selected ? p.discountedPrice * i.quantity : 0)
    }, 0)

    await cart.save()
    const result = await Cart.findById(cart._id).populate('items.productId')
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ userId: req.user!._id })
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' })
      return
    }

    cart.items = []
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
