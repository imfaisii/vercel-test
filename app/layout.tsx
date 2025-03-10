import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Free Calculators Online | 50+ Tools for Math, Finance & More",
    template: "%s | Free Calculators",
  },
  description:
    "Access 100+ free calculators for math, finance, business, and more. No signup required. Start calculating instantly.",
  keywords: [
    "free calculators",
    "online calculators",
    "math calculators",
    "finance calculators",
    "business calculators",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freecalculators.ai",
    title: "Free Calculators Online | 50+ Tools for Math, Finance & More",
    description:
      "Access 100+ free calculators for math, finance, business, and more. No signup required. Start calculating instantly.",
    siteName: "Free Calculators",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Calculators Online | 50+ Tools for Math, Finance & More",
    description:
      "Access 100+ free calculators for math, finance, business, and more. No signup required. Start calculating instantly.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}



import './globals.css'