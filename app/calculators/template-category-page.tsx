import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"

// Create a loading component for the Suspense fallback
function CalculatorLoading() {
  return (
    <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
      <p className="text-muted-foreground">Loading calculator...</p>
    </div>
  )
}

export default function TemplateCategoryPage({ category }: { category: any }) {
  if (!category) {
    return <div>Category not found</div>
  }

  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: `${category.title} Calculators`,
      href: `/calculators/${category.slug}`,
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {category.icon && <div className="h-8 w-8 text-primary">{category.icon}</div>}
          <h1 className="text-3xl font-bold tracking-tight">{category.title} Calculators</h1>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {category.calculators.map((calculator: any, index: number) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{calculator.name}</CardTitle>
              <CardDescription>{calculator.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {calculator.component ? (
                <div className="h-48 overflow-hidden">{calculator.component}</div>
              ) : (
                <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
                  <p className="text-muted-foreground">Calculator preview not available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/calculators/${category.slug}/${calculator.slug}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Free Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

