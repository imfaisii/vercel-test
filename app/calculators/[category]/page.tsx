import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryData } from "@/lib/calculator-data"
import { Breadcrumb } from "@/components/breadcrumb"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryData = getCategoryData(params.category)

  if (!categoryData) {
    notFound()
  }

  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: `${categoryData.title} Calculators`,
      href: `/calculators/${params.category}`,
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
          <Link key={calculator.slug} href={`/calculators/${params.category}/${calculator.slug}`} className="block">
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

