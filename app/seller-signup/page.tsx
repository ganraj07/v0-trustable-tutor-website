"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Check } from "lucide-react"
import { useUser } from "@/lib/user-context"

export default function SellerSignup() {
  const { login } = useUser()
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    bio: "",
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = () => {
    const newSeller = {
      id: `seller_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: "seller" as const,
      businessName: formData.businessName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      bio: formData.bio,
      rating: 0,
      totalReviews: 0,
      verified: false,
      bankAccountVerified: false,
    }

    login(newSeller)
    setSuccess(true)

    setTimeout(() => {
      window.location.href = "/seller-dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Become a Seller</h1>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-2 border-green-300 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Check className="h-5 w-5" />
                Account created successfully! Redirecting to dashboard...
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>
              Step {step} of 2: {step === 1 ? "Personal Information" : "Business Details"}
            </CardTitle>
            <CardDescription>
              {step === 1 ? "Enter your personal details" : "Tell us about your business"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (step === 1) {
                  setStep(2)
                } else {
                  handleSubmit()
                }
              }}
              className="space-y-4"
            >
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
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
                      placeholder="+91 9XXXXXXXXX"
                      required
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <Input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your business name"
                      required
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
                      placeholder="Street address"
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
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
                        placeholder="State"
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <Input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="Pincode"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your business..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-6">
                {step === 2 && (
                  <Button onClick={() => setStep(1)} variant="outline">
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {step === 1 ? "Next Step" : "Create Seller Account"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
