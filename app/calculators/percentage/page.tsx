import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryData } from "@/lib/calculator-data"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CategoryPage() {
  const categoryData = getCategoryData("percentage")

  if (!categoryData) {
    notFound()
  }

  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Percentage Calculators",
      href: "/calculators/percentage",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {categoryData.icon}
          <h1 className="text-3xl font-bold tracking-tight">{categoryData.title} Calculators</h1>
        </div>
        <p className="text-muted-foreground">{categoryData.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categoryData.calculators.map((calculator) => (
          <Link key={calculator.slug} href={`/calculators/percentage/${calculator.slug}`} className="block">
            <div className="border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all">
              <h2 className="text-xl font-semibold mb-2">{calculator.name} Calculator</h2>
              <p className="text-muted-foreground">{calculator.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

