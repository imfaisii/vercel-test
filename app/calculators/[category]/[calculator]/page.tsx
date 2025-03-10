import { notFound } from "next/navigation"
import { getCategoryData, getCalculatorData } from "@/lib/calculator-data"
import dynamic from "next/dynamic"
import type { Metadata, ResolvingMetadata } from "next"
import { Breadcrumb } from "@/components/breadcrumb"

type Props = {
  params: { category: string; calculator: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const categoryData = getCategoryData(params.category)
  const calculatorData = getCalculatorData(params.category, params.calculator)

  if (!categoryData || !calculatorData) {
    return {
      title: "Calculator Not Found",
      description: "The requested calculator could not be found.",
    }
  }

  return {
    title: `Free ${calculatorData.name} Calculator | Easy Online ${categoryData.title} Tool`,
    description: `${calculatorData.description} Use our free online ${calculatorData.name} calculator for quick, accurate results - no signup required.`,
    keywords: [
      `free ${calculatorData.name} calculator`,
      `online ${calculatorData.name} tool`,
      `${params.category} calculator`,
      `${calculatorData.name.toLowerCase()} calculation`,
    ],
  }
}

export default function CalculatorPage({
  params,
}: {
  params: { category: string; calculator: string }
}) {
  const categoryData = getCategoryData(params.category)
  if (!categoryData) {
    notFound()
  }

  const calculatorData = getCalculatorData(params.category, params.calculator)
  if (!calculatorData) {
    notFound()
  }

  // Create breadcrumb items
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: `${categoryData.title} Calculators`,
      href: `/calculators/${params.category}`,
    },
    {
      label: `${calculatorData.name} Calculator`,
      href: `/calculators/${params.category}/${params.calculator}`,
      current: true,
    },
  ]

  // Dynamically import the calculator component
  const CalculatorComponent = dynamic(() => import(`@/components/calculators/${params.category}/${params.calculator}`))

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{calculatorData.name} Calculator</h1>
        <p className="text-muted-foreground">{calculatorData.description}</p>
      </div>

      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <CalculatorComponent />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">About the {calculatorData.name} Calculator</h2>
        <p className="mb-4">
          Our free {calculatorData.name.toLowerCase()} calculator helps you quickly and accurately perform{" "}
          {calculatorData.name.toLowerCase()} calculations online. This tool is designed to be easy to use and provides
          instant results without requiring any signup or registration.
        </p>
        <h3 className="text-xl font-medium mb-2">How to Use This Calculator</h3>
        <p className="mb-4">
          Simply enter your values in the input fields above, and the calculator will automatically process your data
          and display the results. You can adjust your inputs at any time to see how they affect the outcome.
        </p>
        <h3 className="text-xl font-medium mb-2">Why Choose Our {calculatorData.name} Calculator</h3>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Completely free to use with no hidden fees</li>
          <li>No registration or account creation required</li>
          <li>Accurate calculations based on industry-standard formulas</li>
          <li>User-friendly interface designed for ease of use</li>
          <li>Works on all devices including desktops, tablets, and smartphones</li>
        </ul>
      </div>
    </div>
  )
}

