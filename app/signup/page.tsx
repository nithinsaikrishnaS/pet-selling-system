"use client"

import { AuthForm } from "@/components/auth-form"
import { signUp } from "@/app/actions/auth"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/20">
      <AuthForm type="signup" action={signUp} />
    </div>
  )
}
