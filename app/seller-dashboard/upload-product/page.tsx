"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { PRODUCT_CATEGORIES, addProduct, type Product, type ProductCategory } from "@/lib/marketplace-data"

export default function UploadProduct() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "mobility_aids" as ProductCategory,
    price: 0,
    quantity: 1,
    condition: "new" as "new" | "like-new" | "good" | "fair",
    tags: "",
  })
  const [success, setSuccess] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || user.role !== "seller") {
      alert("You must be logged in as a seller to upload products")
      return
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      seller: {
        id: user.id,
        name: user.name,
        rating: 4.5,
        reviews: 0,
      },
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      inStock: formData.quantity > 0,
      quantity: formData.quantity,
      reviews: 0,
      rating: 0,
      createdAt: new Date(),
      condition: formData.condition,
    }

    addProduct(newProduct)
    setSuccess(true)

    setTimeout(() => {
      window.location.href = "/seller-dashboard"
    }, 2000)
  }

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto">
          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-semibold">Please log in as a seller to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller-dashboard">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Upload Product</h1>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-700 font-semibold">Product uploaded successfully! Redirecting...</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Fill in all the details for your product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Title</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Wheelchair - Manual Standard"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(PRODUCT_CATEGORIES).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <Input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="E.g., lightweight, foldable, adjustable"
                  className="w-full"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Upload Product
                </Button>
                <Link href="/seller-dashboard" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
