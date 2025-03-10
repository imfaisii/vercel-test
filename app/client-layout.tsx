"use client"

import type React from "react"
import "./globals.css"
import Link from "next/link"
import { Calculator, Star } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { MobileMenu } from "@/components/mobile-menu"
import { Badge } from "@/components/ui/badge"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google Analytics Tracking Code */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5FPZN1NY5B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5FPZN1NY5B');
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        <header className="border-b bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2" aria-label="Free Calculators">
                <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="font-bold text-xl">
                  <span className="text-primary">Free</span> Calculators
                </span>
              </Link>

              {/* Navigation links centered */}
              <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
                <nav className="flex items-center">
                  <ul className="flex gap-8">
                    <li>
                      <Link href="/" className="font-medium hover:text-primary transition-colors">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/#faq" className="font-medium hover:text-primary transition-colors">
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link href="/request-calculator" className="font-medium hover:text-primary transition-colors">
                        Request a Free Calculator
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Calculator of the Day Badge - moved to the right */}
              <div className="hidden lg:flex items-center">
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300 cursor-pointer hover:from-purple-600 hover:to-indigo-600 transition-colors shadow-sm"
                  onClick={() => {
                    const section = document.getElementById("calculator-of-the-day-section")
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <Star className="h-3 w-3 mr-1 fill-yellow-300 text-yellow-300" />
                  Calculator of the Day
                </Badge>
              </div>

              {/* Mobile menu - visible only on mobile/tablet */}
              <div className="lg:hidden">
                <MobileMenu />
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-12 py-12 bg-muted/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Legal Stuff Column */}
              <div>
                <h3 className="font-semibold mb-4">Legal Stuff</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Top Free Calculators Column */}
              <div>
                <h3 className="font-semibold mb-4">Top Free Calculators</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/calculators/math/basic" className="text-sm text-muted-foreground hover:text-primary">
                      Basic Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/business/roi" className="text-sm text-muted-foreground hover:text-primary">
                      ROI Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculators/finance/loan" className="text-sm text-muted-foreground hover:text-primary">
                      Loan Calculator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculators/social-media/engagement-rate"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Social Media Engagement Calculator
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact & Content Column */}
              <div>
                <h3 className="font-semibold mb-4">Contact & Content</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                      Request a Free Calculator
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                      Drop us a Line
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-8">
              <p>© {new Date().getFullYear()} Free Calculators. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}

