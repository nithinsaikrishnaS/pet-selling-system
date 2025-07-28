"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PawPrintIcon,
  SearchIcon,
  HeartIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  price: number
  image_url?: string
  is_vaccinated: boolean
}

const fallbackPets = [
  {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    price: 850,
    image_url:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Siamese",
    price: 400,
    image_url:
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
  },
  {
    id: "3",
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    price: 650,
    image_url:
      "https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: true,
  },
  {
    id: "4",
    name: "Polly",
    species: "Bird",
    breed: "Macaw",
    price: 1200,
    image_url:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    is_vaccinated: false,
  },
]

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchFeaturedPets()
  }, [])

  const fetchFeaturedPets = async () => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("id, name, species, breed, price, image_url, is_vaccinated")
        .limit(4)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching pets:", error)
        setFeaturedPets(fallbackPets)
      } else if (data && data.length > 0) {
        setFeaturedPets(data)
      } else {
        setFeaturedPets(fallbackPets)
      }
    } catch (error) {
      console.error("Error in fetchFeaturedPets:", error)
      setFeaturedPets(fallbackPets)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white via-soft-pink-nose/5 to-sky-blue-collar/5 pt-16">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-poppins font-bold text-dark-nose-black leading-tight">
                  Find Your
                  <span className="text-paw-brown block">Perfect Pet</span>
                </h1>
                <p className="text-xl md:text-2xl text-fur-gray leading-relaxed">
                  Connect with loving pets looking for their forever homes. Browse, adopt, and give a pet the love they
                  deserve.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:-translate-y-1"
                >
                  <Link href="/pets">
                    <SearchIcon className="h-6 w-6 mr-2" />
                    Browse Pets
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-sky-blue-collar text-sky-blue-collar hover:bg-sky-blue-collar hover:text-cream-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:-translate-y-1 bg-transparent"
                >
                  <Link href="/sell">
                    <PawPrintIcon className="h-6 w-6 mr-2" />
                    List Your Pet
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-paw-brown">500+</div>
                  <div className="text-sm text-fur-gray">Happy Pets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-sky-blue-collar">1000+</div>
                  <div className="text-sm text-fur-gray">Families</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-soft-pink-nose">99%</div>
                  <div className="text-sm text-fur-gray">Success Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Happy family with their adopted pet dog in a sunny park"
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-paw-brown/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sky-blue-collar/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-dark-nose-black mb-6">Featured Pets</h2>
            <p className="text-xl text-fur-gray max-w-2xl mx-auto">
              Meet some of our adorable pets who are looking for their forever homes
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-fur-gray/20"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-fur-gray/20 rounded"></div>
                    <div className="h-4 bg-fur-gray/20 rounded w-3/4"></div>
                    <div className="h-8 bg-fur-gray/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredPets.map((pet) => (
                <Card
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 group"
                >
                  <div className="relative">
                    <img
                      src={pet.image_url || "/placeholder.svg?height=250&width=400&text=Pet+Image"}
                      alt={`${pet.name} - ${pet.breed || pet.species}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-paw-brown text-cream-white rounded-full px-3 py-1 text-sm font-semibold">
                        {pet.species}
                      </Badge>
                    </div>
                    {pet.is_vaccinated && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white rounded-full px-2 py-1 text-xs flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          Vaccinated
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-poppins font-bold text-dark-nose-black mb-2 group-hover:text-paw-brown transition-colors">
                      {pet.name}
                    </h3>
                    {pet.breed && <p className="text-fur-gray mb-4">{pet.breed}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-poppins font-bold text-paw-brown">
                        ${pet.price.toLocaleString()}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-sky-blue-collar text-cream-white hover:bg-sky-blue-collar/90 rounded-lg"
                      >
                        <Link href={`/pets/${pet.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white rounded-xl px-8 py-4 text-lg font-semibold bg-transparent"
            >
              <Link href="/pets">
                View All Pets
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-dark-nose-black mb-6">
              Why Choose PawPal?
            </h2>
            <p className="text-xl text-fur-gray max-w-2xl mx-auto">
              We make pet adoption safe, easy, and joyful for everyone involved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0 text-center hover:shadow-xl transition-shadow">
              <div className="p-4 bg-paw-brown/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <ShieldCheckIcon className="h-10 w-10 text-paw-brown" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-dark-nose-black mb-4">Verified Sellers</h3>
              <p className="text-fur-gray leading-relaxed">
                All our pet sellers are thoroughly verified to ensure the safety and health of every pet on our
                platform.
              </p>
            </Card>

            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0 text-center hover:shadow-xl transition-shadow">
              <div className="p-4 bg-sky-blue-collar/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <HeartIcon className="h-10 w-10 text-sky-blue-collar" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-dark-nose-black mb-4">Health Guaranteed</h3>
              <p className="text-fur-gray leading-relaxed">
                Every pet comes with health certificates and vaccination records to give you peace of mind.
              </p>
            </Card>

            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0 text-center hover:shadow-xl transition-shadow">
              <div className="p-4 bg-soft-pink-nose/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <UsersIcon className="h-10 w-10 text-soft-pink-nose" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-dark-nose-black mb-4">24/7 Support</h3>
              <p className="text-fur-gray leading-relaxed">
                Our dedicated support team is always here to help you throughout your pet adoption journey.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-dark-nose-black mb-6">Happy Families</h2>
            <p className="text-xl text-fur-gray max-w-2xl mx-auto">
              Read what our community has to say about their PawPal experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-fur-gray mb-6 leading-relaxed">
                "PawPal made finding our perfect companion so easy! The process was smooth, and our new puppy came with
                all the necessary health documents."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-poppins font-semibold text-dark-nose-black">Sarah Johnson</div>
                  <div className="text-sm text-fur-gray">Dog Owner</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-fur-gray mb-6 leading-relaxed">
                "As a first-time pet owner, I was nervous, but PawPal's support team guided me through everything. My
                cat is healthy and happy!"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Mike Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-poppins font-semibold text-dark-nose-black">Mike Chen</div>
                  <div className="text-sm text-fur-gray">Cat Owner</div>
                </div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl shadow-lg p-8 border-0">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-fur-gray mb-6 leading-relaxed">
                "I found the perfect home for my bird through PawPal. The platform made it easy to connect with genuine
                pet lovers."
              </p>
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="Emily Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-poppins font-semibold text-dark-nose-black">Emily Rodriguez</div>
                  <div className="text-sm text-fur-gray">Pet Seller</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-paw-brown to-sky-blue-collar">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-cream-white mb-6">
              Ready to Find Your Perfect Pet?
            </h2>
            <p className="text-xl text-cream-white/90 mb-8 leading-relaxed">
              Join thousands of happy families who found their furry, feathered, or scaled companions through PawPal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-cream-white text-paw-brown hover:bg-cream-white/90 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:-translate-y-1"
              >
                <Link href="/pets">
                  <SearchIcon className="h-6 w-6 mr-2" />
                  Start Browsing
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-cream-white text-cream-white hover:bg-cream-white hover:text-paw-brown rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:transform hover:-translate-y-1 bg-transparent"
              >
                <Link href="/sell">
                  <PawPrintIcon className="h-6 w-6 mr-2" />
                  List Your Pet
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
