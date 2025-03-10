import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Free Online Calculators</h1>
        <p className="text-lg text-muted-foreground">Find the perfect calculator for any task - no signup required</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Math", "Finance", "Business"].map((category, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Popular {category} calculators</p>
              <Link href={`/calculators/${category.toLowerCase()}`}>
                <Button className="mt-4 w-full">View All {category} Calculators</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

