"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MailIcon, ArrowLeftIcon, PawPrintIcon } from "lucide-react"
import { forgotPassword } from "@/app/actions/auth"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await forgotPassword(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.success) {
        toast({
          title: "📧 Reset Email Sent!",
          description: (
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4" />
              {result.message}
            </div>
          ),
        })

        // Small delay to show the success message
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/20 py-12">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Side */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <img
                alt="Forgot password illustration with cute pets and email icons - Reset your PawPal password"
                className="w-full max-w-lg h-auto object-contain rounded-xl shadow-lg"
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-paw-brown/10 rounded-full">
                    <PawPrintIcon className="h-8 w-8 text-paw-brown" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-poppins font-bold text-dark-nose-black">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-fur-gray">
                  No worries! Enter your email and we'll send you a reset link.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-sans text-fur-gray flex items-center gap-2">
                      <MailIcon className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-3 shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending Reset Link...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-paw-brown hover:text-paw-brown/80 font-medium transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>

                <div className="text-center text-sm text-fur-gray">
                  <p>Don't have an account?</p>
                  <Link
                    href="/signup"
                    className="text-paw-brown hover:text-paw-brown/80 font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 