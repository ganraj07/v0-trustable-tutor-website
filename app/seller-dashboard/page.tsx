"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Plus, Package, Star, Users, TrendingUp } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { getSellerProducts } from "@/lib/marketplace-data"

export default function SellerDashboard() {
  const { user } = useUser()
  const [sellerProducts, setSellerProducts] = useState<any[]>([])

  useEffect(() => {
    if (user && user.role === "seller") {
      const products = getSellerProducts(user.id)
      setSellerProducts(products)
    }
  }, [user])

  if (!user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="container mx-auto">
          <Card className="border-2 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 font-semibold">Please log in as a seller to access this dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalRevenue = sellerProducts.reduce((sum, p) => sum + p.price * (p.quantity || 0), 0)
  const totalSales = sellerProducts.reduce((sum, p) => sum + (p.quantity || 0), 0)
  const avgRating =
    sellerProducts.length > 0
      ? (sellerProducts.reduce((sum, p) => sum + p.rating, 0) / sellerProducts.length).toFixed(1)
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Seller Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome, {user.name}</p>
            </div>
          </div>
          <Link href="/seller-dashboard/upload-product">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-blue-700">{sellerProducts.length}</p>
                </div>
                <Package className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold text-green-700">{totalSales}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                  <p className="text-3xl font-bold text-purple-700">{avgRating}</p>
                </div>
                <Star className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-100 to-red-100 border-orange-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-orange-700">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <Users className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>Manage and monitor your listed products</CardDescription>
          </CardHeader>
          <CardContent>
            {sellerProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-blue-200">
                    <tr>
                      <th className="text-left py-2 px-4 font-semibold">Product Name</th>
                      <th className="text-left py-2 px-4 font-semibold">Price</th>
                      <th className="text-left py-2 px-4 font-semibold">Stock</th>
                      <th className="text-left py-2 px-4 font-semibold">Rating</th>
                      <th className="text-left py-2 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-blue-50">
                        <td className="py-3 px-4 font-medium">{product.title}</td>
                        <td className="py-3 px-4">₹{product.price}</td>
                        <td className="py-3 px-4">{product.quantity || 0} units</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {product.rating}
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Link href={`/seller-dashboard/edit-product/${product.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No products listed yet.</p>
                <Link href="/seller-dashboard/upload-product">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Add Your First Product</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Link */}
        <div className="mt-8">
          <Link href="/seller-dashboard/settings">
            <Button variant="outline">Manage Seller Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
