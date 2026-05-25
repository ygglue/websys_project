import mongoose from 'mongoose'

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  quantity: number
  selected: boolean
}

export interface ICart extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  items: ICartItem[]
  totalPrice: number
  totalItems: number
  createdAt: Date
}

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        selected: { type: Boolean, default: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model<ICart>('Cart', cartSchema)
