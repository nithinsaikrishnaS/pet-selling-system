"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/server-admin"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  try {
    const supabase = await createClient()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
          full_name: name,
        },
      },
    })

    if (error) {
      console.error("Signup error:", error)
      return { error: error.message }
    }

    if (data.user) {
      // Try to create profile with admin client if service role key is available
      try {
        const adminSupabase = createAdminClient()
        const { error: profileError } = await adminSupabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: name,
            email: email,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't fail the signup, profile can be created later
        }
      } catch (adminError) {
        console.error("Admin client error:", adminError)
        // Continue without admin client if service role key is missing
      }

      return {
        success: true,
        message: data.user.email_confirmed_at
          ? "Account created successfully! Welcome to PawPal."
          : "Account created! Please check your email to verify your account.",
      }
    }

    return { error: "Failed to create account" }
  } catch (error) {
    console.error("Unexpected signup error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      return { error: error.message }
    }

    if (data.user) {
      // Try to create profile with admin client if service role key is available
      try {
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()

        if (!existingProfile) {
          const adminSupabase = createAdminClient()
          const { error: profileError } = await adminSupabase.from("profiles").insert([
            {
              id: data.user.id,
              full_name: data.user.user_metadata?.full_name || "",
              email: data.user.email || "",
              created_at: new Date().toISOString(),
            },
          ])

          if (profileError) {
            console.error("Profile creation error during login:", profileError)
          }
        }
      } catch (adminError) {
        console.error("Admin client error during login:", adminError)
        // Continue without admin client if service role key is missing
      }

      return { success: true, message: "Successfully logged in!" }
    }

    return { error: "Failed to log in" }
  } catch (error) {
    console.error("Unexpected login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return { error: error.message }
    }

    return { 
      success: true, 
      message: "Password reset email sent! Please check your inbox." 
    }
  } catch (error) {
    console.error("Unexpected password reset error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Password and confirmation are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error("Password update error:", error)
      return { error: error.message }
    }

    return { 
      success: true, 
      message: "Password updated successfully! You can now log in with your new password." 
    }
  } catch (error) {
    console.error("Unexpected password update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
