// Marketplace database for disability-related products
export type ProductCategory =
  | "mobility_aids"
  | "visual_aids"
  | "hearing_aids"
  | "communication_devices"
  | "adaptive_furniture"
  | "educational_tools"
  | "sensory_equipment"
  | "daily_living_aids"

export type UserType = "buyer" | "seller"

export interface Product {
  id: string
  title: string
  description: string
  category: ProductCategory
  price: number
  image?: string
  seller: {
    id: string
    name: string
    rating: number
    reviews: number
  }
  tags: string[]
  inStock: boolean
  quantity?: number
  reviews: number
  rating: number
  createdAt: Date
  condition?: "new" | "like-new" | "good" | "fair"
}

export interface Seller {
  id: string
  name: string
  email: string
  phone: string
  address: string
  rating: number
  totalReviews: number
  productsListed: number
  bio: string
  verified: boolean
}

export interface SellerInventory {
  sellerId: string
  products: Product[]
}

export const PRODUCT_CATEGORIES = {
  mobility_aids: "Mobility Aids",
  visual_aids: "Visual Aids",
  hearing_aids: "Hearing Aids",
  communication_devices: "Communication Devices",
  adaptive_furniture: "Adaptive Furniture",
  educational_tools: "Educational Tools",
  sensory_equipment: "Sensory Equipment",
  daily_living_aids: "Daily Living Aids",
}

export const MARKETPLACE_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    title: "Wheelchair - Manual Standard",
    description: "High-quality manual wheelchair suitable for indoor and outdoor use",
    category: "mobility_aids",
    price: 8500,
    seller: {
      id: "seller_001",
      name: "Mobility Solutions India",
      rating: 4.7,
      reviews: 156,
    },
    tags: ["lightweight", "foldable", "adjustable"],
    inStock: true,
    quantity: 5,
    reviews: 156,
    rating: 4.7,
    createdAt: new Date("2024-01-15"),
    condition: "new",
  },
  {
    id: "prod_002",
    title: "Braille Display Device",
    description: "40-character refreshable braille display for computer access",
    category: "visual_aids",
    price: 45000,
    seller: {
      id: "seller_002",
      name: "Tech for Vision",
      rating: 4.9,
      reviews: 89,
    },
    tags: ["technology", "braille", "usb-compatible"],
    inStock: true,
    quantity: 2,
    reviews: 89,
    rating: 4.9,
    createdAt: new Date("2024-01-10"),
    condition: "new",
  },
  {
    id: "prod_003",
    title: "Digital Hearing Aid",
    description: "Advanced programmable hearing aid with wireless connectivity",
    category: "hearing_aids",
    price: 28000,
    seller: {
      id: "seller_003",
      name: "Hear Well Clinic",
      rating: 4.8,
      reviews: 234,
    },
    tags: ["digital", "wireless", "adjustable"],
    inStock: true,
    quantity: 8,
    reviews: 234,
    rating: 4.8,
    createdAt: new Date("2024-01-12"),
    condition: "new",
  },
  {
    id: "prod_004",
    title: "AAC Communication Board",
    description: "Augmentative and Alternative Communication device for speech disabled",
    category: "communication_devices",
    price: 15000,
    seller: {
      id: "seller_004",
      name: "Speech Therapy Plus",
      rating: 4.6,
      reviews: 125,
    },
    tags: ["communication", "portable", "customizable"],
    inStock: true,
    quantity: 4,
    reviews: 125,
    rating: 4.6,
    createdAt: new Date("2024-01-08"),
    condition: "new",
  },
  {
    id: "prod_005",
    title: "Adjustable Study Desk",
    description: "Height-adjustable desk perfect for students with mobility issues",
    category: "adaptive_furniture",
    price: 12000,
    seller: {
      id: "seller_005",
      name: "Ergonomic Living",
      rating: 4.7,
      reviews: 98,
    },
    tags: ["adjustable", "ergonomic", "study"],
    inStock: true,
    quantity: 3,
    reviews: 98,
    rating: 4.7,
    createdAt: new Date("2024-01-14"),
    condition: "new",
  },
  {
    id: "prod_006",
    title: "Educational Tactile Set",
    description: "Complete set of tactile learning materials for blind students",
    category: "educational_tools",
    price: 6500,
    seller: {
      id: "seller_006",
      name: "Learn Inclusive",
      rating: 4.5,
      reviews: 67,
    },
    tags: ["education", "tactile", "inclusive"],
    inStock: true,
    quantity: 10,
    reviews: 67,
    rating: 4.5,
    createdAt: new Date("2024-01-11"),
    condition: "new",
  },
  {
    id: "prod_007",
    title: "Fidget Sensory Kit",
    description: "Multi-sensory fidget kit for autism and ADHD students",
    category: "sensory_equipment",
    price: 2500,
    seller: {
      id: "seller_007",
      name: "Sensory Minds",
      rating: 4.8,
      reviews: 456,
    },
    tags: ["sensory", "autism-friendly", "fidget"],
    inStock: true,
    quantity: 25,
    reviews: 456,
    rating: 4.8,
    createdAt: new Date("2024-01-13"),
    condition: "new",
  },
  {
    id: "prod_008",
    title: "One-Handed Kitchen Tools Set",
    description: "Set of adaptive kitchen tools for individuals with single hand mobility",
    category: "daily_living_aids",
    price: 4500,
    seller: {
      id: "seller_008",
      name: "Daily Care Solutions",
      rating: 4.6,
      reviews: 143,
    },
    tags: ["daily-living", "adaptive", "kitchen"],
    inStock: true,
    quantity: 6,
    reviews: 143,
    rating: 4.6,
    createdAt: new Date("2024-01-09"),
    condition: "new",
  },
]

export function getProductsByCategory(category: ProductCategory): Product[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return MARKETPLACE_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

export function getInStockProducts(): Product[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.inStock)
}

export function getSellerProducts(sellerId: string): Product[] {
  return MARKETPLACE_PRODUCTS.filter((p) => p.seller.id === sellerId)
}

export function addProduct(product: Product): void {
  MARKETPLACE_PRODUCTS.push(product)
}

export function updateProduct(productId: string, updates: Partial<Product>): void {
  const index = MARKETPLACE_PRODUCTS.findIndex((p) => p.id === productId)
  if (index > -1) {
    MARKETPLACE_PRODUCTS[index] = { ...MARKETPLACE_PRODUCTS[index], ...updates }
  }
}

export function deleteProduct(productId: string): void {
  const index = MARKETPLACE_PRODUCTS.findIndex((p) => p.id === productId)
  if (index > -1) {
    MARKETPLACE_PRODUCTS.splice(index, 1)
  }
}
