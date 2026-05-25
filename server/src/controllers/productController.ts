import { Request, Response } from 'express'
import Product from '../models/Product.js'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, page = '1', limit = '12' } = req.query
    const query: Record<string, any> = {}

    if (search) query.title = { $regex: search, $options: 'i' }
    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.discountedPrice = {}
      if (minPrice) query.discountedPrice.$gte = Number(minPrice)
      if (maxPrice) query.discountedPrice.$lte = Number(maxPrice)
    }

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ])

    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category')
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json({ message: 'Product removed' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}
