"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, UserIcon, PawPrintIcon } from "lucide-react"

interface AuthFormProps {
  type: "login" | "signup"
  action: (formData: FormData) => Promise<{ error?: string | null; success?: boolean; message?: string }>
}

export function AuthForm({ type, action }: AuthFormProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
    if (type === "signup" && password !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      setLoading(false)
      return
    }

    if (type === "signup" && password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData(event.currentTarget)
      const result = await action(formData)

      if (result.error) {
        toast({
          title: "Authentication Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.success) {
        toast({
          title: type === "login" ? "🐾 Welcome Back!" : "🎉 Welcome to PawPal!",
          description: (
            <div className="flex items-center gap-2">
              <PawPrintIcon className="h-4 w-4" />
              {result.message || (type === "login" ? "Successfully logged in!" : "Your account has been created!")}
            </div>
          ),
        })

        // Small delay to show the success message
        setTimeout(() => {
          router.push("/pets")
          router.refresh()
        }, 1000)
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream-white to-soft-pink-nose/20 py-12">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Illustration Side */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <img
                alt={
                  type === "login"
                    ? "Login illustration with cute pets and laptop - Welcome back to PawPal"
                    : "Signup illustration with happy pets and email icons - Join PawPal community"
                }
                className="w-full max-w-lg h-auto object-contain rounded-xl shadow-lg"
                src={
                  type === "login"
                    ? "https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    : "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                }
                style={{
                  maxWidth: "100%",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-paw-brown/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-sky-blue-collar/30 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Auth Form */}
          <Card className="w-full max-w-md mx-auto rounded-2xl shadow-2xl p-8 bg-white text-dark-nose-black border-0">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-paw-brown/10 rounded-full">
                  <PawPrintIcon className="h-12 w-12 text-paw-brown" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-3xl font-poppins font-bold mb-2">
                {type === "login" ? "Welcome Back!" : "Join PawPal!"}
              </CardTitle>
              <CardDescription className="text-fur-gray text-lg">
                {type === "login" ? "Your new best friend awaits!" : "Find your furry companion today."}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {type === "signup" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-sans text-fur-gray flex items-center gap-2 text-sm font-medium"
                    >
                      <UserIcon className="h-4 w-4" aria-hidden="true" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-sans text-fur-gray flex items-center gap-2 text-sm font-medium"
                  >
                    <MailIcon className="h-4 w-4" aria-hidden="true" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="font-sans text-fur-gray flex items-center gap-2 text-sm font-medium"
                  >
                    <LockIcon className="h-4 w-4" aria-hidden="true" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 pr-12 text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={type === "signup" ? "Create a strong password" : "Enter your password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-fur-gray hover:bg-transparent hover:text-paw-brown"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </Button>
                  </div>
                  {type === "signup" && (
                    <p className="text-xs text-fur-gray mt-1">Password must be at least 6 characters long.</p>
                  )}
                </div>

                {type === "signup" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="font-sans text-fur-gray flex items-center gap-2 text-sm font-medium"
                    >
                      <LockIcon className="h-4 w-4" aria-hidden="true" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                    />
                    {passwordError && (
                      <p className="text-destructive text-sm mt-1 flex items-center gap-1">⚠️ {passwordError}</p>
                    )}
                  </div>
                )}

                {type === "signup" && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      className="mt-1 rounded text-paw-brown focus:ring-paw-brown border-fur-gray/30"
                    />
                    <Label htmlFor="terms" className="font-sans text-sm text-fur-gray leading-relaxed">
                      I agree to the{" "}
                      <Link href="#" className="text-sky-blue-collar hover:underline font-medium">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="#" className="text-sky-blue-collar hover:underline font-medium">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl text-lg font-semibold hover:transform hover:-translate-y-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cream-white"></div>
                      {type === "login" ? "Logging in..." : "Creating account..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <PawPrintIcon className="h-5 w-5" />
                      {type === "login" ? "Login" : "Create Account"}
                    </div>
                  )}
                </Button>

                {type === "login" && (
                  <div className="text-center">
                    <Link href="/forgot-password" className="text-sm text-sky-blue-collar hover:underline font-medium">
                      Forgot your password?
                    </Link>
                  </div>
                )}

                <div className="text-center text-sm text-fur-gray pt-4 border-t border-fur-gray/20">
                  {type === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <Link href="/signup" className="text-sky-blue-collar hover:underline font-semibold">
                        Sign up here
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link href="/login" className="text-sky-blue-collar hover:underline font-semibold">
                        Login here
                      </Link>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
