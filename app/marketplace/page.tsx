"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ShoppingCart, Star, TrendingUp } from "lucide-react"
import { PRODUCT_CATEGORIES, MARKETPLACE_PRODUCTS, getProductsByCategory, searchProducts } from "@/lib/marketplace-data"

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(MARKETPLACE_PRODUCTS)
  const [cart, setCart] = useState<string[]>([])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "all") {
      setFilteredProducts(MARKETPLACE_PRODUCTS)
    } else {
      setFilteredProducts(getProductsByCategory(category as any))
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setFilteredProducts(searchProducts(query))
    } else {
      if (selectedCategory && selectedCategory !== "all") {
        setFilteredProducts(getProductsByCategory(selectedCategory as any))
      } else {
        setFilteredProducts(MARKETPLACE_PRODUCTS)
      }
    }
  }

  const addToCart = (productId: string) => {
    setCart([...cart, productId])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Accessibility Marketplace</h1>
              <p className="text-gray-600 mt-2">Buy and sell disability-related products and services</p>
            </div>
          </div>
          <div className="relative">
            <Button className="bg-green-600 hover:bg-green-700 text-white relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl">Find Products</CardTitle>
            <CardDescription>Browse by category or search for specific items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(PRODUCT_CATEGORIES).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <Input
                  placeholder="Search by product name or tag..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-green-700">{filteredProducts.length}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">In Stock</p>
                  <p className="text-3xl font-bold text-blue-700">{filteredProducts.filter((p) => p.inStock).length}</p>
                </div>
                <ShoppingCart className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Cart Items</p>
                  <p className="text-3xl font-bold text-purple-700">{cart.length}</p>
                </div>
                <ShoppingCart className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow border-2 border-green-100 overflow-hidden"
              >
                {/* Product Image Placeholder */}
                <div className="bg-gradient-to-br from-green-200 to-emerald-300 h-48 flex items-center justify-center">
                  <ShoppingCart className="h-20 w-20 text-green-700 opacity-50" />
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{PRODUCT_CATEGORIES[product.category]}</CardDescription>
                    </div>
                    {product.inStock && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">In Stock</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating & Seller */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Seller */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{product.seller.name}</span>
                    </p>
                    <p className="text-xs text-gray-500">{product.seller.reviews} reviews</p>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-green-700">₹{product.price}</p>
                      {product.condition && <p className="text-xs text-gray-500 capitalize">{product.condition}</p>}
                    </div>
                    <Button
                      onClick={() => addToCart(product.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter</p>
          </Card>
        )}
      </div>
    </div>
  )
}
