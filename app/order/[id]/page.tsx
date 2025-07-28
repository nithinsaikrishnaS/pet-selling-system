"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircleIcon, CreditCardIcon, DollarSignIcon, PackageIcon, ShieldIcon, TruckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Dummy pet data with realistic Unsplash image
const pet = {
  id: "1",
  name: "Buddy",
  species: "Dog",
  breed: "Golden Retriever",
  age: "2 years, 6 months",
  price: "850.00",
  imageUrl:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
}

// Razorpay configuration
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_XXXXXXXX"

export default function OrderFormPage() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    deliveryAddress: "",
    preferredDeliveryDate: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    const res = await initializeRazorpay()
    if (!res) {
      toast({
        title: "Payment Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create order on server
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId: pet.id,
          amount: Number.parseFloat(pet.price),
          orderData: {
            fullName: formData.fullName,
            email: formData.email,
            contactNumber: formData.contactNumber,
            deliveryAddress: formData.deliveryAddress,
            preferredDeliveryDate: formData.preferredDeliveryDate,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderResponse = await response.json()

      const options = {
        key: orderResponse.key,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "PawPal",
        description: `Purchase ${pet.name} - ${pet.breed}`,
        image: "/favicon.ico",
        order_id: orderResponse.razorpay_order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (verifyResponse.ok) {
              setIsConfirmModalOpen(true)
              toast({
                title: "🎉 Payment Successful!",
                description: (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    Your order for {pet.name} has been confirmed.
                  </div>
                ),
                variant: "default",
              })
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if payment was deducted.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
        },
        notes: {
          address: formData.deliveryAddress,
          pet_id: pet.id,
          pet_name: pet.name,
        },
        theme: {
          color: "#A47551", // Paw brown color
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        })
      })
      paymentObject.open()
    } catch (error) {
      console.error("Payment initialization error:", error)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validate form
    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate form validation and processing
    setTimeout(() => {
      setLoading(false)
      handlePayment()
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream-white to-soft-pink-nose/10 text-dark-nose-black font-sans py-12">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">Complete Your Order</h1>
          <p className="text-xl text-fur-gray">You're just one step away from welcoming your new companion home!</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Pet Summary Card */}
          <Card className="bg-white rounded-2xl shadow-2xl p-8 border-0 h-fit">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-poppins font-bold flex items-center gap-2">
                <PackageIcon className="h-6 w-6 text-paw-brown" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center">
                <img
                  alt={`${pet.name} - ${pet.breed} puppy smiling`}
                  className="w-64 h-64 object-cover rounded-2xl mb-6 shadow-lg"
                  src={pet.imageUrl || "/placeholder.svg"}
                  style={{
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />
                <h3 className="text-2xl font-poppins font-bold text-dark-nose-black mb-2">{pet.name}</h3>
                <p className="text-fur-gray text-lg mb-4">
                  {pet.breed} • {pet.age}
                </p>
                <div className="w-full bg-fur-gray/10 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Pet Price:</span>
                    <span className="text-paw-brown font-bold">${pet.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg mt-2">
                    <span className="font-semibold">Service Fee:</span>
                    <span className="text-fur-gray">$0.00</span>
                  </div>
                  <hr className="my-4 border-fur-gray/20" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-paw-brown text-2xl">${pet.price}</span>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex items-center gap-2 text-sm text-fur-gray">
                    <ShieldIcon className="h-4 w-4 text-paw-brown" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fur-gray">
                    <TruckIcon className="h-4 w-4 text-paw-brown" />
                    <span>Safe Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fur-gray">
                    <CheckCircleIcon className="h-4 w-4 text-paw-brown" />
                    <span>Verified Seller</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-fur-gray">
                    <CreditCardIcon className="h-4 w-4 text-paw-brown" />
                    <span>Money Back Guarantee</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information Form */}
          <Card className="bg-white rounded-2xl shadow-2xl p-8 border-0">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-poppins font-bold">Buyer Information</CardTitle>
              <p className="text-fur-gray">Please provide your details for delivery and contact purposes.</p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-sans text-fur-gray font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-sans text-fur-gray font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="font-sans text-fur-gray font-semibold">
                    Contact Number *
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress" className="font-sans text-fur-gray font-semibold">
                    Delivery Address *
                  </Label>
                  <Textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    placeholder="123 Pet Lane, City, State, ZIP Code"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm min-h-[100px] py-3 px-4 text-base"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                  />
                </div>

                {/* Payment Section */}
                <div className="mt-8 pt-6 border-t border-fur-gray/20">
                  <h3 className="text-xl font-poppins font-bold mb-4 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-paw-brown" />
                    Payment Method
                  </h3>
                  <Card className="bg-gradient-to-r from-paw-brown/5 to-sky-blue-collar/5 rounded-xl p-6 border-2 border-paw-brown/20">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-4">
                        <img src="https://razorpay.com/assets/razorpay-logo.svg" alt="Razorpay" className="h-8" />
                        <span className="text-lg font-semibold text-dark-nose-black">Secure Payment Gateway</span>
                      </div>
                      <div className="flex items-center gap-2 text-fur-gray mb-4">
                        <DollarSignIcon className="h-5 w-5 text-paw-brown" aria-hidden="true" />
                        <span>
                          Total Amount: <strong className="text-paw-brown">${pet.price}</strong>
                        </span>
                      </div>
                      <div className="flex gap-3 mb-4">
                        <img
                          src="https://cdn-icons-png.flaticon.com/32/349/349221.png"
                          alt="Visa payment icon"
                          className="w-12 h-8 object-contain rounded border"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/32/349/349228.png"
                          alt="Mastercard payment icon"
                          className="w-12 h-8 object-contain rounded border"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/32/5968/5968144.png"
                          alt="UPI payment icon"
                          className="w-12 h-8 object-contain rounded border"
                        />
                        <img
                          src="https://cdn-icons-png.flaticon.com/32/888/888870.png"
                          alt="Net banking icon"
                          className="w-12 h-8 object-contain rounded border"
                        />
                      </div>
                      <p className="text-sm text-fur-gray">
                        🔒 Your payment information is encrypted and secure. We support all major payment methods.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-4 shadow-lg transition-all duration-200 hover:shadow-xl text-xl font-semibold hover:transform hover:-translate-y-1 mt-8"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cream-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-6 w-6" />
                      Proceed to Payment
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-fur-gray mt-4">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl shadow-2xl p-8 text-center">
          <DialogHeader>
            <img
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="Happy dog wagging tail - order success celebration"
              className="mx-auto mb-6 object-contain rounded-2xl shadow-lg"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "16px",
                objectFit: "cover",
              }}
            />
            <DialogTitle className="text-3xl font-poppins font-bold text-dark-nose-black mb-2">
              🎉 Order Confirmed!
            </DialogTitle>
            <DialogDescription className="text-fur-gray text-lg">
              Congratulations! Your new furry friend is on their way to you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center gap-2 text-paw-brown font-semibold text-lg">
              <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
              <span>Order ID: #PAWPAL{Date.now().toString().slice(-5)}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-fur-gray">
              <PackageIcon className="h-6 w-6" aria-hidden="true" />
              <span>Estimated Delivery: 3-5 business days</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-fur-gray">
              <TruckIcon className="h-6 w-6" aria-hidden="true" />
              <span>Tracking information will be sent to your email</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                setIsConfirmModalOpen(false)
                router.push("/dashboard")
              }}
              className="bg-sky-blue-collar text-cream-white hover:bg-sky-blue-collar/90 rounded-xl px-6 py-3 shadow-md transition-all duration-200 hover:shadow-lg flex-1"
            >
              View My Orders
            </Button>
            <Button
              onClick={() => {
                setIsConfirmModalOpen(false)
                router.push("/pets")
              }}
              variant="outline"
              className="border-2 border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white rounded-xl px-6 py-3 shadow-md transition-all duration-200 hover:shadow-lg flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
