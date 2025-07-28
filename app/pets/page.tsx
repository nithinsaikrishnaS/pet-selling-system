"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SkeletonCard } from "@/components/skeleton-card"
import {
  SearchIcon,
  FilterIcon,
  PawPrintIcon,
  MapPinIcon,
  HeartIcon,
  EyeIcon,
  DollarSignIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  gender: string
  age_years: number
  age_months: number
  price: number
  description: string
  image_url?: string
  is_vaccinated: boolean
  is_neutered: boolean
  created_at: string
  seller_id: string
}

interface Profile {
  id: string
  full_name?: string
  location?: string
}

const fallbackPets = [
  {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Male",
    age_years: 2,
    age_months: 6,
    price: 850,
    description: "Friendly and energetic Golden Retriever looking for a loving home.",
    image_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
    is_neutered: false,
    created_at: "2024-01-15T10:00:00Z",
    seller_id: "seller1",
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Siamese",
    gender: "Female",
    age_years: 1,
    age_months: 8,
    price: 400,
    description: "Beautiful Siamese cat with striking blue eyes.",
    image_url:
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
    is_neutered: true,
    created_at: "2024-01-18T14:30:00Z",
    seller_id: "seller2",
  },
  {
    id: "3",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    gender: "Male",
    age_years: 0,
    age_months: 8,
    price: 650,
    description: "Playful Beagle puppy, great with children.",
    image_url:
      "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
    is_neutered: false,
    created_at: "2024-01-20T09:15:00Z",
    seller_id: "seller3",
  },
  {
    id: "4",
    name: "Polly",
    species: "Bird",
    breed: "Macaw",
    gender: "Female",
    age_years: 3,
    age_months: 0,
    price: 1200,
    description: "Colorful Macaw parrot, very social and intelligent.",
    image_url:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: false,
    is_neutered: false,
    created_at: "2024-01-22T16:45:00Z",
    seller_id: "seller4",
  },
]

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("All Species")
  const [selectedGender, setSelectedGender] = useState("All Genders")
  const [priceRange, setPriceRange] = useState("All Prices")
  const [sortBy, setSortBy] = useState("newest")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const supabase = createClient()

  useEffect(() => {
    fetchPets()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [pets, searchTerm, selectedSpecies, selectedGender, priceRange, sortBy])

  const fetchPets = async () => {
    try {
      setLoading(true)

      // Fetch pets with basic query
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: false })

      if (petsError) {
        console.error("Error fetching pets:", petsError)
        setPets(fallbackPets)
        setFilteredPets(fallbackPets)
        return
      }

      if (petsData && petsData.length > 0) {
        setPets(petsData)

        // Fetch seller profiles separately
        const sellerIds = [...new Set(petsData.map((pet) => pet.seller_id))]
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, location")
          .in("id", sellerIds)

        if (profilesData) {
          const profilesMap = profilesData.reduce(
            (acc, profile) => {
              acc[profile.id] = profile
              return acc
            },
            {} as Record<string, Profile>,
          )
          setProfiles(profilesMap)
        }
      } else {
        setPets(fallbackPets)
      }
    } catch (error) {
      console.error("Error in fetchPets:", error)
      setPets(fallbackPets)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...pets]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.species.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Species filter
    if (selectedSpecies !== "All Species") {
      filtered = filtered.filter((pet) => pet.species === selectedSpecies)
    }

    // Gender filter
    if (selectedGender !== "All Genders") {
      filtered = filtered.filter((pet) => pet.gender === selectedGender)
    }

    // Price range filter
    if (priceRange !== "All Prices") {
      filtered = filtered.filter((pet) => {
        switch (priceRange) {
          case "0-500":
            return pet.price <= 500
          case "500-1000":
            return pet.price > 500 && pet.price <= 1000
          case "1000+":
            return pet.price > 1000
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredPets(filtered)
  }

  const toggleFavorite = (petId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(petId)) {
      newFavorites.delete(petId)
    } else {
      newFavorites.add(petId)
    }
    setFavorites(newFavorites)
  }

  const formatAge = (years: number, months: number) => {
    if (years === 0 && months === 0) return "Age not specified"
    if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`
    if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`
    return `${years}y ${months}m`
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedSpecies("All Species")
    setSelectedGender("All Genders")
    setPriceRange("All Prices")
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/10 pt-20 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-paw-brown/10 rounded-full">
              <PawPrintIcon className="h-16 w-16 text-paw-brown" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4 text-dark-nose-black">
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-fur-gray max-w-2xl mx-auto">
            Browse through our collection of loving pets looking for their forever homes
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fur-gray h-5 w-5" />
                <Input
                  placeholder="Search by name, breed, or species..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                  <SelectTrigger className="w-32 rounded-xl border-2 border-fur-gray/20">
                    <SelectValue placeholder="Species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Species">All Species</SelectItem>
                    <SelectItem value="Dog">Dogs</SelectItem>
                    <SelectItem value="Cat">Cats</SelectItem>
                    <SelectItem value="Bird">Birds</SelectItem>
                    <SelectItem value="Rabbit">Rabbits</SelectItem>
                    <SelectItem value="Fish">Fish</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-32 rounded-xl border-2 border-fur-gray/20">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Genders">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="w-32 rounded-xl border-2 border-fur-gray/20">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Prices">All Prices</SelectItem>
                    <SelectItem value="0-500">$0 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1000</SelectItem>
                    <SelectItem value="1000+">$1000+</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 rounded-xl border-2 border-fur-gray/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="rounded-xl border-2 border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white bg-transparent"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-fur-gray">
            {loading ? "Loading..." : `${filteredPets.length} pet${filteredPets.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <Card
                key={pet.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 group"
              >
                <div className="relative">
                  <img
                    src={pet.image_url || "/placeholder.svg?height=250&width=400&text=Pet+Image"}
                    alt={`${pet.name} - ${pet.breed || pet.species}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <button
                    onClick={() => toggleFavorite(pet.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      favorites.has(pet.id)
                        ? "bg-soft-pink-nose text-cream-white"
                        : "bg-white/90 text-fur-gray hover:bg-white hover:text-soft-pink-nose"
                    }`}
                  >
                    <HeartIcon className={`h-5 w-5 ${favorites.has(pet.id) ? "fill-current" : ""}`} />
                  </button>

                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-paw-brown text-cream-white rounded-full px-3 py-1 text-xs font-semibold">
                      {pet.species}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-poppins font-bold text-dark-nose-black group-hover:text-paw-brown transition-colors">
                      {pet.name}
                    </h3>
                    <Badge className="bg-sky-blue-collar text-cream-white rounded-full px-2 py-1 text-xs">
                      {pet.gender}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {pet.breed && (
                      <p className="text-sm text-fur-gray">
                        <span className="font-semibold">Breed:</span> {pet.breed}
                      </p>
                    )}
                    <p className="text-sm text-fur-gray">
                      <span className="font-semibold">Age:</span> {formatAge(pet.age_years, pet.age_months)}
                    </p>
                    {profiles[pet.seller_id]?.location && (
                      <p className="text-sm text-fur-gray flex items-center gap-1">
                        <MapPinIcon className="h-3 w-3" />
                        {profiles[pet.seller_id].location}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {pet.is_vaccinated && (
                      <Badge className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                        <CheckCircleIcon className="h-3 w-3" />
                        Vaccinated
                      </Badge>
                    )}
                    {pet.is_neutered && (
                      <Badge className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                        <CheckCircleIcon className="h-3 w-3" />
                        Neutered
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-fur-gray mb-4 line-clamp-2">{pet.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-2xl font-poppins font-bold text-paw-brown">
                      <DollarSignIcon className="h-5 w-5" />
                      {pet.price.toLocaleString()}
                    </div>
                    <Button asChild className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-lg">
                      <Link href={`/pets/${pet.id}`}>View Details</Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-fur-gray/20">
                    <p className="text-xs text-fur-gray flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(pet.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-fur-gray flex items-center gap-1">
                      <EyeIcon className="h-3 w-3" />
                      {Math.floor(Math.random() * 100) + 10} views
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-6 bg-fur-gray/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <SearchIcon className="h-12 w-12 text-fur-gray" />
            </div>
            <h3 className="text-2xl font-poppins font-bold text-dark-nose-black mb-4">No pets found</h3>
            <p className="text-fur-gray mb-6 max-w-md mx-auto">
              We couldn't find any pets matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-lg">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
