import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  title: string
  description: string
  category: string
  image: string
  stock: number
  soldCount: number
  ratings: number
  originalPrice: number
  discountedPrice: number
  discountPercent: number
  createdAt: Date
}

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0 },
    soldCount: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    originalPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<IProduct>('Product', productSchema)
