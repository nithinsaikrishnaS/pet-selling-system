"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  PawPrintIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const goBack = () => {
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
    closeMenu()
  }

  const isActive = (path: string) => pathname === path

  // Show back button on specific pages
  const showBackButton = pathname !== "/" && pathname !== "/dashboard"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-fur-gray/20 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Back Button */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                onClick={goBack}
                variant="ghost"
                size="sm"
                className="text-paw-brown hover:text-paw-brown/80 hover:bg-paw-brown/10 flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{user ? "Dashboard" : "Home"}</span>
              </Button>
            )}

            <Link
              href="/"
              className="flex items-center gap-2 font-poppins font-bold text-xl text-paw-brown hover:text-paw-brown/80 transition-colors"
              onClick={closeMenu}
            >
              <PawPrintIcon className="h-8 w-8" />
              <span className="hidden sm:inline">PawPal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive("/")
                  ? "text-paw-brown bg-paw-brown/10"
                  : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Link>

            <Link
              href="/pets"
              className={`transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg ${
                isActive("/pets")
                  ? "text-paw-brown bg-paw-brown/10"
                  : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
              }`}
            >
              <SearchIcon className="h-4 w-4" />
              Browse Pets
            </Link>

            {user && (
              <>
                <Link
                  href="/sell"
                  className={`transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isActive("/sell")
                      ? "text-paw-brown bg-paw-brown/10"
                      : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                  }`}
                >
                  <PlusIcon className="h-4 w-4" />
                  Sell Pet
                </Link>

                <Link
                  href="/dashboard"
                  className={`transition-colors font-medium flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isActive("/dashboard")
                      ? "text-paw-brown bg-paw-brown/10"
                      : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Right Section - Auth Buttons */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white transition-colors bg-transparent"
                  >
                    <LogOutIcon className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Sign Out</span>
                  </Button>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/10"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-lg"
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-dark-nose-black hover:text-paw-brown transition-colors rounded-lg hover:bg-paw-brown/10"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-fur-gray/20 bg-white">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className={`transition-colors font-medium flex items-center gap-3 py-3 px-4 rounded-lg ${
                  isActive("/")
                    ? "text-paw-brown bg-paw-brown/10"
                    : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                }`}
                onClick={closeMenu}
              >
                <HomeIcon className="h-5 w-5" />
                Home
              </Link>

              <Link
                href="/pets"
                className={`transition-colors font-medium flex items-center gap-3 py-3 px-4 rounded-lg ${
                  isActive("/pets")
                    ? "text-paw-brown bg-paw-brown/10"
                    : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                }`}
                onClick={closeMenu}
              >
                <SearchIcon className="h-5 w-5" />
                Browse Pets
              </Link>

              {user ? (
                <>
                  <Link
                    href="/sell"
                    className={`transition-colors font-medium flex items-center gap-3 py-3 px-4 rounded-lg ${
                      isActive("/sell")
                        ? "text-paw-brown bg-paw-brown/10"
                        : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                    }`}
                    onClick={closeMenu}
                  >
                    <PlusIcon className="h-5 w-5" />
                    Sell Pet
                  </Link>

                  <Link
                    href="/dashboard"
                    className={`transition-colors font-medium flex items-center gap-3 py-3 px-4 rounded-lg ${
                      isActive("/dashboard")
                        ? "text-paw-brown bg-paw-brown/10"
                        : "text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5"
                    }`}
                    onClick={closeMenu}
                  >
                    <UserIcon className="h-5 w-5" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="text-dark-nose-black hover:text-paw-brown hover:bg-paw-brown/5 transition-colors font-medium flex items-center gap-3 py-3 px-4 rounded-lg text-left w-full"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t border-fur-gray/20 mt-2">
                  <Button
                    asChild
                    variant="outline"
                    className="border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white justify-start bg-transparent"
                  >
                    <Link href="/login" onClick={closeMenu}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="bg-paw-brown text-cream-white hover:bg-paw-brown/90 justify-start">
                    <Link href="/signup" onClick={closeMenu}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
