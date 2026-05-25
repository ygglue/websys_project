import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import User from './models/User.js'

dotenv.config()

const products = [
  // Fruits & Vegetables
  { title: 'Bananas', description: 'Fresh, sweet, and perfectly ripe organic bananas. Packed with energy and potassium.', category: 'Fruits & Vegetables', image: 'https://picsum.photos/seed/bananas/400/400', stock: 50, soldCount: 120, ratings: 4.8, originalPrice: 100, discountedPrice: 80, discountPercent: 20 },
  { title: 'Apples', description: 'Crisp, sweet, and premium quality red apples. Freshly picked from local orchards.', category: 'Fruits & Vegetables', image: 'https://picsum.photos/seed/apples/400/400', stock: 60, soldCount: 210, ratings: 4.6, originalPrice: 150, discountedPrice: 120, discountPercent: 20 },
  { title: 'Carrots', description: 'Fresh and crunchy organic carrots, loaded with nutrients and vitamins.', category: 'Fruits & Vegetables', image: 'https://picsum.photos/seed/carrots/400/400', stock: 40, soldCount: 95, ratings: 4.5, originalPrice: 90, discountedPrice: 90, discountPercent: 0 },
  { title: 'Tomatoes', description: 'Plump, juicy, and farm-fresh red tomatoes. Perfect for salads and cooking.', category: 'Fruits & Vegetables', image: 'https://picsum.photos/seed/tomatoes/400/400', stock: 45, soldCount: 150, ratings: 4.4, originalPrice: 85, discountedPrice: 70, discountPercent: 18 },

  // Dairy Products
  { title: 'Fresh Milk', description: '100% pure pasteurized fresh cow milk. Rich, creamy, and wholesome (1 Liter).', category: 'Dairy Products', image: 'https://picsum.photos/seed/freshmilk/400/400', stock: 30, soldCount: 185, ratings: 4.9, originalPrice: 160, discountedPrice: 140, discountPercent: 13 },
  { title: 'Cheddar Cheese', description: 'Premium block of sharp cheddar cheese. Melts beautifully and tastes rich.', category: 'Dairy Products', image: 'https://picsum.photos/seed/cheddarcheese/400/400', stock: 25, soldCount: 130, ratings: 4.7, originalPrice: 220, discountedPrice: 190, discountPercent: 14 },
  { title: 'Butter', description: 'Creamy salted butter made from fresh dairy cream. Perfect for baking or spreading.', category: 'Dairy Products', image: 'https://picsum.photos/seed/butter/400/400', stock: 35, soldCount: 140, ratings: 4.8, originalPrice: 150, discountedPrice: 130, discountPercent: 13 },
  { title: 'Yogurt', description: 'Silky smooth Greek-style strawberry yogurt. Creamy, delicious, and probiotic-rich.', category: 'Dairy Products', image: 'https://picsum.photos/seed/yogurt/400/400', stock: 40, soldCount: 165, ratings: 4.6, originalPrice: 70, discountedPrice: 60, discountPercent: 14 },

  // Snacks
  { title: 'Potato Chips', description: 'Thinly sliced crispy potato chips with a classic sea salt seasoning.', category: 'Snacks', image: 'https://picsum.photos/seed/potatochips/400/400', stock: 100, soldCount: 340, ratings: 4.7, originalPrice: 99, discountedPrice: 85, discountPercent: 14 },
  { title: 'Chocolate Cookies', description: 'Decadent cookies loaded with premium dark chocolate chips and baked to perfection.', category: 'Snacks', image: 'https://picsum.photos/seed/chocolatecookies/400/400', stock: 80, soldCount: 220, ratings: 4.8, originalPrice: 120, discountedPrice: 99, discountPercent: 18 },
  { title: 'Popcorn', description: 'Crispy and fluffy microwave popcorn with a rich, movie-theater butter flavor.', category: 'Snacks', image: 'https://picsum.photos/seed/popcorn/400/400', stock: 90, soldCount: 150, ratings: 4.5, originalPrice: 80, discountedPrice: 80, discountPercent: 0 },
  { title: 'Pretzels', description: 'Classic oven-baked salted pretzel twists. A crunchy and satisfying low-fat snack.', category: 'Snacks', image: 'https://picsum.photos/seed/pretzels/400/400', stock: 75, soldCount: 110, ratings: 4.3, originalPrice: 90, discountedPrice: 75, discountPercent: 17 },

  // Beverages
  { title: 'Orange Juice', description: '100% pure squeezed orange juice. Naturally sweet and packed with Vitamin C.', category: 'Beverages', image: 'https://picsum.photos/seed/orangejuice/400/400', stock: 40, soldCount: 200, ratings: 4.8, originalPrice: 140, discountedPrice: 120, discountPercent: 14 },
  { title: 'Bottled Water', description: 'Clean, crisp, and refreshing purified drinking water (500ml).', category: 'Beverages', image: 'https://picsum.photos/seed/bottledwater/400/400', stock: 200, soldCount: 850, ratings: 4.9, originalPrice: 20, discountedPrice: 20, discountPercent: 0 },
  { title: 'Soft Drink Cola', description: 'A refreshing, ice-cold carbonated cola soft drink with classic flavor.', category: 'Beverages', image: 'https://picsum.photos/seed/softdrinkcola/400/400', stock: 150, soldCount: 620, ratings: 4.6, originalPrice: 50, discountedPrice: 45, discountPercent: 10 },
  { title: 'Iced Tea', description: 'Refreshingly sweet and zesty lemon-flavored brewed black iced tea.', category: 'Beverages', image: 'https://picsum.photos/seed/icedtea/400/400', stock: 120, soldCount: 410, ratings: 4.5, originalPrice: 60, discountedPrice: 50, discountPercent: 17 },

  // Household Essentials
  { title: 'Dishwashing Liquid', description: 'Ultra-concentrated dishwashing liquid with a fresh lemon scent. Cuts through grease instantly.', category: 'Household Essentials', image: 'https://picsum.photos/seed/dishwashingliquid/400/400', stock: 50, soldCount: 180, ratings: 4.6, originalPrice: 95, discountedPrice: 85, discountPercent: 11 },
  { title: 'Laundry Detergent', description: 'Powerful liquid laundry detergent that removes tough stains while protecting colors.', category: 'Household Essentials', image: 'https://picsum.photos/seed/laundrydetergent/400/400', stock: 40, soldCount: 140, ratings: 4.8, originalPrice: 250, discountedPrice: 210, discountPercent: 16 },
  { title: 'Tissue Rolls', description: 'Soft, strong, and highly absorbent 2-ply toilet tissue rolls. Pack of 12.', category: 'Household Essentials', image: 'https://picsum.photos/seed/tissuerolls/400/400', stock: 30, soldCount: 165, ratings: 4.7, originalPrice: 180, discountedPrice: 150, discountPercent: 17 },
  { title: 'Trash Bags', description: 'Strong, tear-resistant black garbage bags with convenient tie strings. 20 bags.', category: 'Household Essentials', image: 'https://picsum.photos/seed/trashbags/400/400', stock: 65, soldCount: 230, ratings: 4.6, originalPrice: 110, discountedPrice: 95, discountPercent: 14 },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('Connected to MongoDB')

    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log(`Seeded ${products.length} products`)

    const adminExists = await User.findOne({ email: 'admin@example.com' })
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin' })
      console.log('Created admin user (admin@example.com / admin123)')
    }

    await mongoose.disconnect()
    console.log('Done')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
