"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Check } from "lucide-react"
import { useUser } from "@/lib/user-context"

export default function SellerSettings() {
  const { user, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    businessName: user && user.role === "seller" ? user.businessName : "",
    phone: user && user.role === "seller" ? user.phone : "",
    address: user && user.role === "seller" ? user.address : "",
    city: user && user.role === "seller" ? user.city : "",
    state: user && user.role === "seller" ? user.state : "",
    pincode: user && user.role === "seller" ? user.pincode : "",
    bio: user && user.role === "seller" ? user.bio : "",
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = () => {
    if (user && user.role === "seller") {
      const updatedUser = {
        ...user,
        ...formData,
      }
      setUser(updatedUser)
      setSaved(true)
      setIsEditing(false)
      setTimeout(() => setSaved(false), 3000)
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Seller Settings</h1>
        </div>

        {/* Success Message */}
        {saved && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Check className="h-5 w-5" />
                Settings saved successfully!
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Settings */}
        <Card className="border-2 border-blue-200 mb-6">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <Input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                  <Input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="flex gap-4 pt-6">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    Edit Settings
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Your account verification details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Account Verified</span>
                <span className={`text-sm font-semibold ${user.verified ? "text-green-600" : "text-orange-600"}`}>
                  {user.verified ? "Yes" : "Pending"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Bank Account Verified</span>
                <span
                  className={`text-sm font-semibold ${user.bankAccountVerified ? "text-green-600" : "text-orange-600"}`}
                >
                  {user.bankAccountVerified ? "Yes" : "Pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
