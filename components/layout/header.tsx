"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="medium" />

        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="text-calm-blue-600 hover:text-calm-blue-900">
            Home
          </Link>
          <Link href="/courses" className="text-calm-blue-600 hover:text-calm-blue-900">
            Courses
          </Link>
          <Link href="/wellness" className="text-calm-blue-600 hover:text-calm-blue-900">
            Wellness
          </Link>
          <Link href="/resources" className="text-calm-blue-600 hover:text-calm-blue-900">
            Resources
          </Link>
          <Link href="/pricing" className="text-calm-blue-600 hover:text-calm-blue-900">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard" className="text-calm-blue-600 hover:text-calm-blue-900">
                    Dashboard
                  </Link>
                  <Link href="/account" className="text-calm-blue-600 hover:text-calm-blue-900">
                    Account
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-calm-blue-600 hover:text-calm-blue-900">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-calm-blue-600 text-white hover:bg-calm-blue-700">Sign up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
