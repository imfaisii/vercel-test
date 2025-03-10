import type { Metadata } from "next"
import CalculatorRequestForm from "@/components/calculator-request-form"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Request a Calculator | Free Calculators",
  description: "Can't find the calculator you need? Request a custom calculator and we'll build it for you.",
}

export default function RequestCalculatorPage() {
  const breadcrumbItems = [
    {
      label: "Request a Calculator",
      href: "/request-calculator",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-8">Request a Calculator</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          Can't find the calculator you need? Let us know what you're looking for, and we'll consider adding it to our
          collection.
        </p>
        <p className="mb-4">
          Our team is constantly working to expand our library of free calculators. Your suggestions help us prioritize
          which calculators to build next.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <CalculatorRequestForm />
      </div>
    </div>
  )
}

