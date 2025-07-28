import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-cream-white text-dark-nose-black">
      <div className="max-w-md w-full mx-auto text-center p-6">
        <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertCircleIcon className="h-8 w-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-poppins font-bold mb-4">Authentication Error</h1>

        <p className="text-fur-gray mb-6 leading-relaxed">
          Sorry, there was an error processing your authentication request. This could be due to an expired or invalid
          link.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90">
            <Link href="/login">Try Signing In Again</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full border-paw-brown text-paw-brown hover:bg-paw-brown hover:text-cream-white bg-transparent"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>

        <p className="text-sm text-fur-gray mt-6">
          If you continue to experience issues, please contact our support team.
        </p>
      </div>
    </div>
  )
}
