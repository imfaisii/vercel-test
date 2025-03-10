import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formulas } from "@/lib/math-formulas-data"

export default function MathFormulasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-2">Math Formulas Library</h1>
        <p className="text-lg text-muted-foreground">
          Master essential math formulas with our interactive learning tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {formulas.map((formula) => (
          <Card key={formula.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{formula.title}</CardTitle>
                <Badge>{formula.category}</Badge>
              </div>
              <CardDescription>
                {formula.difficulty} • {formula.points} points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md flex justify-center mb-4">
                <div className="text-xl font-mono">{formula.formula}</div>
              </div>
              <p className="text-sm">{formula.description}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Learn This Formula</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground mb-4">More formulas and interactive features coming soon!</p>
        <Link href="/">
          <Button variant="outline">Return to Homepage</Button>
        </Link>
      </div>
    </div>
  )
}

