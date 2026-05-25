import mongoose from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  title: string
  image: string
  quantity: number
  price: number
}

export interface IOrder extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  items: IOrderItem[]
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: string
  totalAmount: number
  shippingFee: number
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  createdAt: Date
}

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        image: { type: String, default: '' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, default: 'Cash on Delivery' },
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>('Order', orderSchema)
