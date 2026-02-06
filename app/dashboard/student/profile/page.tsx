"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/user-context"
import { INDIAN_STATES, REGIONS } from "@/lib/ngo-data"
import { ChevronLeft } from "lucide-react"

const INDIAN_STUDENT_NAMES = [
  "Arjun Kumar",
  "Anaya Singh",
  "Rohan Patel",
  "Priya Sharma",
  "Vikram Reddy",
  "Neha Gupta",
  "Aditya Verma",
  "Sakshi Joshi",
  "Raj Kumar",
  "Diya Desai",
  "Karan Nair",
  "Meera Iyer",
  "Ashok Malhotra",
  "Sneha Kapoor",
  "Sanjay Singh",
  "Pooja Deshmukh",
  "Amit Bansal",
  "Kavya Menon",
  "Ravi Kumar",
  "Anjali Sharma",
]

export default function StudentProfile() {
  const router = useRouter()
  const { user, updateAccessibilityPreferences } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || 12,
    grade: user?.grade || "5-6",
    originState: "",
    originRegion: "",
    disabilityType: user?.disabilityType || "none",
    language: user?.language || "english",
    religion: user?.religion || "prefer_not_to_say",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const [currentRegions, setCurrentRegions] = useState<string[]>([])

  const handleStateChange = (state: string) => {
    setFormData({ ...formData, originState: state, originRegion: "" })
    setCurrentRegions(REGIONS[state] || [])
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setIsEditing(false)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const disabilityOptions = [
    { value: "none", label: "No Disability" },
    { value: "visual_impairment", label: "Visual Impairment" },
    { value: "hearing_impairment", label: "Hearing Impairment" },
    { value: "motor_disability", label: "Motor Disability" },
    { value: "cognitive_disability", label: "Cognitive Disability" },
    { value: "speech_disorder", label: "Speech Disorder" },
    { value: "autism_spectrum", label: "Autism Spectrum" },
    { value: "dyslexia", label: "Dyslexia" },
    { value: "adhd", label: "ADHD" },
    { value: "multiple", label: "Multiple Disabilities" },
  ]

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "chinese", label: "Chinese" },
    { value: "japanese", label: "Japanese" },
    { value: "korean", label: "Korean" },
    { value: "arabic", label: "Arabic" },
    { value: "portuguese", label: "Portuguese" },
  ]

  const religionOptions = [
    { value: "prefer_not_to_say", label: "Prefer Not to Say" },
    { value: "hinduism", label: "Hinduism" },
    { value: "islam", label: "Islam" },
    { value: "christianity", label: "Christianity" },
    { value: "buddhism", label: "Buddhism" },
    { value: "sikhism", label: "Sikhism" },
    { value: "judaism", label: "Judaism" },
    { value: "other", label: "Other" },
    { value: "none", label: "None" },
  ]

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/student">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{formData.name}</CardTitle>
                <CardDescription className="text-blue-50">{formData.email}</CardDescription>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "outline"}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                      <p className="text-xs text-gray-500 mt-1">Examples: Arjun Kumar, Priya Sharma, Neha Gupta</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <Input
                        type="number"
                        min="5"
                        max="22"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                      <Select
                        value={formData.grade}
                        onValueChange={(value) => setFormData({ ...formData, grade: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}-${i + 2}`}>
                              Grade {i + 1}-{i + 2}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Origin Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Origin & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin</label>
                      <Select value={formData.originState} onValueChange={handleStateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {INDIAN_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region/City</label>
                      <Select
                        value={formData.originRegion}
                        onValueChange={(value) => setFormData({ ...formData, originRegion: value })}
                        disabled={!formData.originState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.originState ? "Select region" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {currentRegions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Accessibility & Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Accessibility & Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Disability Type</label>
                      <Select
                        value={formData.disabilityType}
                        onValueChange={(value) => setFormData({ ...formData, disabilityType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {disabilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Language</label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) => setFormData({ ...formData, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                      <Select
                        value={formData.religion}
                        onValueChange={(value) => setFormData({ ...formData, religion: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {religionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <Input
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        placeholder="Parent/Guardian name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        value={formData.emergencyPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                        placeholder="+91-XXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium text-gray-800">{formData.age} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Grade</p>
                        <p className="font-medium text-gray-800">{formData.grade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Origin Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Origin & Region</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">State of Origin</p>
                        <p className="font-medium text-gray-800">{formData.originState || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Region/City</p>
                        <p className="font-medium text-gray-800">{formData.originRegion || "Not set"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Accessibility Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Accessibility & Preferences</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Disability Type</p>
                        <p className="font-medium text-gray-800">
                          {disabilityOptions.find((d) => d.value === formData.disabilityType)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Learning Language</p>
                        <p className="font-medium text-gray-800">
                          {languageOptions.find((l) => l.value === formData.language)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Religion</p>
                        <p className="font-medium text-gray-800">
                          {religionOptions.find((r) => r.value === formData.religion)?.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Emergency Contact</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Contact Person</p>
                        <p className="font-medium text-gray-800">{formData.emergencyContact || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-800">{formData.emergencyPhone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Helpful Tips Card */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Profile Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Keep your emergency contact information updated for safety</p>
            <p>• Select your state and region to find nearby NGOs and support services</p>
            <p>• Choose your preferred learning language for better accessibility</p>
            <p>• Update your disability type to get personalized accessibility features</p>
            <p>• Your profile helps us provide better educational content and support</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
