import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PawPal - Find Your Perfect Pet Companion",
  description:
    "Connect with loving pets looking for their forever homes. Browse, adopt, and give a pet the love they deserve through our trusted platform.",
  keywords: "pets, adoption, dogs, cats, birds, pet marketplace, animal rescue",
  authors: [{ name: "PawPal Team" }],
  creator: "PawPal",
  publisher: "PawPal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pawpal.com"),
  openGraph: {
    title: "PawPal - Find Your Perfect Pet Companion",
    description:
      "Connect with loving pets looking for their forever homes. Browse, adopt, and give a pet the love they deserve.",
    url: "https://pawpal.com",
    siteName: "PawPal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PawPal - Pet Adoption Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PawPal - Find Your Perfect Pet Companion",
    description:
      "Connect with loving pets looking for their forever homes. Browse, adopt, and give a pet the love they deserve.",
    images: ["/og-image.jpg"],
    creator: "@pawpal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
