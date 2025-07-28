"use client"

import { AuthForm } from "@/components/auth-form"
import { signIn } from "@/app/actions/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/20">
      <AuthForm type="login" action={signIn} />
    </div>
  )
}
