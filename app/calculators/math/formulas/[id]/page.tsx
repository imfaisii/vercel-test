import FormulaDetail from "@/components/math-formula-game/formula-detail"
import { getFormulaById } from "@/lib/math-formulas-data"
import { notFound } from "next/navigation"

interface FormulaPageProps {
  params: {
    id: string
  }
}

export default function FormulaPage({ params }: FormulaPageProps) {
  const formula = getFormulaById(params.id)

  if (!formula) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <FormulaDetail formula={formula} />
    </div>
  )
}

