"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronLeft, MapPin, Phone, Mail, Globe, Star } from "lucide-react"
import { INDIAN_STATES, REGIONS, NGOS, getNGOsByState, getNGOsByRegion, searchNGOs } from "@/lib/ngo-data"

export default function NGODirectory() {
  const [selectedState, setSelectedState] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNGOs, setFilteredNGOs] = useState(NGOS)

  const currentRegions = selectedState ? REGIONS[selectedState] || [] : []

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedRegion("")
    updateFilters(state, "", searchQuery)
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    updateFilters(selectedState, region, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setFilteredNGOs(searchNGOs(query))
    } else {
      updateFilters(selectedState, selectedRegion, "")
    }
  }

  const updateFilters = (state: string, region: string, query: string) => {
    let results = NGOS

    if (state && region) {
      results = getNGOsByRegion(state, region)
    } else if (state) {
      results = getNGOsByState(state)
    }

    if (query.trim()) {
      results = results.filter(
        (ngo) =>
          ngo.name.toLowerCase().includes(query.toLowerCase()) || ngo.city.toLowerCase().includes(query.toLowerCase()),
      )
    }

    setFilteredNGOs(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/student">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">NGO Directory</h1>
            <p className="text-gray-600 mt-2">Connect with NGOs across India supporting students with disabilities</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl">Find NGOs Near You</CardTitle>
            <CardDescription>Filter by state, region, or search by name</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select State" />
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

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={!selectedState}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={selectedState ? "Select Region" : "Select State first"} />
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

              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search NGOs</label>
                <Input
                  placeholder="Search by name or city..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-medium">
            Found {filteredNGOs.length} NGO{filteredNGOs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* NGO List */}
        {filteredNGOs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo.id} className="hover:shadow-lg transition-shadow border-2 border-blue-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{ngo.name}</CardTitle>
                      <CardDescription className="text-blue-50">
                        {ngo.city}, {ngo.state}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{ngo.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Description */}
                  <p className="text-gray-600 mb-4 text-sm">{ngo.description}</p>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ngo.servicesOffered.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {service}
                        </span>
                      ))}
                      {ngo.servicesOffered.length > 3 && (
                        <span className="text-gray-500 text-xs">+{ngo.servicesOffered.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-xs">{ngo.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <a href={`tel:${ngo.phone}`} className="hover:text-blue-600 text-xs">
                        {ngo.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <a href={`mailto:${ngo.email}`} className="hover:text-blue-600 text-xs">
                        {ngo.email}
                      </a>
                    </div>
                    {ngo.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Globe className="h-4 w-4 text-blue-500" />
                        <a
                          href={ngo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 text-xs"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Contact Button */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get in Touch</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No NGOs Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </Card>
        )}
      </div>
    </div>
  )
}
