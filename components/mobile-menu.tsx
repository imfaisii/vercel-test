"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest("[data-mobile-menu]")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div data-mobile-menu className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-end">
            <button onClick={() => setIsOpen(false)} className="p-2 text-foreground" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <nav className="container mx-auto px-4 py-8">
            <ul className="flex flex-col gap-6 text-xl">
              <li>
                <Link href="/" className="block py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="block py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/request-calculator"
                  className="block py-2 hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Request a Free Calculator
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

