import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Logo size="small" />
            <p className="text-sm text-gray-600">
              Empowering mental wellness through education, tracking, and community support.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-calm-blue-900">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-calm-blue-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/wellness" className="text-gray-600 hover:text-calm-blue-600">
                  Wellness Tracker
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-calm-blue-600">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-gray-600 hover:text-calm-blue-600">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-calm-blue-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-calm-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-calm-blue-600">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-calm-blue-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-calm-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-calm-blue-900">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-calm-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-calm-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-calm-blue-600">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-600 hover:text-calm-blue-600">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Claro Mental Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
