"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  CreditCardIcon,
  UserIcon,
  HeartIcon,
  PawPrintIcon,
  CheckCircleIcon,
  MailIcon,
  ShareIcon,
  CalendarIcon,
} from "lucide-react"

// Dummy data for a single pet with realistic Unsplash images
const pet = {
  id: "1",
  name: "Buddy",
  species: "Dog",
  breed: "Golden Retriever",
  gender: "Male",
  vaccinationStatus: "Fully Vaccinated",
  ageYears: 2,
  ageMonths: 6,
  weight: "25 kg",
  temperament: "Friendly, Playful, Loyal, Great with Kids",
  sellerName: "John Doe",
  sellerLocation: "New York, NY",
  sellerContact: "(555) 123-4567",
  sellerEmail: "john.doe@example.com",
  price: "850.00",
  availability: "Available",
  description:
    "Buddy is a loving and energetic Golden Retriever looking for his forever home. He loves to play fetch, go for long walks, and cuddle up on the couch. He is great with kids and other pets. Fully vaccinated and vet-checked. He comes with all his toys, bed, and medical records. Buddy is house-trained and knows basic commands like sit, stay, and come.",
  images: [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
  ],
  sellerAvatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
  datePosted: "2023-12-15",
  views: 127,
}

export default function PetDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleBuyNow = () => {
    // Razorpay integration will be implemented here
    window.location.href = `/order/${pet.id}`
  }

  const handleContactSeller = () => {
    // Open email client or show contact modal
    window.location.href = `mailto:${pet.sellerEmail}?subject=Interested in ${pet.name}&body=Hi ${pet.sellerName}, I'm interested in adopting ${pet.name}. Could we arrange a meeting?`
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-cream-white text-dark-nose-black font-sans">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-fur-gray/20">
        <div className="container px-4 md:px-6 py-4">
          <nav className="text-sm text-fur-gray">
            <span>Home</span> / <span>Pets</span> / <span>Dogs</span> /{" "}
            <span className="text-paw-brown font-medium">{pet.name}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 py-8 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Carousel */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  alt={`${pet.name} - ${pet.breed} ${pet.species} - Image ${currentImageIndex + 1}`}
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  src={pet.images[currentImageIndex] || "/placeholder.svg"}
                  style={{
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />
                <button
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-200 shadow-lg ${
                    isFavorite ? "bg-paw-brown text-cream-white" : "bg-white/90 text-paw-brown hover:bg-white"
                  }`}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label={isFavorite ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
                >
                  <HeartIcon className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`} />
                </button>

                <div className="absolute top-4 left-4 bg-paw-brown text-cream-white px-4 py-2 rounded-full text-sm font-semibold">
                  {pet.availability}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {pet.images.map((_, index) => (
                    <button
                      key={index}
                      className={`h-3 w-3 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? "bg-paw-brown" : "bg-white/50 hover:bg-white/80"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex ? "border-paw-brown" : "border-transparent hover:border-fur-gray/30"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      alt={`${pet.name} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                      src={image || "/placeholder.svg"}
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              {/* Basic Info */}
              <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
                <CardContent className="p-0">
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-4xl font-poppins font-bold text-dark-nose-black">{pet.name}</h1>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-lg bg-transparent">
                      <ShareIcon className="h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge className="bg-soft-pink-nose text-dark-nose-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1">
                      <PawPrintIcon className="h-3 w-3" aria-hidden="true" />
                      {pet.breed}
                    </Badge>
                    <Badge className="bg-sky-blue-collar text-cream-white rounded-full px-4 py-2 text-sm font-medium">
                      {pet.gender}
                    </Badge>
                    <Badge className="bg-paw-brown text-cream-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1">
                      <CheckCircleIcon className="h-3 w-3" aria-hidden="true" />
                      {pet.vaccinationStatus}
                    </Badge>
                  </div>

                  <p className="text-lg text-fur-gray mb-6 leading-relaxed">{pet.description}</p>

                  <div className="grid grid-cols-2 gap-6 text-base">
                    <div className="space-y-3">
                      <div>
                        <span className="font-poppins font-semibold text-dark-nose-black">Age:</span>
                        <span className="text-fur-gray ml-2">
                          {pet.ageYears} years, {pet.ageMonths} months
                        </span>
                      </div>
                      <div>
                        <span className="font-poppins font-semibold text-dark-nose-black">Weight:</span>
                        <span className="text-fur-gray ml-2">{pet.weight}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-poppins font-semibold text-dark-nose-black">Posted:</span>
                        <span className="text-fur-gray ml-2 flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(pet.datePosted).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-poppins font-semibold text-dark-nose-black">Views:</span>
                        <span className="text-fur-gray ml-2">{pet.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="font-poppins font-semibold text-dark-nose-black">Temperament:</span>
                    <p className="text-fur-gray mt-1">{pet.temperament}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Information */}
              <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-poppins font-bold text-dark-nose-black mb-6">Seller Information</h2>
                  <div className="flex items-center gap-6 mb-6">
                    <img
                      src={pet.sellerAvatar || "/placeholder.svg"}
                      alt={`${pet.sellerName}'s profile picture`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-paw-brown shadow-lg"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-paw-brown" aria-hidden="true" />
                        <span className="font-poppins font-semibold text-dark-nose-black">{pet.sellerName}</span>
                        <Badge className="bg-paw-brown/10 text-paw-brown px-2 py-1 text-xs rounded-full">
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-fur-gray">
                        <MapPinIcon className="h-5 w-5 text-paw-brown" aria-hidden="true" />
                        <span>{pet.sellerLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-5 w-5 text-paw-brown" aria-hidden="true" />
                      <span className="font-poppins font-semibold text-dark-nose-black">Phone:</span>
                      <span className="text-fur-gray">{pet.sellerContact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-5 w-5 text-paw-brown" aria-hidden="true" />
                      <span className="font-poppins font-semibold text-dark-nose-black">Email:</span>
                      <span className="text-fur-gray">{pet.sellerEmail}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price and Action Buttons */}
              <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                      <div className="text-5xl font-poppins font-bold text-paw-brown mb-2">${pet.price}</div>
                      <Badge className="bg-sky-blue-collar text-cream-white rounded-full px-6 py-2 text-lg font-medium">
                        {pet.availability}
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <Button
                        onClick={handleContactSeller}
                        variant="outline"
                        className="border-2 border-sky-blue-collar text-sky-blue-collar hover:bg-sky-blue-collar hover:text-cream-white rounded-xl px-8 py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:-translate-y-1 bg-transparent"
                      >
                        <MailIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Contact Seller
                      </Button>
                      <Button
                        onClick={handleBuyNow}
                        className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:transform hover:-translate-y-1"
                      >
                        <PawPrintIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        Buy This Pet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Badge className="bg-white text-dark-nose-black border-2 border-paw-brown/20 rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                  <ShieldCheckIcon className="h-6 w-6 text-paw-brown" aria-hidden="true" />
                  <span className="font-semibold">Verified Seller</span>
                </Badge>
                <Badge className="bg-white text-dark-nose-black border-2 border-paw-brown/20 rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                  <StethoscopeIcon className="h-6 w-6 text-paw-brown" aria-hidden="true" />
                  <span className="font-semibold">Vet Checked</span>
                </Badge>
                <Badge className="bg-white text-dark-nose-black border-2 border-paw-brown/20 rounded-xl px-6 py-4 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow">
                  <CreditCardIcon className="h-6 w-6 text-paw-brown" aria-hidden="true" />
                  <span className="font-semibold">Secure Payment</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
