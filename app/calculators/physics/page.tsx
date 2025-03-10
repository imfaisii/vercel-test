import Link from "next/link"
import { getCategoryData } from "@/lib/calculator-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EnergyCalculator from "@/components/calculators/physics/energy"
import ForceCalculator from "@/components/calculators/physics/force"
import VelocityCalculator from "@/components/calculators/physics/velocity"
import PressureCalculator from "@/components/calculators/physics/pressure"
import { Breadcrumb } from "@/components/breadcrumb"

export default function PhysicsCalculatorsPage() {
  const category = getCategoryData("physics")

  if (!category) {
    return <div>Category not found</div>
  }

  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Physics Calculators",
      href: "/calculators/physics",
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
        {category.calculators.map((calculator, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{calculator.name}</CardTitle>
              <CardDescription>{calculator.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 overflow-hidden">
                {index === 0 && <EnergyCalculator />}
                {index === 1 && <ForceCalculator />}
                {index === 2 && <VelocityCalculator />}
                {index === 3 && <PressureCalculator />}
              </div>
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

