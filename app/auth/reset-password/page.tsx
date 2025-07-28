"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { LockIcon, EyeIcon, EyeOffIcon, PawPrintIcon, CheckCircleIcon } from "lucide-react"
import { resetPassword } from "@/app/actions/auth"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setPasswordError(null)

    // Client-side validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("password", password)
      formData.append("confirmPassword", confirmPassword)

      const result = await resetPassword(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.success) {
        toast({
          title: "✅ Password Updated!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4" />
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
                alt="Reset password illustration with cute pets and lock icons - Set your new PawPal password"
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
                  Reset Your Password
                </CardTitle>
                <CardDescription className="text-fur-gray">
                  Enter your new password below.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-sans text-fur-gray flex items-center gap-2">
                      <LockIcon className="h-4 w-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fur-gray hover:text-paw-brown transition-colors"
                      >
                        {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-sans text-fur-gray flex items-center gap-2">
                      <LockIcon className="h-4 w-4" />
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fur-gray hover:text-paw-brown transition-colors"
                      >
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {passwordError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-3 shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating Password...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm text-fur-gray">
                  <p>Remember your password?</p>
                  <Link
                    href="/login"
                    className="text-paw-brown hover:text-paw-brown/80 font-medium transition-colors"
                  >
                    Back to Login
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