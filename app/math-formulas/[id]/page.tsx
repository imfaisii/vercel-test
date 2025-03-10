import { notFound } from "next/navigation"
import { getAllFormulas } from "@/lib/math-formulas-data"
import FormulaDetail from "@/components/math-formula-game/formula-detail"
import { Breadcrumb } from "@/components/breadcrumb"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const formulas = getAllFormulas()
  const formula = formulas.find((f) => f.id === params.id)

  if (!formula) {
    return {
      title: "Formula Not Found",
      description: "The requested math formula could not be found.",
    }
  }

  return {
    title: `${formula.title} | Math Formula Library`,
    description: `Learn about ${formula.title} with interactive examples and explanations. Master this essential math formula with our visual learning tools.`,
  }
}

export default function FormulaPage({ params }: { params: { id: string } }) {
  const formulas = getAllFormulas()
  const formula = formulas.find((f) => f.id === params.id)

  if (!formula) {
    notFound()
  }

  const breadcrumbItems = [
    {
      label: "Math Formula Library",
      href: "/math-formulas",
    },
    {
      label: formula.title,
      href: `/math-formulas/${formula.id}`,
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <FormulaDetail formula={formula} />
    </div>
  )
}

