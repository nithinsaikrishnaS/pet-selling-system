"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  PackageIcon, 
  HeartIcon, 
  DollarSignIcon, 
  UserIcon, 
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  pet_id: string
  pet_name: string
  pet_image_url?: string
  full_name: string
  email: string
  contact_number: string
  delivery_address: string
  amount: number
  status: string
  created_at: string
  razorpay_payment_id?: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  price: number
  image_url?: string
  status: string
  created_at: string
}

interface Profile {
  id: string
  full_name?: string
  email?: string
  phone?: string
  location?: string
  bio?: string
  avatar_url?: string
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [myPets, setMyPets] = useState<Pet[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("orders")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        router.push("/login")
        return
      }

      // Fetch user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(profileData)

      // Fetch user's orders (as buyer)
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          pets (
            name,
            image_url
          )
        `)
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })

      if (ordersData) {
        const formattedOrders = ordersData.map((order: any) => ({
          ...order,
          pet_name: order.pets?.name || "Unknown Pet",
          pet_image_url: order.pets?.image_url
        }))
        setOrders(formattedOrders)
      }

      // Fetch user's pets (as seller)
      const { data: petsData } = await supabase
        .from("pets")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      setMyPets(petsData || [])

    } catch (error) {
      console.error("Dashboard data fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon },
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircleIcon },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircleIcon },
      delivered: { color: "bg-blue-100 text-blue-800", icon: TruckIcon },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/20 py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paw-brown mx-auto"></div>
            <p className="mt-4 text-fur-gray">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/20 py-12">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">My Dashboard</h1>
          <p className="text-xl text-fur-gray">Welcome back, {profile?.full_name || "Pet Lover"}!</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 bg-white rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-paw-brown" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{profile?.full_name || "Not set"}</h3>
                <div className="space-y-2 text-fur-gray">
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    <span>{profile?.email || "Email not set"}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button variant="outline" onClick={() => router.push("/profile")}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <PackageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-fur-gray">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <HeartIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-fur-gray">My Pets</p>
                  <p className="text-2xl font-bold">{myPets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarSignIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-fur-gray">Total Spent</p>
                  <p className="text-2xl font-bold">
                    ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl p-1 shadow-lg">
            <TabsTrigger value="orders" className="rounded-lg">My Orders</TabsTrigger>
            <TabsTrigger value="pets" className="rounded-lg">My Pets</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageIcon className="h-6 w-6 text-paw-brown" />
                  Order History
                </CardTitle>
                <CardDescription>Track all your pet purchases and their delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <PackageIcon className="h-12 w-12 text-fur-gray mx-auto mb-4" />
                    <p className="text-fur-gray mb-4">No orders yet</p>
                    <Button onClick={() => router.push("/pets")}>
                      Browse Pets
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <img
                            src={order.pet_image_url || "/placeholder.svg"}
                            alt={order.pet_name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{order.pet_name}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-fur-gray">
                              <div>
                                <p><strong>Order ID:</strong> {order.id.slice(0, 8)}...</p>
                                <p><strong>Amount:</strong> ₹{order.amount}</p>
                                <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
                              </div>
                              <div>
                                <p><strong>Delivery Address:</strong></p>
                                <p className="text-xs">{order.delivery_address}</p>
                              </div>
                            </div>
                            {order.razorpay_payment_id && (
                              <p className="text-xs text-fur-gray mt-2">
                                Payment ID: {order.razorpay_payment_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <HeartIcon className="h-6 w-6 text-paw-brown" />
                      My Listed Pets
                    </CardTitle>
                    <CardDescription>Manage the pets you've listed for sale</CardDescription>
                  </div>
                  <Button onClick={() => router.push("/sell")}>
                    List New Pet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {myPets.length === 0 ? (
                  <div className="text-center py-12">
                    <HeartIcon className="h-12 w-12 text-fur-gray mx-auto mb-4" />
                    <p className="text-fur-gray mb-4">No pets listed yet</p>
                    <Button onClick={() => router.push("/sell")}>
                      List Your First Pet
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPets.map((pet) => (
                      <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square">
                          <img
                            src={pet.image_url || "/placeholder.svg"}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
                          <p className="text-fur-gray text-sm mb-2">
                            {pet.breed} • {pet.species}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-paw-brown">₹{pet.price}</span>
                            <Badge variant="outline">{pet.status}</Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="flex-1">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
